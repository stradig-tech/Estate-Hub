import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoiceService, authService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Building2 } from 'lucide-react';

const PLANS = [
    {
        name: 'Free', price: 0, max_listings: 3, icon: Building2,
        description: 'Perfect for getting started',
        features: ['Up to 3 active listings', 'Basic analytics', 'Email support', 'Standard listing visibility'],
        highlight: false,
    },
    {
        name: 'Pro', price: 49, max_listings: 20, icon: Sparkles,
        description: 'For professional agents',
        features: ['Up to 20 active listings', 'Advanced analytics', 'Priority email support', 'Featured listing badges', 'Custom branding'],
        highlight: true,
    },
    {
        name: 'Agency', price: 199, max_listings: Infinity, icon: Crown,
        description: 'For agencies and teams',
        features: ['Unlimited active listings', 'Full analytics suite', '24/7 phone support', 'Premium featured placement', 'Team management', 'API access'],
        highlight: false,
    },
];

export default function Pricing() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [subscribing, setSubscribing] = useState(null);

    const handleSubscribe = async (plan) => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setSubscribing(plan.name);
        try {
            await invoiceService.create({
                plan_name: plan.name,
                amount: plan.price,
                status: 'paid',
                invoice_date: new Date().toISOString().split('T')[0],
                invoice_number: `INV-${Date.now()}`,
                user_id: user?.id,
            });
            await authService.updateMe({ subscription_plan: plan.name, subscription_status: 'active' });
            navigate('/dashboard');
        } catch (err) {
            setSubscribing(null);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your business. Upgrade or cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {PLANS.map(plan => (
                    <Card key={plan.name} className={`p-6 relative ${plan.highlight ? 'border-primary border-2 shadow-lg' : ''}`}>
                        {plan.highlight && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">Most Popular</span>
                        )}
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                                <plan.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                        <div className="mb-4">
                            <span className="text-4xl font-bold">${plan.price}</span>
                            <span className="text-muted-foreground">/mo</span>
                        </div>
                        <Button
                            className="w-full mb-6"
                            variant={plan.highlight ? 'default' : 'outline'}
                            onClick={() => handleSubscribe(plan)}
                            disabled={subscribing === plan.name || user?.subscription_plan === plan.name}
                        >
                            {subscribing === plan.name ? 'Processing...' : user?.subscription_plan === plan.name ? 'Current Plan' : 'Get Started'}
                        </Button>
                        <ul className="space-y-2.5">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-start gap-2 text-sm">
                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {f}
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
                Prices shown in USD. Payment processing via Stripe (demo checkout — no real charges).
            </p>
        </div>
    );
}