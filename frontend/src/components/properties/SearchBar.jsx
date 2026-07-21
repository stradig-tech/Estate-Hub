import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PROPERTY_TYPES } from '@/lib/format';

export default function SearchBar({ compact = false }) {
    const [listingType, setListingType] = useState('for_sale');
    const [keyword, setKeyword] = useState('');
    const [propertyType, setPropertyType] = useState('all');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set('listing_type', listingType);
        if (keyword) params.set('q', keyword);
        if (propertyType !== 'all') params.set('property_type', propertyType);
        if (location) params.set('location', location);
        navigate(`/listings?${params.toString()}`);
    };

    if (compact) {
        return (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="flex rounded-lg border border-border bg-card p-0.5">
                    <button
                        onClick={() => setListingType('for_sale')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${listingType === 'for_sale' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                    >For Sale</button>
                    <button
                        onClick={() => setListingType('for_rent')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${listingType === 'for_rent' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                    >For Rent</button>
                </div>
                <Input placeholder="Enter a city, neighborhood, or zip" value={location} onChange={e => setLocation(e.target.value)} className="flex-1" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Property Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button onClick={handleSearch} className="gap-2"><Search className="w-4 h-4" /> Search</Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-center mb-5">
                <div className="inline-flex rounded-xl border border-white/30 bg-white/10 backdrop-blur p-1">
                    <button
                        onClick={() => setListingType('for_sale')}
                        className={`px-8 py-2.5 text-sm font-semibold rounded-lg transition-all ${listingType === 'for_sale' ? 'bg-white text-primary shadow-md' : 'text-white/90 hover:text-white'}`}
                    >For Sale</button>
                    <button
                        onClick={() => setListingType('for_rent')}
                        className={`px-8 py-2.5 text-sm font-semibold rounded-lg transition-all ${listingType === 'for_rent' ? 'bg-white text-primary shadow-md' : 'text-white/90 hover:text-white'}`}
                    >For Rent</button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-2">
                <Input placeholder="Enter a city, neighborhood, or zip code" value={location} onChange={e => setLocation(e.target.value)} className="flex-1 h-12 border-0 focus-visible:ring-0 text-base" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="w-full md:w-44 h-12 border-0 focus-visible:ring-0"><SelectValue placeholder="Property Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Input placeholder="Keywords (e.g. pool, garage)" value={keyword} onChange={e => setKeyword(e.target.value)} className="flex-1 h-12 border-0 focus-visible:ring-0 text-base" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                <Button onClick={handleSearch} size="lg" className="h-12 px-8 gap-2"><Search className="w-5 h-5" /> Search</Button>
            </div>
        </div>
    );
}