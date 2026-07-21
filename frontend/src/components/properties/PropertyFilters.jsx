import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { PROPERTY_TYPES, AMENITIES } from '@/lib/format';
import { Filter, X } from 'lucide-react';

export default function PropertyFilters({ filters, onChange, onClear }) {
    const update = (key, value) => onChange({ ...filters, [key]: value });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
                <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /> Clear</Button>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Property Type</Label>
                <Select value={filters.property_type || 'all'} onValueChange={v => update('property_type', v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Price Range</Label>
                <div className="flex items-center gap-2 mb-2">
                    <Input type="number" placeholder="Min" value={filters.min_price || ''} onChange={e => update('min_price', e.target.value ? Number(e.target.value) : '')} className="text-sm" />
                    <span className="text-muted-foreground">—</span>
                    <Input type="number" placeholder="Max" value={filters.max_price || ''} onChange={e => update('max_price', e.target.value ? Number(e.target.value) : '')} className="text-sm" />
                </div>
                <Slider
                    min={0}
                    max={2000000}
                    step={50000}
                    value={[filters.min_price || 0, filters.max_price || 2000000]}
                    onValueChange={([min, max]) => onChange({ ...filters, min_price: min, max_price: max })}
                    className="mt-3"
                />
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Bedrooms</Label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button
                            key={n}
                            onClick={() => update('min_beds', filters.min_beds === n ? '' : n)}
                            className={`flex-1 py-1.5 text-sm rounded-md border transition-colors ${filters.min_beds === n ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
                        >
                            {n === 5 ? '5+' : n}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Bathrooms</Label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button
                            key={n}
                            onClick={() => update('min_baths', filters.min_baths === n ? '' : n)}
                            className={`flex-1 py-1.5 text-sm rounded-md border transition-colors ${filters.min_baths === n ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
                        >
                            {n === 5 ? '5+' : n}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Min Size (sqft)</Label>
                <Input type="number" placeholder="0" value={filters.min_size || ''} onChange={e => update('min_size', e.target.value ? Number(e.target.value) : '')} className="text-sm" />
            </div>

            <div>
                <Label className="text-sm font-medium mb-2 block">Amenities</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {AMENITIES.map(a => (
                        <div key={a} className="flex items-center space-x-2">
                            <Checkbox
                                id={`amen-${a}`}
                                checked={filters.amenities?.includes(a) || false}
                                onCheckedChange={checked => {
                                    const current = filters.amenities || [];
                                    update('amenities', checked ? [...current, a] : current.filter(x => x !== a));
                                }}
                            />
                            <Label htmlFor={`amen-${a}`} className="text-sm font-normal cursor-pointer">{a}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}