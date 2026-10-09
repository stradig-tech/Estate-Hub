import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { propertyService, userService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    CheckCircle,
    XCircle,
    Building2,
    Users,
    Clock,
    TrendingUp,
    Eye,
    Trash2,
    MapPin,
    Bed,
    Bath,
    Maximize,
    Car,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { formatPrice, formatDate, formatNumber } from '@/lib/format';

export default function Admin() {
    const { user, isAuthenticated, isLoadingAuth } = useAuth();
    const { toast } = useToast();

    const [pending, setPending] = useState([]);
    const [allProps, setAllProps] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    // Modals
    const [reviewProp, setReviewProp] = useState(null);
    const [rejectProp, setRejectProp] = useState(null);
    const [rejectNote, setRejectNote] = useState('');
    const [deleteProp, setDeleteProp] = useState(null);
    const [deleting, setDeleting] = useState(false);

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
            console.error('Failed to load admin data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleApprove = async (id) => {
        try {
            await propertyService.update(id, { status: 'active' });
            if (reviewProp?.id === id) {
                setReviewProp(null);
            }
            toast({
                title: "Property Approved!",
                description: "The listing is now active and live on the display website.",
            });
            load();
        } catch (err) {
            toast({
                title: "Approval failed",
                description: err.response?.data?.detail || "Could not approve property.",
                variant: "destructive",
            });
        }
    };

    const handleReject = async () => {
        if (!rejectProp) return;
        try {
            await propertyService.update(rejectProp.id, {
                status: 'rejected',
                rejection_note: rejectNote.trim() || 'Rejected by administrator.',
            });
            toast({
                title: "Property Rejected",
                description: "The listing status was changed to rejected.",
                variant: "destructive",
            });
            setRejectProp(null);
            setRejectNote('');
            if (reviewProp?.id === rejectProp.id) {
                setReviewProp(null);
            }
            load();
        } catch (err) {
            toast({
                title: "Rejection failed",
                description: err.response?.data?.detail || "Could not reject property.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        if (!deleteProp) return;
        setDeleting(true);
        try {
            await propertyService.delete(deleteProp.id);
            toast({
                title: "Property Deleted",
                description: `"${deleteProp.title}" was permanently removed.`,
            });
            setDeleteProp(null);
            if (reviewProp?.id === deleteProp.id) {
                setReviewProp(null);
            }
            load();
        } catch (err) {
            toast({
                title: "Delete failed",
                description: err.response?.data?.detail || "Could not delete property.",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    if (isLoadingAuth || loading) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (user?.role !== 'admin') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <XCircle className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
                <p className="text-muted-foreground">You need administrator privileges to access this dashboard.</p>
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Management Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Review pending property submissions, approve active listings, and manage accounts.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <a href={import.meta.env.VITE_ADMIN_URL || (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '/admin/') : 'http://localhost:8000/admin/')} target="_blank" rel="noopener noreferrer" className="gap-1.5 text-xs font-semibold">
                        <ExternalLink className="w-4 h-4" /> Open Full Django Admin Panel
                    </a>
                </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-2">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'pending'
                            ? 'bg-amber-500 text-white'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                    Pending Review ({pending.length})
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'active'
                            ? 'bg-emerald-600 text-white'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                    Live on Display ({allProps.length})
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'users'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                    Users Directory ({users.length})
                </button>
            </div>

            {/* Tab 1: Pending Listings */}
            {activeTab === 'pending' && (
                <Card className="overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold">Listings Awaiting Moderation ({pending.length})</h2>
                            <p className="text-xs text-muted-foreground">
                                Click "Review Details" to inspect photos and info without leaving the dashboard.
                            </p>
                        </div>
                    </div>
                    {pending.length === 0 ? (
                        <p className="p-10 text-center text-muted-foreground text-sm">
                            ✓ No pending listings to review. All submitted properties have been processed.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Property Title</TableHead>
                                    <TableHead>Agent</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead className="text-right">Admin Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pending.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">
                                            {/* In-dashboard click: does NOT redirect out to customer page */}
                                            <button
                                                type="button"
                                                onClick={() => setReviewProp(p)}
                                                className="text-left font-semibold text-primary hover:underline flex items-center gap-1.5"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> {p.title}
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-sm">{p.agent_name || 'Agent'}</TableCell>
                                        <TableCell className="font-semibold">{formatPrice(p.price, p.listing_type)}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{formatDate(p.created_date)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setReviewProp(p)}
                                                    className="h-8 text-xs gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> Review Details
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(p.id)}
                                                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" /> Approve & Make Live
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setRejectProp(p)}
                                                    className="h-8 text-xs text-amber-600 border-amber-200 hover:bg-amber-50 gap-1"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setDeleteProp(p)}
                                                    className="h-8 px-2 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            )}

            {/* Tab 2: Live Listings */}
            {activeTab === 'active' && (
                <Card className="overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-semibold">Active Listings Live on Display ({allProps.length})</h2>
                    </div>
                    {allProps.length === 0 ? (
                        <p className="p-10 text-center text-muted-foreground text-sm">No active listings.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Agent</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allProps.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">
                                            <button
                                                type="button"
                                                onClick={() => setReviewProp(p)}
                                                className="text-left font-semibold text-foreground hover:text-primary hover:underline flex items-center gap-1.5"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-muted-foreground" /> {p.title}
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-sm">{p.agent_name || 'Agent'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {p.listing_type === 'for_sale' ? 'For Sale' : 'For Rent'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">{formatPrice(p.price, p.listing_type)}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{p.views || 0}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setReviewProp(p)}
                                                    className="h-8 text-xs gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Details
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setDeleteProp(p)}
                                                    className="h-8 px-2 text-muted-foreground hover:text-destructive hover:border-destructive/30"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            )}

            {/* Tab 3: Users */}
            {activeTab === 'users' && (
                <Card className="overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-semibold">Registered Users ({users.length})</h2>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Agent Status</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(u => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.full_name || u.username}</TableCell>
                                    <TableCell className="text-sm">{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.role === 'admin' ? 'default' : u.role === 'agent' ? 'secondary' : 'outline'}>
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {u.role === 'agent' ? (
                                            <Badge className={u.agent_status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}>
                                                {u.agent_status || 'approved'}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell><Badge variant="secondary">{u.subscription_plan || 'Free'}</Badge></TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{formatDate(u.created_date)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* In-Dashboard Property Review Modal (Does NOT redirect to customer page) */}
            <Dialog open={!!reviewProp} onOpenChange={(open) => { if (!open) setReviewProp(null); }}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    {reviewProp && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className={reviewProp.status === 'active' ? 'bg-emerald-600 text-white' : reviewProp.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-destructive text-destructive-foreground'}>
                                        {reviewProp.status === 'active' ? 'Live on Display' : reviewProp.status === 'pending' ? 'Pending Review' : 'Rejected'}
                                    </Badge>
                                    <Badge variant="outline">
                                        {reviewProp.listing_type === 'for_sale' ? 'For Sale' : 'For Rent'}
                                    </Badge>
                                </div>
                                <DialogTitle className="text-xl font-bold">
                                    {reviewProp.title}
                                </DialogTitle>
                                <DialogDescription className="text-sm flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {reviewProp.address ? `${reviewProp.address}, ` : ''}{reviewProp.city}, {reviewProp.state} {reviewProp.zip_code}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                {/* Price & Agent Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
                                    <div>
                                        <span className="text-xs text-muted-foreground">Listing Price</span>
                                        <p className="text-2xl font-bold text-primary">
                                            {formatPrice(reviewProp.price, reviewProp.listing_type)}
                                        </p>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1 sm:text-right">
                                        <p><strong>Submitting Agent:</strong> {reviewProp.agent_name || 'Agent'}</p>
                                        <p><strong>Submitted Date:</strong> {formatDate(reviewProp.created_date)}</p>
                                        <p><strong>Total Views:</strong> {reviewProp.views || 0}</p>
                                    </div>
                                </div>

                                {/* Images Gallery Preview */}
                                {reviewProp.images && reviewProp.images.length > 0 && (
                                    <div>
                                        <Label className="text-xs uppercase text-muted-foreground mb-1.5 block">Listing Photos ({reviewProp.images.length})</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {reviewProp.images.map((img, idx) => (
                                                <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border">
                                                    <img
                                                        src={img}
                                                        alt={`Listing Photo ${idx + 1}`}
                                                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'; }}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Specs */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/20 border border-border text-xs">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-4 h-4 text-primary" />
                                        <span><strong>{reviewProp.bedrooms}</strong> Bedrooms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-4 h-4 text-primary" />
                                        <span><strong>{reviewProp.bathrooms}</strong> Bathrooms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Maximize className="w-4 h-4 text-primary" />
                                        <span><strong>{formatNumber(reviewProp.size)}</strong> Sqft</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-primary" />
                                        <span><strong>{reviewProp.parking || 0}</strong> Parking</span>
                                    </div>
                                </div>

                                {/* Description */}
                                {reviewProp.description && (
                                    <div>
                                        <Label className="text-xs uppercase text-muted-foreground mb-1 block">Description</Label>
                                        <p className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                                            {reviewProp.description}
                                        </p>
                                    </div>
                                )}

                                {/* Amenities */}
                                {reviewProp.amenities?.length > 0 && (
                                    <div>
                                        <Label className="text-xs uppercase text-muted-foreground mb-1.5 block">Amenities</Label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {reviewProp.amenities.map(a => (
                                                <Badge key={a} variant="outline" className="text-xs font-normal">
                                                    ✓ {a}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Floor Plans */}
                                {((reviewProp.floor_plan_images?.length > 0) || reviewProp.floor_plan_image) && (
                                    <div>
                                        <Label className="text-xs uppercase text-muted-foreground mb-1.5 block">
                                            Floor Plans ({reviewProp.floor_plan_images?.length || 1})
                                        </Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(reviewProp.floor_plan_images?.length > 0 ? reviewProp.floor_plan_images : [reviewProp.floor_plan_image]).map((fp, i) => (
                                                <a key={i} href={fp} target="_blank" rel="noopener noreferrer" className="block relative aspect-video rounded-lg overflow-hidden border border-border bg-slate-50 hover:opacity-90">
                                                    <img src={fp} alt={`Floor plan ${i + 1}`} className="w-full h-full object-contain p-1" />
                                                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">Plan #{i + 1}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="flex flex-col sm:flex-row gap-2 border-t border-border pt-3">
                                {reviewProp.status === 'active' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="gap-1.5 text-xs"
                                    >
                                        <a href={`/properties/${reviewProp.id}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3.5 h-3.5" /> Open Public Customer View
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        const p = reviewProp;
                                        setReviewProp(null);
                                        setDeleteProp(p);
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </Button>
                                {reviewProp.status !== 'active' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 text-xs text-amber-600 hover:bg-amber-50"
                                            onClick={() => {
                                                const p = reviewProp;
                                                setReviewProp(null);
                                                setRejectProp(p);
                                            }}
                                        >
                                            <XCircle className="w-3.5 h-3.5" /> Reject Listing
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => handleApprove(reviewProp.id)}
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" /> Approve & Show on Display
                                        </Button>
                                    </>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Rejection Modal */}
            <Dialog open={!!rejectProp} onOpenChange={(open) => { if (!open) { setRejectProp(null); setRejectNote(''); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-amber-600 flex items-center gap-2">
                            <XCircle className="w-5 h-5" /> Reject Property Submission
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            Rejecting <strong>"{rejectProp?.title}"</strong> will notify the agent to update and resubmit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <Label htmlFor="rejection-note">Reason for Rejection / Feedback for Agent</Label>
                        <Textarea
                            id="rejection-note"
                            value={rejectNote}
                            onChange={e => setRejectNote(e.target.value)}
                            placeholder="e.g. Please provide clearer photos or update the square footage..."
                            rows={3}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => { setRejectProp(null); setRejectNote(''); }}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject}>
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={!!deleteProp} onOpenChange={(open) => { if (!open) setDeleteProp(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Delete Property
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            Are you sure you want to permanently delete <strong>"{deleteProp?.title}"</strong>? 
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-3">
                        <Button variant="outline" onClick={() => setDeleteProp(null)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                                </>
                            ) : (
                                "Yes, Delete Property"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}