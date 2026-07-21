import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cmsService } from '@/api/services';
import { motion } from 'framer-motion';

export default function DynamicPage({ slugProp }) {
    const { slug: urlSlug } = useParams();
    const slug = slugProp || urlSlug;
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        cmsService.getPageContent(slug)
            .then(data => setPageContent(data))
            .catch(err => console.error("Failed to fetch page content:", err))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!pageContent) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground">The page you are looking for does not exist or has no content yet.</p>
            </div>
        );
    }

    return (
        <div className="w-full font-sans min-h-[60vh]">
            <section className="bg-slate-50 py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-[#1A202C] mb-6"
                    >
                        {pageContent.title}
                    </motion.h1>
                </div>
            </section>

            <section className="py-12 md:py-16 mx-auto max-w-4xl px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-lg max-w-none prose-slate"
                >
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                        {pageContent.description}
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
