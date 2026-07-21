import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SERVICES_DATA = [
    {
        slug: "buy-a-new-home",
        title: "Buy A New Home",
        description: "Discover your dream home with EstateHub. Explore diverse properties and expert guidance for a seamless buying experience. We provide end-to-end assistance from property hunting to final closing.",
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
        icon: "🏠",
        features: ["Access to exclusive listings", "Expert negotiation", "Guided property tours", "Financial consultation"]
    },
    {
        slug: "sell-a-home",
        title: "Sell A Home",
        description: "Sell confidently with expert guidance and effective strategies, showcasing your property's best features for a successful sale. Our agents ensure you get the best market value.",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
        icon: "🏡",
        features: ["Professional photography", "Targeted marketing campaigns", "Open house management", "Closing assistance"]
    },
    {
        slug: "rent-a-home",
        title: "Rent A Home",
        description: "Discover your perfect rental with EstateHub. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs without the hassle.",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        icon: "🏘️",
        features: ["Verified landlord network", "Flexible lease terms", "Maintenance support", "Seamless application process"]
    }
];

export default function ServiceDetail() {
    const { slug } = useParams();
    const service = SERVICES_DATA.find(s => s.slug === slug);

    if (!service) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
                <p className="text-muted-foreground mb-8">The service you are looking for does not exist.</p>
                <Button asChild><Link to="/services">Back to Services</Link></Button>
            </div>
        );
    }

    return (
        <div className="w-full font-sans pb-20">
            {/* Header Hero */}
            <section className="relative h-[350px] w-full mt-4 max-w-7xl mx-auto rounded-3xl overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-white/80 text-sm font-medium tracking-wide mb-2">Home / Services / {service.title}</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{service.title}</h1>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-4 mt-16">
                <Link to="/services" className="inline-flex items-center text-primary font-medium hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to all services
                </Link>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
                        {service.icon}
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{service.title} Overview</h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        {service.description}
                    </p>
                    
                    <h3 className="text-xl font-bold mb-4">What's Included?</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-10">
                        {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-slate-700">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
                        <div>
                            <h4 className="font-bold text-lg">Ready to get started?</h4>
                            <p className="text-slate-500 text-sm">Contact our team to begin your journey.</p>
                        </div>
                        <Button asChild size="lg" className="rounded-full bg-[#10b981] hover:bg-[#059669]">
                            <Link to="/contact">Contact Us Today</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
