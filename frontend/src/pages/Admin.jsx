import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { propertyService, userService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Building2, Users, Clock, TrendingUp } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/format';

export default function Admin() {
    const { user, isAuthenticated, isLoadingAuth } = useAuth();
    const [pending, setPending] = useState([]);
    const [allProps, setAllProps] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectProp, setRejectProp] = useState(null);
    const [rejectNote, setRejectNote] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const [pendingData, activeData, usersData] = await Promise.all([
                propertyService.list({ status: 'pending' }),
                propertyService.list({ status: 'active', limit: 100 }),
                userService.list(),
            ]);
            setPending(pendingData.results || pendingData);
            setAllProps(activeData.results || activeData);
            setUsers(usersData.results || usersData);
        } catch (e) {
            // no-op
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleApprove = async (id) => {
        await propertyService.update(id, { status: 'active' });
        load();
    };

    const handleReject = async () => {
        if (!rejectProp) return;
        await propertyService.update(rejectProp.id, { status: 'rejected', rejection_note: rejectNote });
        setRejectProp(null);
        setRejectNote('');
        load();
    };

    if (isLoadingAuth || loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role !== 'admin') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <XCircle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
                <p className="text-muted-foreground">You need admin privileges to access this page.</p>
            </div>
        );
    }

    const stats = [
        { icon: Building2, label: 'Total Properties', value: pending.length + allProps.length },
        { icon: TrendingUp, label: 'Active Listings', value: allProps.length },
        { icon: Clock, label: 'Pending Review', value: pending.length },
        { icon: Users, label: 'Total Users', value: users.length },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <Card key={i} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <s.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground">{s.label}</span>
                        </div>
                        <p className="text-2xl font-bold">{s.value}</p>
                    </Card>
                ))}
            </div>

            <Card className="mb-8 overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h2 className="font-semibold">Pending Listings ({pending.length})</h2>
                </div>
                {pending.length === 0 ? (
                    <p className="p-6 text-center text-muted-foreground">No pending listings to review.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Agent</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pending.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        <a href={`/properties/${p.id}`} target="_blank" rel="noopener" className="hover:text-primary">{p.title}</a>
                                    </TableCell>
                                    <TableCell>{p.agent_name}</TableCell>
                                    <TableCell>{formatPrice(p.price, p.listing_type)}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{formatDate(p.created_date)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-green-600 hover:bg-green-700">
                                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setRejectProp(p)} className="text-red-600 border-red-200 hover:bg-red-50">
                                                <XCircle className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            <Card className="overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h2 className="font-semibold">Users ({users.length})</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(u => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.full_name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                                <TableCell><Badge variant="secondary">{u.subscription_plan || 'Free'}</Badge></TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(u.created_date)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={!!rejectProp} onOpenChange={(open) => { if (!open) { setRejectProp(null); setRejectNote(''); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Listing</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Are you sure you want to reject "{rejectProp?.title}"?</p>
                        <div>
                            <Label className="mb-1.5 block">Rejection Note (optional)</Label>
                            <Textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Reason for rejection..." rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setRejectProp(null); setRejectNote(''); }}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject}>Reject Listing</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}