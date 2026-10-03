import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, MapPin, Award, ArrowRight, Search, TrendingUp, Shield, Quote, Star, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SearchBar from '@/components/properties/SearchBar';
import PropertyCard from '@/components/properties/PropertyCard';

const CITIES = [
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600' },
    { name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600' },
    { name: 'Miami', image: '/images/miami.png' },
    { name: 'Austin', image: '/images/austin.png' },
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

import { useAuth } from '@/lib/AuthContext';
import { cmsService, propertyService, agentService } from '@/api/services';
import BecomePartnerBanner from '@/components/common/BecomePartnerBanner';

export default function Home() {
    const { siteSettings } = useAuth();
    const [freshSettings, setFreshSettings] = useState(null);
    const [featured, setFeatured] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [teamAgents, setTeamAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageContent, setPageContent] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        propertyService.list({ status: 'active', limit: 6 })
            .then((data) => setFeatured(data.results || data))
            .catch(() => { })
            .finally(() => setLoading(false));

        cmsService.getSettings()
            .then(data => setFreshSettings(data))
            .catch(() => {});

        cmsService.getPageContent('home')
            .then(data => setPageContent(data))
            .catch(() => {});

        cmsService.getBlogs()
            .then(data => setBlogs((data.results || data).slice(0, 3)))
            .catch(() => {});

        agentService.list({ featured: true })
            .then(data => {
                const list = data.results || data;
                if (Array.isArray(list) && list.length > 0) {
                    setTeamAgents(list);
                } else {
                    // Try fetching all approved agents if none explicitly featured
                    agentService.list()
                        .then(allData => {
                            const allList = allData.results || allData;
                            if (Array.isArray(allList) && allList.length > 0) {
                                setTeamAgents(allList);
                            }
                        })
                        .catch(() => {});
                }
            })
            .catch(() => {});
    }, []);

    const effectiveSettings = freshSettings || siteSettings;

    // Active slides from backend or fallback to hero_image / default
    const slides = (effectiveSettings?.hero_slides && effectiveSettings.hero_slides.length > 0)
        ? effectiveSettings.hero_slides
        : [
            {
                image_display: effectiveSettings?.hero_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920",
                title: effectiveSettings?.hero_title || pageContent?.title || "Find Your Perfect Home",
                description: effectiveSettings?.hero_description || pageContent?.description || "Search thousands of homes for sale and rent. Connect with trusted agents."
            }
        ];

    // Autoplay slider
    useEffect(() => {
        if (slides.length <= 1 || isPaused || effectiveSettings?.hero_slider_autoplay === false) return;
        const intervalTime = effectiveSettings?.hero_slider_interval || 5000;
        const timer = setInterval(() => {
            setCurrentSlideIndex(prev => (prev + 1) % slides.length);
        }, intervalTime);
        return () => clearInterval(timer);
    }, [slides.length, isPaused, effectiveSettings?.hero_slider_autoplay, effectiveSettings?.hero_slider_interval]);

    const activeSlide = slides[currentSlideIndex % slides.length];
    const heroTitle = activeSlide?.title || effectiveSettings?.hero_title || pageContent?.title || "Find Your Perfect Home";
    const heroDescription = activeSlide?.description || effectiveSettings?.hero_description || pageContent?.description || "Search thousands of homes for sale and rent. Connect with trusted agents.";

    const nextSlide = () => setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length);

    return (
        <div>
            <section 
                className="relative min-h-[620px] flex items-center justify-center overflow-hidden group select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Background Image Slider with Crossfade & Subtle Zoom */}
                <div className="absolute inset-0 overflow-hidden">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentSlideIndex}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img 
                                src={activeSlide?.image_display || activeSlide?.image_url || activeSlide?.image || effectiveSettings?.hero_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"} 
                                alt={heroTitle} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Prev / Next Slide Arrows (shown if more than 1 slide) */}
                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Previous slide"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Next slide"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Hero Content */}
                <div className="relative z-10 px-4 py-20 text-center w-full">
                    <motion.div 
                        key={heroTitle}
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl mx-auto leading-tight drop-shadow-sm">
                            {heroTitle}
                        </h1>
                        <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto whitespace-pre-line drop-shadow-sm">
                            {heroDescription}
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <SearchBar />
                    </motion.div>
                </div>

                {/* Slide Indicator Dots / Pills */}
                {slides.length > 1 && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentSlideIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                    idx === currentSlideIndex % slides.length 
                                        ? 'w-8 bg-primary shadow-md' 
                                        : 'w-2 bg-white/60 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="border-b border-border bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Building2, value: '10,000+', label: 'Properties Listed' },
                            { icon: Users, value: '500+', label: 'Verified Agents' },
                            { icon: MapPin, value: '50+', label: 'Cities' },
                            { icon: Award, value: '8,000+', label: 'Happy Clients' },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <stat.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                        <div>
                            <h2 className="text-3xl font-bold">Featured Properties</h2>
                            <p className="text-muted-foreground mt-1">Handpicked listings just for you</p>
                        </div>
                        <Button asChild variant="outline"><Link to="/listings">View All <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />)}
                        </div>
                    ) : featured.length === 0 ? (
                        <Card className="p-10 text-center text-muted-foreground">No properties available yet. Check back soon!</Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featured.map((p, i) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                    <PropertyCard property={p} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 bg-muted/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-8">Explore Popular Cities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CITIES.map((city, i) => (
                            <motion.div key={city.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Link to={`/listings?location=${city.name}`}>
                                    <Card className="overflow-hidden p-0 hover:shadow-lg transition-shadow">
                                        <div className="relative aspect-[4/5]">
                                            <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <span className="absolute bottom-3 left-3 text-white font-semibold text-lg">{city.name}</span>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Search, title: 'Search Properties', desc: 'Browse thousands of listings with advanced filters to find your perfect match.' },
                            { icon: TrendingUp, title: 'Connect with Agents', desc: 'Contact verified agents directly and schedule viewings at your convenience.' },
                            { icon: Shield, title: 'Move In Safely', desc: 'Complete your transaction with confidence through our verified platform.' },
                        ].map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">OUR TESTIMONIALS</p>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What's People Say's</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our seasoned team excels in real estate with years of successful market navigation, offering informed decisions and optimal results.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Card className="p-8 h-full flex flex-col justify-between hover:shadow-lg transition-shadow border-none shadow-sm rounded-2xl bg-white">
                                    <div>
                                        <Quote className="w-10 h-10 text-primary mb-6" fill="currentColor" />
                                        <p className="text-muted-foreground leading-relaxed mb-8">"{t.quote}"</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <h4 className="font-semibold text-foreground">{t.name}</h4>
                                                <p className="text-xs text-muted-foreground">{t.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < t.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Our Agents Section */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">OUR TEAMS</p>
                        <h2 className="text-3xl md:text-4xl font-bold">Meet Our Agents</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {(teamAgents.length > 0 ? teamAgents : AGENTS).map((agent, i) => {
                            const agentName = agent.full_name || agent.name;
                            const agentRole = agent.agent_title || agent.role || agent.bio || (agent.agency_name ? `${agent.agency_name} Agent` : "Administrative Staff");
                            const agentImg = agent.avatar_url || agent.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80";
                            const phone = agent.public_phone || agent.phone;
                            const email = agent.public_email || agent.email;
                            const agentId = agent.id;

                            return (
                                <motion.div key={agentId || i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <div className="group">
                                        <Link to={agentId ? `/agents/${agentId}` : '#'} className="block relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-muted">
                                            <img 
                                                src={agentImg} 
                                                alt={agentName} 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                            />
                                        </Link>
                                        <div className="flex items-center justify-between px-1">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <Link to={agentId ? `/agents/${agentId}` : '#'} className="block">
                                                    <h4 className="font-bold text-lg text-foreground truncate hover:text-primary transition-colors">{agentName}</h4>
                                                </Link>
                                                <p className="text-sm text-muted-foreground truncate">{agentRole}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                {phone ? (
                                                    <a 
                                                        href={`tel:${phone}`}
                                                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary text-muted-foreground transition-all"
                                                        title={`Call ${agentName} (${phone})`}
                                                    >
                                                        <Phone className="w-3.5 h-3.5" />
                                                    </a>
                                                ) : (
                                                    <Link 
                                                        to={agentId ? `/agents/${agentId}` : '#'}
                                                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                                        title="Contact Agent"
                                                    >
                                                        <Phone className="w-3.5 h-3.5" />
                                                    </Link>
                                                )}
                                                {email ? (
                                                    <a 
                                                        href={`mailto:${email}`}
                                                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary text-muted-foreground transition-all"
                                                        title={`Email ${agentName} (${email})`}
                                                    >
                                                        <Mail className="w-3.5 h-3.5" />
                                                    </a>
                                                ) : (
                                                    <Link 
                                                        to={agentId ? `/agents/${agentId}` : '#'}
                                                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                                        title="Email Agent"
                                                    >
                                                        <Mail className="w-3.5 h-3.5" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-16 bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">LATEST NEW</p>
                        <h2 className="text-3xl md:text-4xl font-bold">From Our Blog</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {blogs.map((blog, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Link to={`/blog/${blog.slug}`} className="group cursor-pointer block">
                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5">
                                        <img src={blog.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                            {new Date(blog.published_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <span className="font-medium text-foreground">{blog.author}</span>
                                            <span>•</span>
                                            <span>{blog.category}</span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2">
                                            {blog.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Become Partner Banner */}
            <BecomePartnerBanner />
        </div>
    );
}