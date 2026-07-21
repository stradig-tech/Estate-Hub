import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cmsService } from '@/api/services';

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageContent, setPageContent] = useState(null);

    useEffect(() => {
        cmsService.getBlogs()
            .then(data => setBlogs(data.results || data))
            .catch(() => {})
            .finally(() => setLoading(false));

        cmsService.getPageContent('blog')
            .then(data => setPageContent(data))
            .catch(() => {});
    }, []);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-5xl">
            <h1 className="text-4xl font-extrabold tracking-tight mb-8">EstateHub Blog</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogs.map((blog, idx) => (
                    <Link to={`/blog/${blog.slug}`} key={idx}>
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer bg-white overflow-hidden rounded-3xl">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 bg-[#10b981] text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    {new Date(blog.published_date).toLocaleDateString()}
                                </div>
                                <img src={blog.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
                                    <span className="text-slate-900">{blog.author}</span> • <span>{blog.category}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#10b981] transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{blog.excerpt}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
