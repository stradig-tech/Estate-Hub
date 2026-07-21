import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Clock, Star, BadgeCheck, Search, Calendar, ChevronDown, 
    MoreVertical, Edit, Trash, CheckCircle2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { propertyService, favoriteService, reviewService, inquiryService } from '@/api/services';
import moment from 'moment';

// --- MOCK CHART DATA ---
// Real analytics data requires a dedicated time-series backend endpoint.
const chartData = [
    { name: 'Jan', value: 40 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 70 },
    { name: 'Apr', value: 65 },
    { name: 'May', value: 140 },
    { name: 'Jun', value: 130 },
    { name: 'Jul', value: 145 },
    { name: 'Aug', value: 145 },
    { name: 'Sep', value: 160 },
    { name: 'Oct', value: 135 },
    { name: 'Nov', value: 140 },
    { name: 'Dec', value: 130 },
];

// --- COMPONENTS ---
const StatCard = ({ icon: Icon, title, value, subtext, iconColor, iconBg }) => (
    <Card className="flex items-center gap-4 p-5">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                {subtext && <span className="text-xs text-slate-400 font-medium">{subtext}</span>}
            </div>
        </div>
    </Card>
);

const StatusBadge = ({ status }) => {
    let bg = 'bg-emerald-100', text = 'text-emerald-600';
    if (status === 'pending') { bg = 'bg-orange-100'; text = 'text-orange-600'; }
    if (status === 'sold') { bg = 'bg-indigo-100'; text = 'text-indigo-600'; }
    return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${bg} ${text}`}>
            {status}
        </span>
    );
};

// --- MAIN PAGE ---
export default function Dashboard() {
    const { user, isAuthenticated, isLoadingAuth } = useAuth();
    const [chartTab, setChartTab] = useState('Month');

    // Dynamic State
    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch all related data in parallel
                const [propsRes, favsRes, revsRes, msgsRes] = await Promise.all([
                    propertyService.list({ agent_id: user.id }),
                    favoriteService.list(),
                    reviewService.list({ agent_id: user.id }),
                    inquiryService.list({ agent_id: user.id })
                ]);
                
                // Assuming paginated responses (DRF standard), the data is in `.results`
                setProperties(propsRes.results || propsRes || []);
                setFavorites(favsRes.results || favsRes || []);
                setReviews(revsRes.results || revsRes || []);
                setMessages(msgsRes.results || msgsRes || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [user]);

    if (isLoadingAuth) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const pendingPropertiesCount = properties.filter(p => p.status === 'pending').length;

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={LayoutDashboard} title="Your listing" value={properties.length} subtext="/50 remaining" 
                    iconColor="text-blue-500" iconBg="bg-blue-50 border border-blue-100" 
                />
                <StatCard 
                    icon={Clock} title="Pending" value={pendingPropertiesCount < 10 ? `0${pendingPropertiesCount}` : pendingPropertiesCount} 
                    iconColor="text-blue-500" iconBg="bg-blue-50 border border-blue-100" 
                />
                <StatCard 
                    icon={Star} title="Favorites" value={favorites.length < 10 ? `0${favorites.length}` : favorites.length} 
                    iconColor="text-blue-500" iconBg="bg-blue-50 border border-blue-100" 
                />
                <StatCard 
                    icon={BadgeCheck} title="Reviews" value={reviews.length} 
                    iconColor="text-blue-500" iconBg="bg-blue-50 border border-blue-100" 
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column (2/3) */}
                <div className="xl:col-span-2 space-y-6">
                    
                    {/* New Listing Section */}
                    <Card className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">New Listing</h2>
                            
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="Search" className="pl-9 h-10 bg-slate-50/50" />
                                </div>
                                <div className="relative w-[140px]">
                                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="From Date" className="h-10 pr-9 bg-slate-50/50 text-sm" />
                                </div>
                                <div className="relative w-[140px]">
                                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="To Date" className="h-10 pr-9 bg-slate-50/50 text-sm" />
                                </div>
                                <div className="relative w-[120px]">
                                    <select className="w-full h-10 px-3 py-2 bg-slate-50/50 border border-input rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        <option>Select</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            
                            <p className="text-sm font-medium text-slate-500"><span className="text-primary font-bold">{properties.length}</span> Results found</p>
                        </div>

                        {/* Listings Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 text-slate-200 text-sm">
                                        <th className="font-semibold py-3 px-6">Listing</th>
                                        <th className="font-semibold py-3 px-6">Status</th>
                                        <th className="font-semibold py-3 px-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingData ? (
                                        <tr><td colSpan="3" className="p-6 text-center text-slate-500">Loading...</td></tr>
                                    ) : properties.length === 0 ? (
                                        <tr><td colSpan="3" className="p-6 text-center text-slate-500">No properties found.</td></tr>
                                    ) : properties.slice(0, 5).map((listing, index) => (
                                        <tr key={listing.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${index === properties.length - 1 ? 'border-none' : ''}`}>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <Link to={`/dashboard/properties/${listing.id}`} className="shrink-0 block">
                                                        <img src={listing.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80'} alt={listing.title} className="w-32 h-20 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                                                    </Link>
                                                    <div>
                                                        <Link to={`/dashboard/properties/${listing.id}`} className="font-semibold text-slate-800 mb-1 hover:text-primary transition-colors block">{listing.title}</Link>
                                                        <p className="text-xs text-slate-400 mb-2">Posting date: {moment(listing.created_date).format('MMMM DD, YYYY')}</p>
                                                        <p className="text-sm font-bold text-primary">${listing.price?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 align-top pt-8">
                                                <StatusBadge status={listing.status} />
                                            </td>
                                            <td className="p-6 align-top pt-8">
                                                <div className="flex flex-col gap-2 text-xs font-medium text-slate-500">
                                                    <Link to={`/submit-property?edit=${listing.id}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Edit className="w-3.5 h-3.5" /> Edit</Link>
                                                    <button className="flex items-center gap-2 hover:text-primary transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /> Sold</button>
                                                    <button className="flex items-center gap-2 hover:text-destructive transition-colors"><Trash className="w-3.5 h-3.5" /> Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="p-6 flex items-center gap-2 border-t border-slate-100">
                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-slate-200"><ChevronLeft className="w-4 h-4" /></Button>
                            <Button variant="default" size="sm" className="w-8 h-8 rounded-full bg-primary text-white hover:bg-primary/90">1</Button>
                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-slate-200"><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                    </Card>

                    {/* Chart Section */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Page Inside</h2>
                        
                        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                            <div className="flex items-center gap-2">
                                {['Day', 'Week', 'Month', 'Year'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setChartTab(tab)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                            chartTab === tab 
                                                ? 'bg-slate-900 text-white' 
                                                : 'text-slate-500 hover:bg-slate-100'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <div className="relative w-[140px]">
                                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="From Date" className="h-9 pr-9 bg-transparent border-slate-200 text-sm rounded-full" />
                                </div>
                                <div className="relative w-[140px]">
                                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="To Date" className="h-9 pr-9 bg-transparent border-slate-200 text-sm rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                        dy={10} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#3b82f6" 
                                        strokeWidth={2} 
                                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                                        activeDot={{ r: 6 }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-6">
                    
                    {/* Messages */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Messages</h2>
                        <div className="space-y-6">
                            {isLoadingData ? (
                                <p className="text-sm text-slate-500">Loading...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-sm text-slate-500">No messages yet.</p>
                            ) : messages.map(msg => (
                                <div key={msg.id} className="group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                            {msg.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-slate-800 text-sm truncate">{msg.name}</h4>
                                                <span className="text-xs text-slate-400 shrink-0">{moment(msg.created_date).fromNow()}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-slate-100 mt-6 group-last:hidden" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Reviews */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Reviews</h2>
                        <div className="space-y-6">
                            {isLoadingData ? (
                                <p className="text-sm text-slate-500">Loading...</p>
                            ) : reviews.length === 0 ? (
                                <p className="text-sm text-slate-500">No reviews yet.</p>
                            ) : reviews.map(review => (
                                <div key={review.id} className="group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                            {review.user?.first_name?.charAt(0) || review.reviewer_name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold text-slate-800 text-sm truncate">{review.user?.first_name || review.reviewer_name || 'Anonymous User'}</h4>
                                                <span className="text-xs text-slate-400 shrink-0">{moment(review.created_date).fromNow()}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-2">
                                                {review.comment}
                                            </p>
                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-slate-100 mt-6 group-last:hidden" />
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
            
            <div className="py-6 text-center text-sm text-slate-400">
                Copyright © 2026 EstateHub
            </div>
        </div>
    );
}