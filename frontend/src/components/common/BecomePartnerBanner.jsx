import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BecomePartnerBanner({ className = "" }) {
    return (
        <section className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 ${className}`}>
            <div className="bg-white border border-slate-100 rounded-3xl md:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center justify-between relative shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] min-h-[300px]">
                <div className="p-8 sm:p-12 md:p-16 z-10 w-full md:w-3/5 lg:w-1/2">
                    <p className="text-[#10b981] text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
                        BECOME PARTNERS
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-bold text-slate-900 mb-7 leading-[1.2] tracking-tight max-w-md">
                        List your Properties on EstateHub, join Us Now!
                    </h2>
                    <Button asChild size="lg" className="rounded-full bg-[#10b981] hover:bg-[#059669] text-white px-8 py-6 font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all group">
                        <Link to="/register-agent" className="inline-flex items-center gap-2">
                            Become A Hosting <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
                {/* Slanted House Image (Right side) */}
                <div className="w-full md:w-1/2 h-64 md:h-auto md:absolute md:right-0 md:top-0 md:bottom-0 overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" 
                        alt="List your Properties on EstateHub" 
                        className="w-full h-full object-cover object-center [clip-path:none] md:[clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]" 
                    />
                </div>
            </div>
        </section>
    );
}
