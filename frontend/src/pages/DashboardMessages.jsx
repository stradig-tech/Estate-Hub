import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { inquiryService } from '@/api/services';
import { 
    Mail, Phone, Calendar, User, MessageCircle, Send, Search, 
    Home, CheckCheck, Clock, ExternalLink, Sparkles, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function DashboardMessages() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const chatEndRef = useRef(null);
    const inquiryParamId = searchParams.get('inquiry');

    // Fetch all inquiries accessible to current user
    const fetchInquiries = async (quiet = false) => {
        if (!quiet) setLoading(true);
        try {
            const data = await inquiryService.list();
            const list = data.results || data || [];
            setInquiries(list);

            // Select inquiry
            if (inquiryParamId) {
                const found = list.find(i => String(i.id) === String(inquiryParamId));
                if (found) setSelectedInquiry(found);
            } else if (!selectedInquiry && list.length > 0) {
                setSelectedInquiry(list[0]);
            } else if (selectedInquiry) {
                // Refresh currently selected inquiry data quietly
                const updated = list.find(i => String(i.id) === String(selectedInquiry.id));
                if (updated) setSelectedInquiry(updated);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries:", error);
        } finally {
            if (!quiet) setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchInquiries();
        }
    }, [user, inquiryParamId]);

    // Background polling every 8 seconds to receive new messages in real time
    useEffect(() => {
        if (!user?.id) return;
        const interval = setInterval(() => {
            fetchInquiries(true);
        }, 8000);
        return () => clearInterval(interval);
    }, [user, selectedInquiry?.id]);

    // Auto-scroll chat to bottom
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedInquiry?.messages?.length, selectedInquiry?.id]);

    // Send reply
    const handleSendReply = async (e) => {
        if (e) e.preventDefault();
        const text = replyText.trim();
        if (!text || !selectedInquiry || sending) return;

        setSending(true);
        try {
            const updated = await inquiryService.reply(selectedInquiry.id, text);
            setReplyText('');
            setSelectedInquiry(updated);
            
            // Update in list
            setInquiries(prev => prev.map(inq => inq.id === updated.id ? updated : inq));
            
            toast({
                title: "Message sent",
                description: "Your reply has been delivered.",
            });
        } catch (err) {
            toast({
                title: "Failed to send message",
                description: err.response?.data?.error || "Could not deliver your reply.",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    // Filter inquiries
    const filteredInquiries = inquiries.filter(inq => {
        if (statusFilter === 'unread' && inq.status !== 'new') return false;
        if (statusFilter === 'replied' && inq.status !== 'replied') return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            inq.name?.toLowerCase().includes(q) ||
            inq.email?.toLowerCase().includes(q) ||
            inq.property_title?.toLowerCase().includes(q) ||
            inq.message?.toLowerCase().includes(q)
        );
    });

    const isUserAgent = (inq) => {
        return Boolean(inq && user && String(inq.agent_id) === String(user.id));
    };

    const isAgent = isUserAgent(selectedInquiry);
    // Dynamic quick reply templates based on whether current user is Agent or Customer
    const quickReplies = isAgent ? [
        "👋 Hello! Thank you for reaching out. When would you like to schedule a viewing?",
        "🏡 Yes, this property is currently available. Would you like more details?",
        "📞 I would be happy to discuss this over a call. When is a good time for you?",
    ] : [
        "📅 Could we schedule an in-person tour for this property?",
        "🏡 Is this property still available for viewing?",
        "📋 Could you share more information about the pricing and terms?",
    ];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Messages & Inquiries</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">
                        Direct communication between agents and clients for property inquiries.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchInquiries(false)} 
                        className="gap-1.5 text-xs h-8"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {loading && inquiries.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-border">
                    <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
                </div>
            ) : inquiries.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border border-border p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No messages yet</h3>
                    <p className="text-slate-500 max-w-md text-sm mb-6">
                        When clients inquire about properties or send showing requests, their conversations will appear here.
                    </p>
                    <Button asChild>
                        <Link to="/listings">Browse Properties</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden bg-white rounded-xl border border-border shadow-sm">
                    {/* LEFT PANEL: Conversation List */}
                    <div className={`md:col-span-5 lg:col-span-4 border-r border-border flex flex-col h-full overflow-hidden ${selectedInquiry ? 'hidden md:flex' : 'flex'}`}>
                        {/* Search & Filter Header */}
                        <div className="p-3 border-b border-border space-y-2 bg-slate-50/70 shrink-0">
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                <Input 
                                    placeholder="Search by client or property..." 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 text-xs bg-white"
                                />
                            </div>
                            <div className="flex gap-1">
                                {['all', 'unread', 'replied'].map(f => (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => setStatusFilter(f)}
                                        className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                                            statusFilter === f 
                                                ? 'bg-primary text-white' 
                                                : 'text-slate-600 hover:bg-slate-200/60'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
                            {filteredInquiries.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-400">
                                    No conversations match your search.
                                </div>
                            ) : (
                                filteredInquiries.map(inq => {
                                    const isSelected = selectedInquiry?.id === inq.id;
                                    const last = inq.last_message;
                                    const isAgent = isUserAgent(inq);
                                    const displayName = isAgent ? inq.name : (inq.agent_name || 'Listing Agent');
                                    const displayAvatar = isAgent ? inq.customer_avatar : inq.agent_avatar;

                                    return (
                                        <div
                                            key={inq.id}
                                            onClick={() => setSelectedInquiry(inq)}
                                            className={`p-3.5 cursor-pointer transition-all hover:bg-slate-50 relative ${
                                                isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-slate-200">
                                                        {displayAvatar ? (
                                                            <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            displayName.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                                                            {displayName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 shrink-0">
                                                    {inq.created_date ? formatDistanceToNow(new Date(inq.updated_date || inq.created_date), { addSuffix: false }) : ''}
                                                </span>
                                            </div>

                                            {inq.property_title && (
                                                <div className="flex items-center gap-1 text-[11px] font-medium text-primary mb-1 truncate">
                                                    <Home className="w-3 h-3 shrink-0" />
                                                    <span className="truncate">{inq.property_title}</span>
                                                </div>
                                            )}

                                            <p className="text-xs text-slate-500 line-clamp-1 mb-1.5">
                                                {last?.message || inq.message}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-slate-400">
                                                    {(inq.messages?.length || 0) + 1} message{((inq.messages?.length || 0) + 1) !== 1 ? 's' : ''}
                                                </span>
                                                <Badge 
                                                    variant={inq.status === 'replied' ? 'outline' : inq.status === 'read' ? 'secondary' : 'default'}
                                                    className={`text-[10px] uppercase font-semibold px-1.5 py-0 ${
                                                        inq.status === 'new' ? 'bg-blue-600 text-white' :
                                                        inq.status === 'replied' ? 'border-emerald-600 text-emerald-700 bg-emerald-50' :
                                                        'bg-slate-200 text-slate-700'
                                                    }`}
                                                >
                                                    {inq.status === 'replied' ? '✓ Replied' : inq.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Active Chat Thread */}
                    <div className={`md:col-span-7 lg:col-span-8 flex flex-col h-full overflow-hidden ${selectedInquiry ? 'flex' : 'hidden md:flex'}`}>
                        {selectedInquiry ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-3.5 border-b border-border bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <button 
                                            type="button" 
                                            onClick={() => setSelectedInquiry(null)}
                                            className="md:hidden p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-slate-200">
                                            {(isAgent ? selectedInquiry.customer_avatar : selectedInquiry.agent_avatar) ? (
                                                <img 
                                                    src={isAgent ? selectedInquiry.customer_avatar : selectedInquiry.agent_avatar} 
                                                    alt="" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                (isAgent ? selectedInquiry.name : (selectedInquiry.agent_name || 'A')).charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                                                    {isAgent ? selectedInquiry.name : (selectedInquiry.agent_name || 'Listing Agent')}
                                                </h3>
                                                <Badge variant="outline" className="text-[10px] capitalize">
                                                    {isAgent ? 'Client' : 'Agent'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                {(isAgent ? selectedInquiry.email : (selectedInquiry.agent_email || selectedInquiry.email)) && (
                                                    <a 
                                                        href={`mailto:${isAgent ? selectedInquiry.email : (selectedInquiry.agent_email || selectedInquiry.email)}`} 
                                                        className="flex items-center gap-1 hover:text-primary"
                                                    >
                                                        <Mail className="w-3 h-3" /> {isAgent ? selectedInquiry.email : (selectedInquiry.agent_email || selectedInquiry.email)}
                                                    </a>
                                                )}
                                                {selectedInquiry.phone && isAgent && (
                                                    <a href={`tel:${selectedInquiry.phone}`} className="flex items-center gap-1 hover:text-primary">
                                                        <Phone className="w-3 h-3" /> {selectedInquiry.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Property Quick Link */}
                                    {selectedInquiry.property_id && (
                                        <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs h-8 shrink-0">
                                            <Link to={`/properties/${selectedInquiry.property_id}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3.5 h-3.5" /> View Property
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {/* Property Context Banner */}
                                {selectedInquiry.property_title && (
                                    <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 flex items-center justify-between text-xs text-slate-700 shrink-0">
                                        <div className="flex items-center gap-2 truncate">
                                            {selectedInquiry.property_image ? (
                                                <img 
                                                    src={selectedInquiry.property_image} 
                                                    alt="" 
                                                    className="w-8 h-8 rounded object-cover border border-border shrink-0" 
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                    <Home className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div className="truncate">
                                                <span className="font-semibold text-slate-900 truncate block">
                                                    {selectedInquiry.property_title}
                                                </span>
                                                {selectedInquiry.property_price && (
                                                    <span className="text-[11px] text-primary font-bold">
                                                        ${Number(selectedInquiry.property_price).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                                            {selectedInquiry.status}
                                        </Badge>
                                    </div>
                                )}

                                {/* Chat Message Feed */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
                                    {/* Date Divider */}
                                    <div className="flex items-center justify-center my-2">
                                        <span className="text-[11px] text-slate-400 bg-white px-3 py-0.5 rounded-full border border-border shadow-2xs">
                                            Inquiry created {selectedInquiry.created_date ? format(new Date(selectedInquiry.created_date), 'PPP p') : ''}
                                        </span>
                                    </div>

                                    {/* Initial Customer Message Bubble */}
                                    <div className={`flex flex-col ${!isAgent ? 'items-end' : 'items-start'} w-full`}>
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                                            <span className="font-semibold text-slate-800">
                                                {!isAgent ? 'You (Initial Inquiry)' : `${selectedInquiry.name} (Initial Inquiry)`}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] uppercase px-1 py-0">
                                                Customer
                                            </Badge>
                                            <span>•</span>
                                            <span>{selectedInquiry.created_date ? formatDistanceToNow(new Date(selectedInquiry.created_date), { addSuffix: true }) : ''}</span>
                                        </div>
                                        <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                                            !isAgent
                                                ? 'bg-primary text-white rounded-tr-sm'
                                                : 'bg-white border border-border text-slate-800 rounded-tl-sm'
                                        }`}>
                                            {selectedInquiry.message}
                                        </div>
                                    </div>

                                    {/* Message Thread (Replies back and forth) */}
                                    {selectedInquiry.messages?.map((msg) => {
                                        const isMyMessage = msg.sender === user?.id || (user?.email && msg.sender_email?.toLowerCase() === user?.email?.toLowerCase());

                                        return (
                                            <div 
                                                key={msg.id}
                                                className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} w-full`}
                                            >
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                                                    <span className="font-semibold text-slate-800">
                                                        {isMyMessage ? 'You' : msg.sender_name}
                                                    </span>
                                                    <Badge variant="outline" className="text-[9px] uppercase px-1 py-0">
                                                        {msg.sender_role}
                                                    </Badge>
                                                    <span>•</span>
                                                    <span>{msg.created_date ? formatDistanceToNow(new Date(msg.created_date), { addSuffix: true }) : ''}</span>
                                                </div>
                                                <div 
                                                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                                                        isMyMessage 
                                                            ? 'bg-primary text-white rounded-tr-sm' 
                                                            : 'bg-white border border-border text-slate-800 rounded-tl-sm'
                                                    }`}
                                                >
                                                    {msg.message}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Quick Reply Suggestions */}
                                <div className="px-4 pt-2 bg-white border-t border-border/60 flex items-center gap-1.5 overflow-x-auto pb-1.5 shrink-0">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span className="text-[11px] text-slate-400 font-medium shrink-0">Quick reply:</span>
                                    {quickReplies.map((q, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setReplyText(q)}
                                            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200 shrink-0"
                                        >
                                            {q.slice(0, 32)}...
                                        </button>
                                    ))}
                                </div>

                                {/* Reply Input Area */}
                                <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-border flex items-end gap-2 shrink-0">
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder={`Type your reply to ${isUserAgent(selectedInquiry) ? selectedInquiry.name : (selectedInquiry.agent_name || 'Agent')}... (Press Enter to send)`}
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendReply();
                                                }
                                            }}
                                            rows={2}
                                            className="resize-none text-xs sm:text-sm min-h-[50px] max-h-[100px] border-border"
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={!replyText.trim() || sending}
                                        className="h-10 px-4 gap-1.5 shrink-0"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>{sending ? 'Sending...' : 'Send'}</span>
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                                <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
                                <h4 className="font-semibold text-slate-700 text-base mb-1">No conversation selected</h4>
                                <p className="text-slate-400 text-xs max-w-xs">
                                    Choose an inquiry from the left panel to read the details and chat directly with the client.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
