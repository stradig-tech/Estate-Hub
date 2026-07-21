import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { reviewService } from '@/api/services';
import { Star, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardReviews() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchReviews();
        }
    }, [user]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Assuming reviews can be filtered by agent_id
            const data = await reviewService.list({ agent_id: user.id });
            setReviews(data.results || data);
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
            />
        ));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
                <p className="text-slate-500 text-sm">See what clients are saying about you.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-border">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquareQuote className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        You don't have any reviews at the moment. Deliver great service to get your first review!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <Card key={review.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase">
                                            {review.author_name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{review.author_name}</p>
                                            <p className="text-xs text-slate-500">{review.author_email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end mb-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {review.created_date ? formatDistanceToNow(new Date(review.created_date), { addSuffix: true }) : ''}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg italic">
                                    "{review.comment}"
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
