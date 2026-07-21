import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cmsService } from '@/api/services';

export default function BlogDetail() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cmsService.getBlogBySlug(slug)
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (!blog) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
                <p className="text-muted-foreground mb-8">The blog post you are looking for does not exist.</p>
                <Link to="/blog" className="text-primary hover:underline">Back to Blogs</Link>
            </div>
        );
    }

    return (
        <div className="w-full font-sans pb-20">
            {/* Header Hero */}
            <section className="relative h-[400px] w-full mt-4 max-w-7xl mx-auto rounded-3xl overflow-hidden">
                <img src={blog.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-white/80 text-sm font-medium tracking-wide mb-2">{blog.category} • {new Date(blog.published_date).toLocaleDateString()}</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight max-w-4xl">{blog.title}</h1>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-4 mt-16">
                <Link to="/blog" className="inline-flex items-center text-primary font-medium hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to all blogs
                </Link>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                        <img src={`https://i.pravatar.cc/150?u=${blog.author}`} alt={blog.author} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <h4 className="font-bold text-slate-900">{blog.author}</h4>
                            <p className="text-sm text-slate-500">Author</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none prose-lg" dangerouslySetInnerHTML={{ __html: blog.content }}>
                    </div>
                </div>
            </section>
        </div>
    );
}
