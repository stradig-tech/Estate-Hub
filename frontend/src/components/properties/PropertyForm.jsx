import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService, fileService } from '@/api/services';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Upload, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { PROPERTY_TYPES, AMENITIES } from '@/lib/format';

const STEPS = ['Basic Info', 'Details', 'Location', 'Media', 'Amenities'];

export default function PropertyForm({ initialData, onSubmit }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(initialData || {
        title: '', description: '', price: '', listing_type: 'for_sale', property_type: 'house',
        bedrooms: '', bathrooms: '', size: '', lot_size: '', year_built: '', parking: '',
        address: '', city: '', state: '', zip_code: '', latitude: '', longitude: '',
        images: [], floor_plan_image: '', floor_plan_images: [], video_url: '', virtual_tour_url: '', amenities: [],
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                description: initialData.description || '',
                price: initialData.price != null ? String(initialData.price) : '',
                listing_type: initialData.listing_type || 'for_sale',
                property_type: initialData.property_type || 'house',
                bedrooms: initialData.bedrooms != null ? String(initialData.bedrooms) : '',
                bathrooms: initialData.bathrooms != null ? String(initialData.bathrooms) : '',
                size: initialData.size != null ? String(initialData.size) : '',
                lot_size: initialData.lot_size != null ? String(initialData.lot_size) : '',
                year_built: initialData.year_built != null ? String(initialData.year_built) : '',
                parking: initialData.parking != null ? String(initialData.parking) : '',
                address: initialData.address || '',
                city: initialData.city || '',
                state: initialData.state || '',
                zip_code: initialData.zip_code || '',
                latitude: initialData.latitude != null ? String(initialData.latitude) : '',
                longitude: initialData.longitude != null ? String(initialData.longitude) : '',
                images: Array.isArray(initialData.images) ? initialData.images : [],
                floor_plan_image: initialData.floor_plan_image || '',
                floor_plan_images: Array.isArray(initialData.floor_plan_images) && initialData.floor_plan_images.length > 0
                    ? initialData.floor_plan_images
                    : (initialData.floor_plan_image ? [initialData.floor_plan_image] : []),
                video_url: initialData.video_url || '',
                virtual_tour_url: initialData.virtual_tour_url || '',
                amenities: Array.isArray(initialData.amenities) ? initialData.amenities : [],
            });
        }
    }, [initialData]);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleImageUpload = async (e, field) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setUploading(true);
        try {
            const urls = [];
            for (const file of files) {
                const res = await fileService.upload(file);
                const file_url = res.url || res.file_url;
                if (file_url) {
                    urls.push(file_url);
                }
            }
            if (field === 'images') {
                set('images', [...(form.images || []), ...urls]);
            } else if (field === 'floor_plan_images') {
                const updated = [...(form.floor_plan_images || []), ...urls];
                set('floor_plan_images', updated);
                set('floor_plan_image', updated[0] || '');
            } else {
                set(field, urls[0] || '');
            }
        } catch (err) {
            console.error('Failed to upload image:', err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (idx) => set('images', (form.images || []).filter((_, i) => i !== idx));

    const toggleAmenity = (a) => {
        const current = form.amenities || [];
        set('amenities', current.includes(a) ? current.filter(x => x !== a) : [...current, a]);
    };

    const canProceed = () => {
        if (step === 0) return form.title && form.price && form.listing_type && form.property_type;
        if (step === 2) return form.address && form.city && form.state;
        return true;
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const payload = {
            ...form,
            price: Number(form.price),
            bedrooms: Number(form.bedrooms) || 0,
            bathrooms: Number(form.bathrooms) || 0,
            size: Number(form.size) || 0,
            lot_size: form.lot_size ? Number(form.lot_size) : null,
            year_built: form.year_built ? Number(form.year_built) : null,
            parking: Number(form.parking) || 0,
            latitude: form.latitude ? Number(form.latitude) : null,
            longitude: form.longitude ? Number(form.longitude) : null,
        };
        if (!initialData) {
            payload.agent_id = user?.id;
            payload.agent_name = user?.full_name;
            payload.status = 'pending';
            payload.views = 0;
        }
        if (onSubmit) {
            await onSubmit(payload);
        } else {
            await propertyService.create(payload);
            navigate('/dashboard');
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                {STEPS.map((label, i) => (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                        <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i < step ? 'bg-primary text-primary-foreground border-primary' : i === step ? 'border-primary' : 'border-border'}`}>
                                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                            </div>
                            <span className="text-xs font-medium hidden sm:block">{label}</span>
                        </div>
                        {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
                    </div>
                ))}
            </div>

            <Card className="p-6">
                {step === 0 && (
                    <div className="space-y-4">
                        <div>
                            <Label>Listing Title *</Label>
                            <Input value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder="e.g. Modern Family Home with Pool" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Describe the property..." rows={4} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Listing Type *</Label>
                                <Select value={form.listing_type || 'for_sale'} onValueChange={v => set('listing_type', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="for_sale">For Sale</SelectItem>
                                        <SelectItem value="for_rent">For Rent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Property Type *</Label>
                                <Select value={form.property_type || 'house'} onValueChange={v => set('property_type', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Price ($) *</Label>
                            <Input type="number" value={form.price || ''} onChange={e => set('price', e.target.value)} placeholder="e.g. 450000" />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div><Label>Bedrooms</Label><Input type="number" value={form.bedrooms ?? ''} onChange={e => set('bedrooms', e.target.value)} /></div>
                            <div><Label>Bathrooms</Label><Input type="number" value={form.bathrooms ?? ''} onChange={e => set('bathrooms', e.target.value)} /></div>
                            <div><Label>Size (sqft)</Label><Input type="number" value={form.size ?? ''} onChange={e => set('size', e.target.value)} /></div>
                            <div><Label>Lot Size (sqft)</Label><Input type="number" value={form.lot_size ?? ''} onChange={e => set('lot_size', e.target.value)} /></div>
                            <div><Label>Year Built</Label><Input type="number" value={form.year_built ?? ''} onChange={e => set('year_built', e.target.value)} /></div>
                            <div><Label>Parking Spaces</Label><Input type="number" value={form.parking ?? ''} onChange={e => set('parking', e.target.value)} /></div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div><Label>Street Address *</Label><Input value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="123 Main Street" /></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div><Label>City *</Label><Input value={form.city || ''} onChange={e => set('city', e.target.value)} placeholder="Austin" /></div>
                            <div><Label>State *</Label><Input value={form.state || ''} onChange={e => set('state', e.target.value)} placeholder="TX" /></div>
                            <div><Label>Zip Code</Label><Input value={form.zip_code || ''} onChange={e => set('zip_code', e.target.value)} placeholder="78701" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Latitude</Label><Input type="number" step="any" value={form.latitude ?? ''} onChange={e => set('latitude', e.target.value)} placeholder="30.2672" /></div>
                            <div><Label>Longitude</Label><Input type="number" step="any" value={form.longitude ?? ''} onChange={e => set('longitude', e.target.value)} placeholder="-97.7431" /></div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-5">
                        <div>
                            <Label className="mb-2 block">Property Photos</Label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {form.images?.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors text-muted-foreground hover:text-primary">
                                    <Upload className="w-5 h-5 mb-1" />
                                    <span className="text-xs">{uploading ? 'Uploading...' : 'Upload'}</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'images')} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                        <div>
                            <Label className="mb-2 block">Floor Plan Diagrams (Multi)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {(form.floor_plan_images || (form.floor_plan_image ? [form.floor_plan_image] : [])).map((fp, i) => (
                                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border group bg-slate-50">
                                        <img src={fp} alt={`Floor plan ${i + 1}`} className="w-full h-full object-contain p-1" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const list = (form.floor_plan_images || (form.floor_plan_image ? [form.floor_plan_image] : [])).filter((_, idx) => idx !== i);
                                                set('floor_plan_images', list);
                                                set('floor_plan_image', list[0] || '');
                                            }}
                                            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                            {i === 0 ? 'Main Plan' : `Plan #${i + 1}`}
                                        </span>
                                    </div>
                                ))}
                                <label className="aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors text-muted-foreground hover:text-primary">
                                    <Upload className="w-4 h-4 mb-1" />
                                    <span className="text-xs">{uploading ? 'Uploading...' : 'Upload Floor Plan'}</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'floor_plan_images')} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><Label>Video URL</Label><Input value={form.video_url || ''} onChange={e => set('video_url', e.target.value)} placeholder="https://youtube.com/..." /></div>
                            <div><Label>360° Virtual Tour URL</Label><Input value={form.virtual_tour_url || ''} onChange={e => set('virtual_tour_url', e.target.value)} placeholder="https://..." /></div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <Label>Select Amenities</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {AMENITIES.map(a => (
                                <label key={a} className="flex items-center space-x-2 p-2.5 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors">
                                    <Checkbox checked={form.amenities?.includes(a) || false} onCheckedChange={() => toggleAmenity(a)} />
                                    <span className="text-sm">{a}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                {step < STEPS.length - 1 ? (
                    <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Submit Property')}
                    </Button>
                )}
            </div>
        </div>
    );
}