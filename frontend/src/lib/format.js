export function formatPrice(price, listingType) {
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(price);
    if (listingType === 'for_rent') return formatted + '/mo';
    return formatted;
}

export function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num || 0);
}

export function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export const AMENITIES = [
    'Pool', 'Gym', 'Garage', 'Garden', 'Air Conditioning', 'Heating',
    'Wifi', 'Furnished', 'Pet Friendly', 'Balcony', 'Security System', 'Fireplace',
    'Parking', 'Elevator', 'Laundry', 'Dishwasher', 'Solar Panels', 'Smart Home',
];

export const PROPERTY_TYPES = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
];