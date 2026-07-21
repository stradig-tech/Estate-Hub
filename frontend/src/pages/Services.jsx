import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Quote, Star, ArrowRight, Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cmsService } from '@/api/services';

import { SERVICES_DATA as SERVICES } from './ServiceDetail';

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

const FAQS = [
    {
        question: "Why Should I Use Your Services?",
        answer: "Our services provide you with expert guidance, transparent processes, and personalized attention to ensure your real estate journey is successful and stress-free."
    },
    {
        question: "How Do I Get Started With Your Services?",
        answer: "Once your account is set up and you've familiarized yourself with the platform, you are ready to start using our services. Whether it's managing tasks, making transactions, or utilizing our tools, you'll find everything you need at your fingertips."
    },
    {
        question: "How Secure Are Your Services?",
        answer: "We implement state-of-the-art encryption and security protocols to ensure that all your data and transactions are completely safe and protected."
    },
    {
        question: "Is There Customer Support Available?",
        answer: "Yes, our dedicated customer support team is available to assist you with any questions or concerns you may have during business hours."
    },
    {
        question: "How Can I Update My Account Information?",
        answer: "You can update your account information easily by logging into your dashboard and navigating to the settings profile section."
    }
];

export default function Services() {
    const [openFaq, setOpenFaq] = useState(1);
    const [pageContent, setPageContent] = useState(null);

    useEffect(() => {
        cmsService.getPageContent('services')
            .then(data => setPageContent(data))
            .catch(() => {});
    }, []);

    return (
        <div className="w-full font-sans">
            {/* Header Hero */}
            <section className="relative h-[300px] w-full mt-4 max-w-7xl mx-auto rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80" alt="Services Header" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <p className="text-white/80 text-sm font-medium tracking-wide mb-2 whitespace-pre-line">{pageContent?.description || "Home / Pages / Our Services"}</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{pageContent?.title || "Our Services"}</h1>
                </div>
            </section>

            {/* Services Cards */}
            <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">EXPLORE CITIES</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#1A202C]">Our Location For You</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {SERVICES.map((service, idx) => (
                        <Card key={idx} className="p-8 border-slate-100 shadow-sm hover:shadow-lg transition-all rounded-3xl group bg-white">
                            <div className="mb-6 flex justify-center">
                                <div className="w-40 h-40 rounded-full bg-blue-50/50 flex items-center justify-center p-4">
                                    <img src={service.image} alt={service.title} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">{service.description}</p>
                            <Button asChild variant="outline" className="rounded-full px-6 py-2 border-slate-200 hover:bg-slate-50">
                                <Link to={`/services/${service.slug}`}>
                                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Trusted By Logos */}
            <section className="py-12 border-t border-slate-100 mx-auto max-w-7xl px-4">
                <p className="text-center text-sm font-semibold text-slate-900 mb-8">Trusted By Over 150+ Major Companies</p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Company 1" className="h-8 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Company 2" className="h-8 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="Company 3" className="h-8 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Company 4" className="h-8 object-contain" />
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-slate-50">
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
                                        <Quote className="w-10 h-10 text-[#10b981] mb-6" fill="currentColor" />
                                        <p className="text-slate-600 leading-relaxed mb-8 text-sm">"{t.quote}"</p>
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

            {/* FAQs Section */}
            <section className="py-20 mx-auto max-w-4xl px-4">
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">FAQS</p>
                    <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                            <button 
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                            >
                                <span className={`font-semibold ${openFaq === index ? 'text-[#10b981]' : 'text-slate-900'}`}>
                                    {faq.question}
                                </span>
                                <span className="text-slate-400">
                                    {openFaq === index ? <Minus className="w-5 h-5 text-[#10b981]" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>
                            
                            {openFaq === index && (
                                <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA Banner */}
            <section className="mx-auto max-w-7xl px-4 pb-20">
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center justify-between relative shadow-sm">
                    <div className="p-10 md:p-16 z-10 w-full md:w-1/2">
                        <p className="text-[#10b981] text-sm font-semibold uppercase tracking-wider mb-2">BECOME PARTNERS</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                            List your Properties on EstateHub, join Us Now!
                        </h2>
                        <Button asChild size="lg" className="rounded-full bg-[#10b981] text-white hover:bg-[#059669] px-8 font-semibold">
                            <Link to="/register">Become A Hosting <ArrowRight className="w-4 h-4 ml-2" /></Link>
                        </Button>
                    </div>
                    {/* Decorative House Image (Right side) */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
                        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" alt="CTA House" className="w-full h-full object-cover object-left" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} />
                    </div>
                </div>
            </section>
        </div>
    );
}
