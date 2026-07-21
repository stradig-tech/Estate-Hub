import { useState } from 'react';
import { Bed, Bath, Maximize, DollarSign, ChevronDown, X, Square, UtensilsCrossed, Sofa, Car, DoorOpen } from 'lucide-react';
import { formatPrice, formatNumber } from '@/lib/format';

const ROOM_ICONS = {
    bedroom: Bed, bathroom: Bath, kitchen: UtensilsCrossed, living: Sofa,
    dining: Sofa, garage: Car, entry: DoorOpen, hallway: Square,
};

const ROOM_COLORS = {
    bedroom: { fill: '#dbeafe', hover: '#bfdbfe', stroke: '#3b82f6' },
    bathroom: { fill: '#cffafe', hover: '#a5f3fc', stroke: '#06b6d4' },
    kitchen: { fill: '#fef3c7', hover: '#fde68a', stroke: '#f59e0b' },
    living: { fill: '#dcfce7', hover: '#bbf7d0', stroke: '#22c55e' },
    dining: { fill: '#fce7f3', hover: '#fbcfe8', stroke: '#ec4899' },
    garage: { fill: '#f3f4f6', hover: '#e5e7eb', stroke: '#6b7280' },
    entry: { fill: '#fef9c3', hover: '#fef08a', stroke: '#eab308' },
    hallway: { fill: '#f8fafc', hover: '#f1f5f9', stroke: '#94a3b8' },
};

const DEFAULT_ROOMS = [
    { id: 'master', type: 'bedroom', name: 'Master Bedroom', dims: '14 x 12', points: '20,20 200,20 200,160 20,160' },
    { id: 'bed2', type: 'bedroom', name: 'Bedroom 2', dims: '11 x 10', points: '200,20 320,20 320,120 200,120' },
    { id: 'bath1', type: 'bathroom', name: 'Master Bathroom', dims: '8 x 6', points: '320,20 420,20 420,80 320,80' },
    { id: 'bath2', type: 'bathroom', name: 'Guest Bathroom', dims: '6 x 5', points: '320,80 420,80 420,140 320,140' },
    { id: 'bed3', type: 'bedroom', name: 'Bedroom 3', dims: '10 x 10', points: '200,120 320,120 320,220 200,220' },
    { id: 'living', type: 'living', name: 'Living Room', dims: '18 x 14', points: '420,20 580,20 580,200 420,200' },
    { id: 'kitchen', type: 'kitchen', name: 'Kitchen', dims: '12 x 10', points: '420,200 580,200 580,300 420,300' },
    { id: 'dining', type: 'dining', name: 'Dining Area', dims: '14 x 10', points: '200,220 380,220 380,320 200,320' },
    { id: 'entry', type: 'entry', name: 'Entry / Foyer', dims: '6 x 8', points: '380,220 420,220 420,320 380,320' },
    { id: 'hallway', type: 'hallway', name: 'Hallway', dims: '18 x 4', points: '20,160 200,160 200,220 20,220' },
    { id: 'garage', type: 'garage', name: 'Garage', dims: '16 x 12', points: '20,220 200,220 200,360 20,360' },
    { id: 'laundry', type: 'bathroom', name: 'Laundry Room', dims: '6 x 6', points: '380,320 460,320 460,380 380,380' },
    { id: 'patio', type: 'living', name: 'Patio', dims: '12 x 8', points: '460,300 580,300 580,380 460,380' },
];

export default function InteractiveFloorPlan({ property, rooms = DEFAULT_ROOMS, floorPlanImage }) {
    const [expanded, setExpanded] = useState(true);
    const [hovered, setHovered] = useState(null);
    const [selected, setSelected] = useState(null);

    const toPath = (points) => {
        const coords = points.split(' ').map(p => p.split(',').map(Number));
        return `M ${coords.map(c => c.join(' ')).join(' L ')} Z`;
    };

    const price = property?.price || 0;
    const area = property?.size || 0;
    const beds = property?.bedrooms || 0;
    const baths = property?.bathrooms || 0;
    const planName = property?.title || 'Floor Plan';

    const metaItems = [
        { icon: DollarSign, label: formatPrice(price, property?.listing_type), short: formatPrice(price, property?.listing_type) },
        { icon: Maximize, label: `${formatNumber(area)} SqFt`, short: `${formatNumber(area)} SqFt` },
        { icon: Bed, label: `${beds} Bedroom${beds !== 1 ? 's' : ''}`, short: `${beds} Bed` },
        { icon: Bath, label: `${baths} Bathroom${baths !== 1 ? 's' : ''}`, short: `${baths} Bath` },
    ];

    const selectedRoom = rooms.find(r => r.id === selected);
    const hoveredRoom = rooms.find(r => r.id === hovered);
    const activeRoom = selectedRoom || hoveredRoom;

    if (floorPlanImage) {
        return (
            <div className="space-y-4">
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? '' : '-rotate-90'}`} />
                            <span className="font-bold text-foreground">{planName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {metaItems.map((m, i) => (
                                <span key={i} className="flex items-center gap-1">
                                    <m.icon className="w-4 h-4" /> <span className="hidden sm:inline">{m.label}</span><span className="sm:hidden">{m.short}</span>
                                </span>
                            ))}
                        </div>
                    </button>
                    {expanded && (
                        <div className="p-4 border-t border-border">
                            <div className="relative aspect-[3/2] rounded-lg overflow-hidden border border-border bg-muted">
                                <img src={floorPlanImage} alt="Floor plan" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Accordion card */}
            <div className="bg-white border border-border rounded-xl overflow-hidden">
                {/* Accordion header */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`} />
                        <span className="font-bold text-foreground">{planName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {metaItems.map((m, i) => (
                            <span key={i} className="flex items-center gap-1">
                                <m.icon className="w-4 h-4" /> <span className="hidden md:inline">{m.label}</span><span className="md:hidden">{m.short}</span>
                            </span>
                        ))}
                    </div>
                </button>

                {/* Accordion body */}
                {expanded && (
                    <div className="border-t border-border">
                        {/* Room info bar */}
                        {activeRoom && (
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/60 border-b border-border">
                                {(() => {
                                    const Icon = ROOM_ICONS[activeRoom.type] || Square;
                                    const colors = ROOM_COLORS[activeRoom.type] || ROOM_COLORS.hallway;
                                    return (
                                        <>
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.fill }}>
                                                <Icon className="w-4 h-4" style={{ color: colors.stroke }} />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-semibold">{activeRoom.name}</span>
                                                <span className="text-xs text-muted-foreground ml-2">{activeRoom.dims} ft · {activeRoom.type}</span>
                                            </div>
                                            {selectedRoom && (
                                                <button onClick={(e) => { e.stopPropagation(); setSelected(null); }} className="p-1 rounded hover:bg-muted-foreground/20">
                                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                                </button>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {/* SVG floor plan */}
                        <div className="p-4 bg-gray-50">
                            <svg viewBox="0 0 600 400" className="w-full h-auto" style={{ maxHeight: '500px' }}>
                                {/* Outer wall */}
                                <rect x="10" y="10" width="580" height="380" fill="none" stroke="#1e293b" strokeWidth="4" rx="2" />

                                {rooms.map(room => {
                                    const colors = ROOM_COLORS[room.type] || ROOM_COLORS.hallway;
                                    const isActive = hovered === room.id || selected === room.id;
                                    const Icon = ROOM_ICONS[room.type] || Square;
                                    const coords = room.points.split(' ').map(p => p.split(',').map(Number));
                                    const cx = coords.reduce((s, c) => s + c[0], 0) / coords.length;
                                    const cy = coords.reduce((s, c) => s + c[1], 0) / coords.length;

                                    return (
                                        <g key={room.id}>
                                            <path
                                                d={toPath(room.points)}
                                                fill={isActive ? colors.hover : colors.fill}
                                                stroke={colors.stroke}
                                                strokeWidth={isActive ? 2.5 : 1.5}
                                                className="cursor-pointer transition-all duration-200"
                                                onMouseEnter={() => setHovered(room.id)}
                                                onMouseLeave={() => setHovered(null)}
                                                onClick={() => setSelected(selected === room.id ? null : room.id)}
                                            />
                                            <g pointerEvents="none" opacity={isActive ? 1 : 0.6}>
                                                <Icon x={cx - 10} y={cy - 22} width="20" height="20" color={colors.stroke} />
                                            </g>
                                            <text x={cx} y={cy + 6} textAnchor="middle" fontSize="11" fontWeight={isActive ? '700' : '500'} fill="#334155" pointerEvents="none">{room.name}</text>
                                            <text x={cx} y={cy + 20} textAnchor="middle" fontSize="9" fill="#64748b" pointerEvents="none">{room.dims}</text>
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3 pt-3 border-t border-border">
                                {Object.entries(ROOM_COLORS).filter(([t]) => rooms.some(r => r.type === t)).map(([type, colors]) => (
                                    <div key={type} className="flex items-center gap-1.5">
                                        <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: colors.fill, border: `1px solid ${colors.stroke}` }} />
                                        <span className="text-xs text-muted-foreground capitalize">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}