import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '@/api/services';
import { SlidersHorizontal, X, MapPin, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import SearchBar from '@/components/properties/SearchBar';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilters from '@/components/properties/PropertyFilters';
import PropertyMap from '@/components/properties/PropertyMap';

export default function Listings() {
    const [searchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('split');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedMapId, setSelectedMapId] = useState(null);

    const [filters, setFilters] = useState({
        listing_type: searchParams.get('listing_type') || '',
        property_type: searchParams.get('property_type') || '',
        q: searchParams.get('q') || '',
        location: searchParams.get('location') || '',
        min_price: '',
        max_price: '',
        min_beds: '',
        min_baths: '',
        min_size: '',
        amenities: [],
    });

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            listing_type: searchParams.get('listing_type') || '',
            property_type: searchParams.get('property_type') || '',
            q: searchParams.get('q') || '',
            location: searchParams.get('location') || '',
        }));
    }, [searchParams]);

    useEffect(() => {
        const query = { status: 'active', limit: 100 };
        if (filters.listing_type) query.listing_type = filters.listing_type;
        if (filters.property_type) query.property_type = filters.property_type;
        setLoading(true);
        propertyService.list(query)
            .then((data) => setProperties(data.results || data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [filters.listing_type, filters.property_type]);

    const filtered = properties.filter(p => {
        if (filters.min_price && p.price < filters.min_price) return false;
        if (filters.max_price && p.price > filters.max_price) return false;
        if (filters.min_beds && p.bedrooms < filters.min_beds) return false;
        if (filters.min_baths && p.bathrooms < filters.min_baths) return false;
        if (filters.min_size && p.size < filters.min_size) return false;
        if (filters.amenities?.length > 0) {
            const propAmenities = p.amenities || [];
            if (!filters.amenities.every(a => propAmenities.includes(a))) return false;
        }
        if (filters.q) {
            const kw = filters.q.toLowerCase();
            if (!p.title?.toLowerCase().includes(kw) && !p.description?.toLowerCase().includes(kw)) return false;
        }
        if (filters.location) {
            const loc = filters.location.toLowerCase();
            if (!p.city?.toLowerCase().includes(loc) && !p.state?.toLowerCase().includes(loc) && !p.zip_code?.includes(loc)) return false;
        }
        return true;
    });

    const clearFilters = () => setFilters(f => ({ ...f, min_price: '', max_price: '', min_beds: '', min_baths: '', min_size: '', amenities: [], q: '', location: '' }));

    const activeFilterCount = [
        filters.min_price, filters.max_price, filters.min_beds, filters.min_baths, filters.min_size,
        ...(filters.amenities || []), filters.q, filters.location
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Search bar header */}
            <div className="border-b border-border bg-white py-3 sticky top-16 z-30">
                <div className="mx-auto max-w-[1600px] px-4">
                    <SearchBar compact />
                </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-border bg-white">
                <div className="mx-auto max-w-[1600px] px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="gap-2">
                            <SlidersHorizontal className="w-4 h-4" /> Filters
                            {activeFilterCount > 0 && <Badge className="ml-1 bg-primary text-primary-foreground h-5 px-1.5 text-xs">{activeFilterCount}</Badge>}
                        </Button>
                        <span className="text-sm text-muted-foreground hidden sm:inline">{filtered.length} properties found</span>
                    </div>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                        <button
                            onClick={() => setView('split')}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${view === 'split' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                        ><LayoutGrid className="w-4 h-4" /> Split</button>
                        <button
                            onClick={() => setView('grid')}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                        >Grid</button>
                        <button
                            onClick={() => setView('map')}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${view === 'map' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                        ><MapIcon className="w-4 h-4" /> Map</button>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden">
                {view === 'grid' && (
                    <div className="mx-auto max-w-[1600px] px-4 py-5">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-lg mb-1">No properties found</p>
                                <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
                            </div>
                        )}
                    </div>
                )}

                {view === 'map' && (
                    <div className="h-[calc(100vh-140px)]">
                        {loading ? (
                            <div className="w-full h-full bg-muted animate-pulse" />
                        ) : (
                            <PropertyMap properties={filtered} />
                        )}
                    </div>
                )}

                {view === 'split' && (
                    <div className="flex h-[calc(100vh-140px)]">
                        {/* Left: property list */}
                        <div className="w-full lg:w-1/2 xl:w-[45%] overflow-y-auto border-r border-border bg-muted/30">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />)}
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground px-4">
                                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-lg mb-1">No properties found</p>
                                    <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                                    {filtered.map(p => (
                                        <div
                                            key={p.id}
                                            onMouseEnter={() => setSelectedMapId(p.id)}
                                            className={selectedMapId === p.id ? 'ring-2 ring-primary rounded-xl' : ''}
                                        >
                                            <PropertyCard property={p} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Right: map */}
                        <div className="hidden lg:block flex-1 sticky top-0">
                            {loading ? (
                                <div className="w-full h-full bg-muted animate-pulse" />
                            ) : (
                                <PropertyMap properties={filtered} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile filter sheet */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center justify-between">
                            <span>Filters</span>
                            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></Button>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                        <PropertyFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
                        <Button className="w-full mt-6" onClick={() => setShowFilters(false)}>
                            Show {filtered.length} Results
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}