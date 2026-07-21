import { useState, useEffect } from 'react';
import { propertyService } from '@/api/services';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, TrendingUp, Building2, BarChart3 } from 'lucide-react';

export default function AnalyticsTab({ user }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService.list({ agent_id: user.id, ordering: '-views' })
      .then(data => setListings(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <div className="py-10 text-center text-muted-foreground">Loading...</div>;

  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0);
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const avgViews = totalListings > 0 ? Math.round(totalViews / totalListings) : 0;

  const chartData = listings.slice(0, 10).map(l => ({
    name: l.title?.length > 15 ? l.title.slice(0, 15) + '...' : l.title,
    views: l.views || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: 'Total Views', value: totalViews },
          { icon: Building2, label: 'Total Listings', value: totalListings },
          { icon: TrendingUp, label: 'Active Listings', value: activeListings },
          { icon: BarChart3, label: 'Avg Views', value: avgViews },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Page Views by Listing</h3>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="views" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}