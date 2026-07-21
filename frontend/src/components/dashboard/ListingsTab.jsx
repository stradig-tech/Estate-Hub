import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '@/api/services';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/format';

export default function ListingsTab({ user }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        propertyService.list({ agent_id: user.id })
            .then(data => setListings(data.results || data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [user.id]);

    const handleDelete = async (id) => {
        if (!confirm('Delete this listing?')) return;
        await propertyService.delete(id);
        load();
    };

    const statusBadge = (status) => {
        if (status === 'active') return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
        if (status === 'pending') return <Badge className="bg-amber-500 text-white"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
    };

    if (loading) return <div className="py-10 text-center text-muted-foreground">Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button asChild><Link to="/submit-property"><Plus className="w-4 h-4 mr-1" /> Add New Listing</Link></Button>
            </div>
            {listings.length === 0 ? (
                <Card className="p-10 text-center">
                    <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
                    <Button asChild><Link to="/submit-property"><Plus className="w-4 h-4 mr-1" /> List Your First Property</Link></Button>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Listed</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listings.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium max-w-xs truncate">
                                        <Link to={`/properties/${p.id}`} className="hover:text-primary">{p.title}</Link>
                                    </TableCell>
                                    <TableCell>{formatPrice(p.price, p.listing_type)}</TableCell>
                                    <TableCell>{statusBadge(p.status)}</TableCell>
                                    <TableCell><span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {p.views || 0}</span></TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{formatDate(p.created_date)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button asChild variant="ghost" size="sm"><Link to={`/submit-property?edit=${p.id}`}><Edit className="w-4 h-4" /></Link></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}