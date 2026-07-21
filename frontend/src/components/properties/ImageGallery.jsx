import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

export default function ImageGallery({ images = [], title }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const allImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'];

    const next = (e) => { e.stopPropagation(); setActiveIndex(i => (i + 1) % allImages.length); };
    const prev = (e) => { e.stopPropagation(); setActiveIndex(i => (i - 1 + allImages.length) % allImages.length); };

    return (
        <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted group">
                <img src={allImages[activeIndex]} alt={`${title} - ${activeIndex + 1}`} className="w-full h-full object-cover" />

                {allImages.length > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                <button onClick={() => setFullscreen(true)} className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-5 h-5" />
                </button>

                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                    {activeIndex + 1} / {allImages.length}
                </span>
            </div>

            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {allImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === activeIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <Dialog open={fullscreen} onOpenChange={setFullscreen}>
                <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
                    <DialogClose className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                        <X className="w-5 h-5" />
                    </DialogClose>
                    <div className="relative aspect-[16/10]">
                        <img src={allImages[activeIndex]} alt={title} className="w-full h-full object-contain" />
                        {allImages.length > 1 && (
                            <>
                                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}