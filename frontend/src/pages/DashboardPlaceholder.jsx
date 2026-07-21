import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function DashboardPlaceholder({ title }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
            <p className="text-slate-500 mb-8 max-w-md">
                This page is currently under construction. Check back soon for exciting new features and updates to your dashboard!
            </p>
            <Button asChild>
                <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
        </div>
    );
}
