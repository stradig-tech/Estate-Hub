import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { propertyService } from '@/api/services';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Plus,
    Home as HomeIcon,
    Clock,
    Pencil,
    Trash2,
    Eye,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Bed,
    Bath,
    Maximize,
    MapPin,
    Car,
    Calendar,
    Loader2
} from 'lucide-react';
import { formatPrice, formatNumber, formatDate, PROPERTY_TYPES } from '@/lib/format';

export default function DashboardProperties() {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // Modals
    const [previewProperty, setPreviewProperty] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Pending agent check
    if (user?.role === 'agent' && user?.agent_status === 'pending') {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <div className="p-8 rounded-2xl bg-white border border-border shadow-sm">
                    <Clock className="w-14 h-14 mx-auto text-amber-500 mb-4 animate-pulse" />
                    <h2 className="text-2xl font-bold mb-2 text-foreground">Account Pending Admin Approval</h2>
                    <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                        Your agent account ({user?.agency_name || 'Agent'}) is awaiting review by our administrators. 
                        Property management and listings will be unlocked once approved.
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/dashboard/profile">View Profile</Link>
                    </Button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (user?.id) {
            fetchProperties();
        }
    }, [user]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const data = await propertyService.list({ agent_id: user.id });
            setProperties(data.results || data);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
            toast({
                title: "Error loading properties",
                description: "Could not retrieve your listings.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await propertyService.delete(deleteTarget.id);
            setProperties(prev => prev.filter(p => p.id !== deleteTarget.id));
            if (previewProperty?.id === deleteTarget.id) {
                setPreviewProperty(null);
            }
            setDeleteTarget(null);
            toast({
                title: "Listing Deleted",
                description: `"${deleteTarget.title}" was removed successfully.`,
            });
        } catch (error) {
            toast({
                title: "Failed to delete",
                description: error.response?.data?.detail || "Could not delete this property.",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    const filteredProperties = properties.filter(p => {
        if (activeTab === 'all') return true;
        return p.status === activeTab;
    });

    const counts = {
        all: properties.length,
        active: properties.filter(p => p.status === 'active').length,
        pending: properties.filter(p => p.status === 'pending').length,
        rejected: properties.filter(p => p.status === 'rejected').length,
    };

    const renderStatusBadge = (status) => {
        if (status === 'active') {
            return (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Live on Display
                </Badge>
            );
        }
        if (status === 'pending') {
            return (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium gap-1 shadow-sm">
                    <Clock className="w-3.5 h-3.5" /> Pending Approval
                </Badge>
            );
        }
        return (
            <Badge variant="destructive" className="font-medium gap-1 shadow-sm">
                <XCircle className="w-3.5 h-3.5" /> Changes Needed
            </Badge>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Properties</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage and edit your property listings, review approval status, and update details.
                    </p>
                </div>
                <Button asChild className="gap-2 shrink-0 shadow-sm">
                    <Link to="/submit-property">
                        <Plus className="w-4 h-4" /> Add New Property
                    </Link>
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                    All Listings ({counts.all})
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'active'
                            ? 'bg-emerald-600 text-white'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                    Live on Display ({counts.active})
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'pending'
                            ? 'bg-amber-500 text-white'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                    Pending Review ({counts.pending})
                </button>
                {counts.rejected > 0 && (
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === 'rejected'
                                ? 'bg-destructive text-destructive-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                        Needs Revision ({counts.rejected})
                    </button>
                )}
            </div>

            {/* Properties Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <HomeIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-1.5">No properties found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                        {activeTab === 'all'
                            ? "You haven't listed any properties yet. Click the button below to publish your first listing."
                            : `You do not have any properties currently under the "${activeTab}" status.`}
                    </p>
                    <Button asChild>
                        <Link to="/submit-property">Add New Property</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map(property => {
                        const fallbackImage = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';
                        const firstImage = (property.images?.[0] && !property.images[0].startsWith('blob:'))
                            ? property.images[0]
                            : fallbackImage;

                        return (
                            <Card key={property.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                {/* Image & Badges Header */}
                                <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                                    <img
                                        src={firstImage}
                                        alt={property.title}
                                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                                        {renderStatusBadge(property.status)}
                                        <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-xs">
                                            {property.listing_type === 'for_sale' ? 'For Sale' : 'For Rent'}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-xs">
                                        {property.views || 0} views
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        {/* Rejection Note Alert */}
                                        {property.status === 'rejected' && (
                                            <div className="mb-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-semibold">Admin feedback: </span>
                                                    {property.rejection_note || 'Please update your listing information and resubmit.'}
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-xl font-bold text-primary mb-1">
                                            {formatPrice(property.price, property.listing_type)}
                                        </p>
                                        <h3 className="font-semibold text-foreground text-base line-clamp-1 mb-1">
                                            {property.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3 line-clamp-1">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            {property.address ? `${property.address}, ` : ''}{property.city || ''}, {property.state || ''}
                                        </p>

                                        {/* Specs */}
                                        <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-border/60 text-xs text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Bed className="w-3.5 h-3.5 text-primary" /> {property.bedrooms} Beds
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bath className="w-3.5 h-3.5 text-primary" /> {property.bathrooms} Baths
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Maximize className="w-3.5 h-3.5 text-primary" /> {formatNumber(property.size)} sqft
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-1">
                                        {/* Edit Button */}
                                        <Button
                                            size="sm"
                                            className="flex-1 gap-1.5 h-9"
                                            onClick={() => navigate(`/submit-property?edit=${property.id}`)}
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> Edit
                                        </Button>

                                        {/* In-Dashboard Quick Preview */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1.5 h-9"
                                            onClick={() => setPreviewProperty(property)}
                                            title="View property details in dashboard"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </Button>

                                        {/* Delete Button */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-9 px-2.5 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10"
                                            onClick={() => setDeleteTarget(property)}
                                            title="Delete listing"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* In-Dashboard Quick Preview Modal (Does NOT redirect to customer page) */}
            <Dialog open={!!previewProperty} onOpenChange={(open) => { if (!open) setPreviewProperty(null); }}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    {previewProperty && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-1">
                                    {renderStatusBadge(previewProperty.status)}
                                    <Badge variant="outline">
                                        {previewProperty.listing_type === 'for_sale' ? 'For Sale' : 'For Rent'}
                                    </Badge>
                                </div>
                                <DialogTitle className="text-xl font-bold">
                                    {previewProperty.title}
                                </DialogTitle>
                                <DialogDescription className="text-sm flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {previewProperty.address ? `${previewProperty.address}, ` : ''}{previewProperty.city}, {previewProperty.state} {previewProperty.zip_code}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                {/* Price Header */}
                                <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-muted-foreground">Listing Price</span>
                                        <p className="text-2xl font-bold text-primary">
                                            {formatPrice(previewProperty.price, previewProperty.listing_type)}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-muted-foreground">
                                        <p>Created: {formatDate(previewProperty.created_date)}</p>
                                        <p>Views: {previewProperty.views || 0}</p>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                {previewProperty.images && previewProperty.images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {previewProperty.images.slice(0, 3).map((img, idx) => (
                                            <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                                                <img
                                                    src={img}
                                                    alt={`Photo ${idx + 1}`}
                                                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'; }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/40 text-xs">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-4 h-4 text-primary" />
                                        <span><strong>{previewProperty.bedrooms}</strong> Bedrooms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-4 h-4 text-primary" />
                                        <span><strong>{previewProperty.bathrooms}</strong> Bathrooms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Maximize className="w-4 h-4 text-primary" />
                                        <span><strong>{formatNumber(previewProperty.size)}</strong> Sqft</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Car className="w-4 h-4 text-primary" />
                                        <span><strong>{previewProperty.parking || 0}</strong> Parking</span>
                                    </div>
                                </div>

                                {/* Rejection Feedback if any */}
                                {previewProperty.status === 'rejected' && (
                                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                                        <div className="font-semibold flex items-center gap-1.5 mb-1">
                                            <AlertCircle className="w-4 h-4" /> Admin Revision Request:
                                        </div>
                                        <p>{previewProperty.rejection_note || 'Please update your listing.'}</p>
                                    </div>
                                )}

                                {/* Description */}
                                {previewProperty.description && (
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Description</h4>
                                        <p className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                                            {previewProperty.description}
                                        </p>
                                    </div>
                                )}

                                {/* Amenities */}
                                {previewProperty.amenities?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Amenities</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {previewProperty.amenities.map(a => (
                                                <Badge key={a} variant="outline" className="text-xs font-normal">
                                                    ✓ {a}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Floor Plans */}
                                {((previewProperty.floor_plan_images?.length > 0) || previewProperty.floor_plan_image) && (
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                                            Floor Plans ({previewProperty.floor_plan_images?.length || 1})
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {(previewProperty.floor_plan_images?.length > 0 ? previewProperty.floor_plan_images : [previewProperty.floor_plan_image]).map((fp, i) => (
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
                                {previewProperty.status === 'active' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="gap-1.5 text-xs"
                                    >
                                        <a href={`/properties/${previewProperty.id}`} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3.5 h-3.5" /> Open Public Customer View
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                        const target = previewProperty;
                                        setPreviewProperty(null);
                                        setDeleteTarget(target);
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </Button>
                                <Button
                                    size="sm"
                                    className="gap-1.5 text-xs"
                                    onClick={() => {
                                        const editId = previewProperty.id;
                                        setPreviewProperty(null);
                                        navigate(`/submit-property?edit=${editId}`);
                                    }}
                                >
                                    <Pencil className="w-3.5 h-3.5" /> Edit Property Details
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Delete Property Listing
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? 
                            This listing will be permanently removed and cannot be recovered.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                                </>
                            ) : (
                                "Yes, Delete Listing"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
