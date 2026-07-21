import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService, nearbyPlaceService, inquiryService } from '@/api/services';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImageGallery from '@/components/properties/ImageGallery';
import InteractiveFloorPlan from '@/components/properties/InteractiveFloorPlan';
import MortgageCalculator from '@/components/properties/MortgageCalculator';
import PropertyCard from '@/components/properties/PropertyCard';
import { Bed, Bath, Maximize, MapPin, Calendar, Car, CheckCircle, School, Hospital, UtensilsCrossed, ShoppingBag, Bus, TreePine, Play, Box, Eye } from 'lucide-react';
import { formatPrice, formatNumber, PROPERTY_TYPES } from '@/lib/format';

const PLACE_ICONS = { school: School, hospital: Hospital, restaurant: UtensilsCrossed, shopping: ShoppingBag, transit: Bus, park: TreePine };

function getYouTubeEmbed(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default function PropertyDetail() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [nearby, setNearby] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [inquirySent, setInquirySent] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const p = await propertyService.get(id);
                setProperty(p);
                propertyService.update(id, { views: (p.views || 0) + 1 }).catch(() => { });
                nearbyPlaceService.list({ property_id: id }).then(data => setNearby(data.results || data)).catch(() => { });
                if (p.city) {
                    propertyService.list({ status: 'active', city: p.city, limit: 4 })
                        .then(data => {
                            const props = data.results || data;
                            setSimilar(props.filter(x => x.id !== id).slice(0, 3));
                        })
                        .catch(() => { });
                }
            } catch (e) {
                // no-op
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleInquiry = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await inquiryService.create({
                property_id: property.id,
                property_title: property.title,
                agent_id: property.agent_id,
                ...inquiry,
            });
            // Email is now sent via Django backend signals or explicitly on create
            setInquirySent(true);
        } catch (err) {
            // no-op
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
    if (!property) return (
        <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">Property not found.</p>
            <Button asChild><Link to="/listings">Browse Listings</Link></Button>
        </div>
    );

    const propType = PROPERTY_TYPES.find(t => t.value === property.property_type)?.label || property.property_type;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-2 flex-wrap">
                <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
                <Link to="/listings" className="hover:text-primary">Listings</Link><span>/</span>
                <span className="text-foreground truncate">{property.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ImageGallery images={property.images} title={property.title} />

                    <div>
                        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-primary text-primary-foreground">{property.listing_type === 'for_sale' ? 'For Sale' : 'For Rent'}</Badge>
                                    <Badge variant="secondary">{propType}</Badge>
                                    {property.featured && <Badge className="bg-amber-500 text-white">Featured</Badge>}
                                </div>
                                <h1 className="text-2xl font-bold">{property.title}</h1>
                                <p className="text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" /> {property.address}, {property.city}, {property.state} {property.zip_code}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-primary">{formatPrice(property.price, property.listing_type)}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end"><Eye className="w-3.5 h-3.5" /> {property.views || 0} views</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-muted/50 rounded-xl p-4 mt-4">
                            <div className="text-center"><Bed className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-lg font-bold">{property.bedrooms}</p><p className="text-xs text-muted-foreground">Bedrooms</p></div>
                            <div className="text-center"><Bath className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-lg font-bold">{property.bathrooms}</p><p className="text-xs text-muted-foreground">Bathrooms</p></div>
                            <div className="text-center"><Maximize className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-lg font-bold">{formatNumber(property.size)}</p><p className="text-xs text-muted-foreground">sqft</p></div>
                            <div className="text-center"><Car className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-lg font-bold">{property.parking || 0}</p><p className="text-xs text-muted-foreground">Parking</p></div>
                            <div className="text-center"><Calendar className="w-5 h-5 mx-auto text-primary mb-1" /><p className="text-lg font-bold">{property.year_built || '—'}</p><p className="text-xs text-muted-foreground">Year Built</p></div>
                        </div>
                    </div>

                    {property.description && (
                        <Card className="p-5">
                            <h2 className="font-semibold mb-2">Description</h2>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{property.description}</p>
                        </Card>
                    )}

                    {property.amenities?.length > 0 && (
                        <Card className="p-5">
                            <h2 className="font-semibold mb-3">Amenities</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {property.amenities.map(a => (
                                    <div key={a} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-500" /> {a}</div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Floor Plan Section — accordion with interactive SVG */}
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-1">Floor Plan</h2>
                        <p className="text-sm text-muted-foreground mb-4">Click on any room in the floor plan to see detailed information about it.</p>
                        <InteractiveFloorPlan property={property} floorPlanImage={property.floor_plan_image} />
                    </div>

                    {/* Media Section — video & virtual tour */}
                    {(property.video_url || property.virtual_tour_url) && (
                        <Card className="p-5">
                            <Tabs defaultValue={property.video_url ? 'video' : 'tour'}>
                                <TabsList>
                                    {property.video_url && <TabsTrigger value="video">Video</TabsTrigger>}
                                    {property.virtual_tour_url && <TabsTrigger value="tour">360° Tour</TabsTrigger>}
                                </TabsList>
                                {property.video_url && (
                                    <TabsContent value="video">
                                        <div className="aspect-video"><iframe src={getYouTubeEmbed(property.video_url)} className="w-full h-full rounded-lg" allowFullScreen /></div>
                                    </TabsContent>
                                )}
                                {property.virtual_tour_url && (
                                    <TabsContent value="tour">
                                        <div className="text-center py-8">
                                            <Box className="w-12 h-12 mx-auto text-primary mb-3" />
                                            <p className="text-muted-foreground mb-3">Experience this property in 360° virtual tour</p>
                                            <Button asChild><a href={property.virtual_tour_url} target="_blank" rel="noopener"><Play className="w-4 h-4 mr-1" /> Start Virtual Tour</a></Button>
                                        </div>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </Card>
                    )}

                    {nearby.length > 0 && (
                        <Card className="p-5">
                            <h2 className="font-semibold mb-3">Nearby Places</h2>
                            <div className="space-y-2">
                                {nearby.map(place => {
                                    const Icon = PLACE_ICONS[place.type] || MapPin;
                                    return (
                                        <div key={place.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{place.name}</p>
                                                {place.address && <p className="text-xs text-muted-foreground">{place.address}</p>}
                                            </div>
                                            {place.distance && <span className="text-sm text-muted-foreground">{place.distance} mi</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="space-y-4">
                    {property.agent_name && (
                        <Card className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                    {property.agent_name[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold">{property.agent_name}</p>
                                    <p className="text-sm text-muted-foreground">Listing Agent</p>
                                </div>
                            </div>
                            {property.agent_id && (
                                <Button asChild variant="outline" className="w-full mb-3">
                                    <Link to={`/agents/${property.agent_id}`}>View Agent Profile</Link>
                                </Button>
                            )}
                        </Card>
                    )}

                    <Card className="p-5">
                        <h3 className="font-semibold mb-3">Contact Agent</h3>
                        {inquirySent ? (
                            <div className="text-center py-6">
                                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                                <p className="font-medium">Inquiry Sent!</p>
                                <p className="text-sm text-muted-foreground">The agent will contact you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInquiry} className="space-y-3">
                                <div><Label className="text-xs">Name</Label><Input value={inquiry.name} onChange={e => setInquiry({ ...inquiry, name: e.target.value })} required placeholder="Your name" /></div>
                                <div><Label className="text-xs">Email</Label><Input type="email" value={inquiry.email} onChange={e => setInquiry({ ...inquiry, email: e.target.value })} required placeholder="you@email.com" /></div>
                                <div><Label className="text-xs">Phone</Label><Input value={inquiry.phone} onChange={e => setInquiry({ ...inquiry, phone: e.target.value })} placeholder="(555) 123-4567" /></div>
                                <div><Label className="text-xs">Message</Label><Textarea value={inquiry.message} onChange={e => setInquiry({ ...inquiry, message: e.target.value })} required rows={3} placeholder="I'm interested in this property..." /></div>
                                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Sending...' : 'Send Inquiry'}</Button>
                            </form>
                        )}
                    </Card>

                    <MortgageCalculator price={property.price} />
                </div>
            </div>

            {similar.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-5">Similar Properties</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {similar.map(p => <PropertyCard key={p.id} property={p} />)}
                    </div>
                </div>
            )}
        </div>
    );
}