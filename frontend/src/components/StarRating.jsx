import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 20, readOnly = false }) {
    const [hover, setHover] = useState(0);
    const display = hover || value;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && onChange?.(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    <Star
                        className={`${size === 20 ? 'w-5 h-5' : 'w-4 h-4'} transition-colors ${star <= display ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}