import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, Quote, Star, CheckCircle, Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cmsService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';

// Mock data
const AGENTS = [
    {
        name: "Chris Patt",
        role: "Administrative Staff",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
    },
    {
        name: "Esther Howard",
        role: "Administrative Staff",
        image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&q=80"
    },
    {
        name: "Darrell Steward",
        role: "Administrative Staff",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
    },
    {
        name: "Robert Fox",
        role: "Administrative Staff",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"
    }
];

const TESTIMONIALS = [
    {
        quote: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
        name: "Courtney Henry",
        role: "CEO Themesflat",
        avatar: "https://i.pravatar.cc/150?u=1",
        stars: 5
    },
    {
        quote: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
        name: "Courtney Henry",
        role: "CEO Themesflat",
        avatar: "https://i.pravatar.cc/150?u=2",
        stars: 5
    },
    {
        quote: "My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation. I feel reassured that any issue will be resolved promptly and effectively.",
        name: "Esther Howard",
        role: "CEO Themesflat",
        avatar: "https://i.pravatar.cc/150?u=3",
        stars: 5
    }
];

export default function AboutUs() {
    const { siteSettings } = useAuth();
    const [pageContent, setPageContent] = useState(null);

    useEffect(() => {
        cmsService.getPageContent('about-us')
            .then(data => setPageContent(data))
            .catch(err => console.error("Failed to fetch page content:", err));
    }, []);

    return (
        <div className="w-full font-sans">
            {/* Header Section */}
            <section className="py-20 text-center max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1A202C]">
                    {pageContent?.title || "Welcome to the HomLengo"}
                </h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-3xl mx-auto whitespace-pre-line">
                    {pageContent?.description || "Welcome to Home Lengo, where we turn houses into homes and dreams into reality. At Home Lengo, we believe that a home is more than just a physical space; it's a place where memories are created, families grow, and life unfolds."}
                </p>
                <div className="flex flex-col items-center justify-center mb-10">
                    <span className="font-semibold text-lg text-primary">{siteSettings?.ceo_name || "Luke Alexander"}</span>
                    <span className="text-sm text-muted-foreground italic mb-2">{siteSettings?.ceo_role || "CEO/Founder"}</span>
                    {siteSettings?.ceo_signature && (
                        <img src={siteSettings.ceo_signature} alt="Signature" className="h-12 opacity-70 object-contain" />
                    )}
                </div>
                <Button asChild size="lg" className="rounded-full bg-[#10b981] hover:bg-[#059669] px-8">
                    <Link to="/contact">Contact Us</Link>
                </Button>
            </section>

            {/* Three Image Grid */}
            <section className="px-4 max-w-7xl mx-auto mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" className="w-full h-[300px] object-cover rounded-3xl" alt="House 1" />
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" className="w-full h-[300px] object-cover rounded-3xl" alt="House 2" />
                    <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" className="w-full h-[300px] object-cover rounded-3xl" alt="House 3" />
                </div>
            </section>

            {/* Meet Our Agents */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">OUR TEAMS</p>
                        <h2 className="text-3xl md:text-4xl font-bold">Meet Our Agents</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {AGENTS.map((agent, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div className="group">
                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-muted">
                                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="flex items-center justify-between px-1">
                                        <div>
                                            <h4 className="font-bold text-lg text-foreground">{agent.name}</h4>
                                            <p className="text-xs text-muted-foreground">{agent.role}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                <Phone className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                <Mail className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-12 border-y border-border my-8">
                <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <h3 className="text-3xl font-bold">5,200+</h3>
                        <p className="text-sm text-muted-foreground mt-1">Properties Listed</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">12,000+</h3>
                        <p className="text-sm text-muted-foreground mt-1">Real Estate Deals</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">8,000+</h3>
                        <p className="text-sm text-muted-foreground mt-1">Happy Clients</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">20+</h3>
                        <p className="text-sm text-muted-foreground mt-1">Cities Covered</p>
                    </div>
                </div>
            </section>

            {/* Discover Section */}
            <section className="py-16 bg-slate-50 overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Images with badges */}
                    <div className="relative h-[500px]">
                        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" alt="House" className="w-3/4 absolute right-0 top-0 rounded-3xl z-0" />
                        <div className="absolute bottom-0 left-0 w-2/3 border-8 border-slate-50 rounded-3xl overflow-hidden bg-white z-10 shadow-lg">
                            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" alt="House interior" className="w-full h-full object-cover" />
                        </div>
                        {/* Badges */}
                        <div className="absolute top-10 left-10 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-20">
                            <CheckCircle className="w-4 h-4 text-blue-500" /> <span className="text-sm font-semibold">Proven Expertise</span>
                        </div>
                        <div className="absolute top-1/2 -left-4 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-20">
                            <CheckCircle className="w-4 h-4 text-blue-500" /> <span className="text-sm font-semibold">Customized Solutions</span>
                        </div>
                        <div className="absolute bottom-1/4 right-0 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 z-20">
                            <CheckCircle className="w-4 h-4 text-blue-500" /> <span className="text-sm font-semibold">Local Knowledge</span>
                        </div>
                    </div>
                    
                    {/* Right: Content */}
                    <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">OUR SKILLS</p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A202C]">Discover What Sets Our Real Estate Expertise Apart</h2>
                        <p className="text-muted-foreground mb-8">Discover what sets our real estate expertise apart, ensuring successful navigation and optimal results.</p>
                        
                        <div className="space-y-4">
                            {[
                                { title: 'Buy A New Home', text: 'Find your dream home with our specialized buying agents.' },
                                { title: 'Rent a Home', text: 'Explore diverse rentals tailored to fit your lifestyle and budget.' },
                                { title: 'Sell a Home', text: 'Maximize your property value with our expert sales team.' }
                            ].map((item, idx) => (
                                <Card key={idx} className="p-4 border-none shadow-sm hover:shadow-md transition-shadow bg-white flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Check className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{item.text}</p>
                                        <a href="#" className="text-sm font-semibold text-[#10b981] flex items-center gap-1">Explore Now <ArrowRight className="w-4 h-4" /></a>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">OUR TESTIMONIALS</p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What's People Say's</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                            Our seasoned team excels in real estate with years of successful market navigation, offering informed decisions and optimal results.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="p-8 h-full flex flex-col justify-between hover:shadow-lg transition-shadow shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl bg-white border border-slate-100">
                                    <div>
                                        <Quote className="w-10 h-10 text-primary mb-6" fill="currentColor" />
                                        <p className="text-muted-foreground leading-relaxed mb-8 text-sm">"{t.quote}"</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <h4 className="font-semibold text-sm text-foreground">{t.name}</h4>
                                                <p className="text-xs text-muted-foreground">{t.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < t.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA Banner */}
            <section className="mx-auto max-w-7xl px-4 pb-20">
                <div className="bg-[#10b981] rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center justify-between relative shadow-xl">
                    <div className="p-10 md:p-16 z-10 w-full md:w-1/2">
                        <p className="text-emerald-200 text-sm font-semibold uppercase tracking-wider mb-2">WORK WITH US</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                            List your Properties on EstateHub, join Us Now!
                        </h2>
                        <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-slate-100 px-8 font-semibold">
                            <Link to="/register">Start Work With Us <ArrowRight className="w-4 h-4 ml-2" /></Link>
                        </Button>
                    </div>
                    {/* Decorative House Image (Right side) */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" alt="CTA House" className="w-full h-full object-cover object-left opacity-90" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} />
                    </div>
                </div>
            </section>
        </div>
    );
}
