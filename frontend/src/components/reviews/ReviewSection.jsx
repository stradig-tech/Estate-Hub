import { useState, useEffect } from 'react';
import { reviewService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/StarRating';
import { formatDate } from '@/lib/format';

export default function ReviewSection({ agentId, agentName }) {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadReviews = async () => {
        try {
            const data = await reviewService.list({ agent_id: agentId, ordering: '-created_date' });
            setReviews(data.results || data);
        } catch (e) {
            // no-op
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadReviews(); }, [agentId]);

    const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await reviewService.create({
                agent_id: agentId,
                agent_name: agentName,
                rating,
                comment,
                reviewer_name: user?.full_name || 'Anonymous',
            });
            setComment('');
            setRating(5);
            setShowForm(false);
            loadReviews();
        } catch (err) {
            // no-op
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <StarRating value={avgRating} readOnly size={24} />
                            <span className="text-2xl font-bold">{avgRating.toFixed(1)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                {isAuthenticated && (
                    <Button variant="outline" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </Button>
                )}
            </div>

            {showForm && (
                <Card className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <Label className="mb-2 block">Your Rating</Label>
                            <StarRating value={rating} onChange={setRating} size={28} />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Your Review</Label>
                            <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience working with this agent..." rows={3} required />
                        </div>
                        <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</Button>
                    </form>
                </Card>
            )}

            {loading ? (
                <p className="text-sm text-muted-foreground">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground text-sm">No reviews yet. Be the first to review!</Card>
            ) : (
                <div className="space-y-3">
                    {reviews.map(r => (
                        <Card key={r.id} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                        {r.reviewer_name?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{r.reviewer_name}</p>
                                        <p className="text-xs text-muted-foreground">{formatDate(r.created_date)}</p>
                                    </div>
                                </div>
                                <StarRating value={r.rating} readOnly />
                            </div>
                            {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}