import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Minus, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { cmsService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';

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

export default function Contact() {
    const { siteSettings } = useAuth();
    const [loading, setLoading] = useState(false);
    const [openFaq, setOpenFaq] = useState(1); // Default open second one
    const [pageContent, setPageContent] = useState(null);

    useEffect(() => {
        cmsService.getPageContent('contact')
            .then(data => setPageContent(data))
            .catch(err => console.error("Failed to fetch page content:", err));
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success('Your message has been sent successfully! We will get back to you soon.');
            setLoading(false);
            e.target.reset();
        }, 1000);
    };

    return (
        <div className="w-full font-sans">
            {/* Header Hero */}
            <section className="relative h-[300px] w-full mt-4 max-w-7xl mx-auto rounded-3xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" alt="Contact Header" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                    <p className="text-white/80 text-sm font-medium tracking-wide mb-2">Home / Pages / Contact Us</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Contact Us</h1>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-12">
                    
                    {/* Left: Contact Form */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-[#1A202C] mb-2">{pageContent?.title || "Drop Us A Line"}</h2>
                        <p className="text-muted-foreground mb-8 text-sm whitespace-pre-line">{pageContent?.description || "Feel free to connect with us through our online channels for updates, news, and more."}</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary/50" placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <input required type="email" className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary/50" placeholder="Email" />
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <input required type="tel" className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary/50" placeholder="459 398 5659 059" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Subject</label>
                                    <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary/50" placeholder="Enter keyword" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Your Message</label>
                                <textarea required rows="6" className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary/50" placeholder="Message"></textarea>
                            </div>
                            <Button type="submit" size="lg" className="rounded-full bg-[#10b981] hover:bg-[#059669] px-10 w-full md:w-auto" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>

                    {/* Right: Contact Info Card */}
                    <div className="lg:col-span-1">
                        <Card className="p-8 border-slate-100 shadow-sm rounded-3xl sticky top-24 bg-white">
                            <h3 className="text-2xl font-bold mb-8">Contact Us</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-slate-900">Address</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                                        {siteSettings?.contact_address || "101 E 129th St, East Chicago, IN 46312\nUnited States"}
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-slate-900">Information</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {siteSettings?.contact_phone || "1-333-345-6868"}<br />
                                        {siteSettings?.contact_email || "themesflat@gmail.com"}
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-slate-900">Opentime</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                                        {siteSettings?.contact_opentime || "Monday - Friday: 08:00 - 20:00\nSaturday - Sunday: 10:00 - 18:00"}
                                    </p>
                                </div>
                                
                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="font-bold text-sm mb-3 text-slate-900">Follow Us</h4>
                                    <div className="flex gap-2">
                                        {siteSettings?.facebook_url && (
                                            <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-colors">
                                                <Facebook className="w-4 h-4" />
                                            </a>
                                        )}
                                        {siteSettings?.instagram_url && (
                                            <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-colors">
                                                <Instagram className="w-4 h-4" />
                                            </a>
                                        )}
                                        {siteSettings?.youtube_url && (
                                            <a href={siteSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-colors">
                                                <Youtube className="w-4 h-4" />
                                            </a>
                                        )}
                                        {siteSettings?.twitter_url && (
                                            <a href={siteSettings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-colors">
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {siteSettings?.linkedin_url && (
                                            <a href={siteSettings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-colors">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="w-full h-[500px] bg-slate-100">
                {/* Embedded actual working Google Map */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11894.2721832049!2d-87.46603095!3d41.6441716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8811d8825c35b91b%3A0xa6eb3ce745c3bf79!2sEast%20Chicago%2C%20IN%2046312%2C%20USA!5e0!3m2!1sen!2s!4v1714402652192!5m2!1sen!2s" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
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
