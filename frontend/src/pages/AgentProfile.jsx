import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService, propertyService, reviewService } from '@/api/services';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import ReviewSection from '@/components/reviews/ReviewSection';
import PropertyCard from '@/components/properties/PropertyCard';
import { Building2, Home as HomeIcon } from 'lucide-react';

export default function AgentProfile() {
    const { id } = useParams();
    const [agent, setAgent] = useState(null);
    const [listings, setListings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                try {
                    const user = await userService.get(id);
                    if (user) setAgent(user);
                } catch (e) { /* permission restricted */ }

                const propsData = await propertyService.list({ agent_id: id, status: 'active' });
                const props = propsData.results || propsData;
                setListings(props);

                if (!agent && props.length > 0) {
                    setAgent({ full_name: props[0].agent_name, id });
                }

                const revsData = await reviewService.list({ agent_id: id });
                const revs = revsData.results || revsData;
                setReviews(revs);
            } catch (e) {
                // no-op
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
    if (!agent && listings.length === 0) return <div className="py-20 text-center text-muted-foreground">Agent not found.</div>;

    const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    const agentName = agent?.full_name || listings[0]?.agent_name || 'Agent';

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Card className="p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                        {agentName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{agentName}</h1>
                        {agent?.agency_name && <p className="text-muted-foreground flex items-center gap-1 mt-1"><Building2 className="w-4 h-4" /> {agent.agency_name}</p>}
                        {agent?.license_number && <p className="text-sm text-muted-foreground">License #{agent.license_number}</p>}
                        {agent?.bio && <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{agent.bio}</p>}
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                                <StarRating value={avgRating} readOnly />
                                <span className="text-sm font-medium ml-1">{avgRating.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
                            </div>
                            <span className="text-sm text-muted-foreground flex items-center gap-1"><HomeIcon className="w-4 h-4" /> {listings.length} listings</span>
                        </div>
                    </div>
                </div>
            </Card>

            {listings.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Active Listings</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {listings.map(p => <PropertyCard key={p.id} property={p} />)}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>
                <ReviewSection agentId={id} agentName={agentName} />
            </div>
        </div>
    );
}