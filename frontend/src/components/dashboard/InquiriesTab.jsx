import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inquiryService } from '@/api/services';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/format';

export default function InquiriesTab({ user }) {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        inquiryService.list({ agent_id: user.id, ordering: '-created_date' })
            .then(data => setInquiries(data.results || data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [user.id]);

    if (loading) return <div className="py-10 text-center text-muted-foreground">Loading...</div>;

    if (inquiries.length === 0) {
        return (
            <Card className="p-10 text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No inquiries yet. They'll appear here when someone contacts you about your listings.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {inquiries.map(inq => (
                <Card key={inq.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{inq.name}</span>
                                <Badge className={inq.status === 'new' ? 'bg-blue-500 text-white' : inq.status === 'read' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}>
                                    {inq.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                                <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3.5 h-3.5" /> {inq.email}</a>
                                {inq.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {inq.phone}</span>}
                            </div>
                            <p className="text-sm mt-2">{inq.message}</p>
                            <div className="flex items-center gap-2 pt-2">
                                <Link to={`/properties/${inq.property_id}`} className="text-xs text-primary hover:underline">{inq.property_title}</Link>
                                <span className="text-xs text-muted-foreground">· {formatDate(inq.created_date)}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}