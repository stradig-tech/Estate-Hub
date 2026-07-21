import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { inquiryService } from '@/api/services';
import { Mail, Phone, Calendar, User, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardMessages() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchMessages();
        }
    }, [user]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            // Fetch inquiries. Backend should ideally filter by property owner/agent
            const data = await inquiryService.list();
            setMessages(data.results || data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Messages & Inquiries</h1>
                <p className="text-slate-500 text-sm">Manage inquiries and showing requests from potential clients.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No messages yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        You don't have any inquiries or showing requests at the moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {messages.map(msg => (
                        <Card key={msg.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                            <CardHeader className="bg-slate-50/50 pb-4 border-b border-border/50">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {msg.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{msg.name}</CardTitle>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {msg.email}</span>
                                                {msg.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {msg.phone}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant={msg.inquiry_type === 'showing' ? 'default' : 'secondary'} className="capitalize">
                                            {msg.inquiry_type || 'General'}
                                        </Badge>
                                        <span className="text-xs text-slate-400">
                                            {msg.created_date ? formatDistanceToNow(new Date(msg.created_date), { addSuffix: true }) : ''}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {msg.property_title && (
                                    <div className="mb-4 text-sm font-medium text-slate-700 bg-slate-100/50 inline-block px-3 py-1.5 rounded-md border border-slate-200">
                                        Interested in: <span className="text-primary">{msg.property_title}</span>
                                    </div>
                                )}
                                <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm">
                                    <p className="whitespace-pre-line">{msg.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
