import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { propertyService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import PropertyForm from '@/components/properties/PropertyForm';
import { AlertCircle, Crown } from 'lucide-react';

const PLAN_LIMITS = { Free: 3, Pro: 20, Agency: Infinity };

export default function SubmitProperty() {
    const { user, isAuthenticated, isLoadingAuth } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [listings, setListings] = useState([]);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    const editId = searchParams.get('edit');

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        if (editId) {
            propertyService.get(editId)
                .then(p => setEditData(p))
                .catch(() => { })
                .finally(() => setLoading(false));
        } else {
            propertyService.list({ agent_id: user.id })
                .then(data => setListings(data.results || data))
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [user, editId]);

    if (isLoadingAuth || loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    // Removed agent role requirement so all users can submit properties

    const plan = user?.subscription_plan || 'Free';
    const limit = PLAN_LIMITS[plan] ?? 3;
    const activeCount = listings.filter(l => l.status === 'active' || l.status === 'pending').length;

    if (!editId && limit !== Infinity && activeCount >= limit) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <Crown className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Listing Limit Reached</h2>
                <p className="text-muted-foreground mb-4">Your {plan} plan allows up to {limit} active listings. Upgrade to list more properties.</p>
                <Button onClick={() => navigate('/pricing')}>View Plans</Button>
            </div>
        );
    }

    const handleSubmit = async (payload) => {
        if (editId) {
            await propertyService.update(editId, payload);
        } else {
            await propertyService.create(payload);
        }
        navigate('/dashboard');
    };

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-1">{editId ? 'Edit Property' : 'Submit a Property'}</h1>
            <p className="text-muted-foreground mb-6">{editId ? 'Update your listing details' : 'Fill in the details below. Your listing will be reviewed before going live.'}</p>
            <PropertyForm initialData={editData} onSubmit={handleSubmit} />
        </div>
    );
}