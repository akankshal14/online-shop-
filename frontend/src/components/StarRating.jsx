import React, { useState } from 'react';

export default function StarRating({ value, onChange, readonly = false, size = '1.1rem' }) {
  const [hover, setHover] = useState(null);
  const display = hover ?? value ?? 0;

  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          className={`star${display >= s ? ' filled' : ''}`}
          style={{ fontSize: size, cursor: readonly ? 'default' : 'pointer' }}
          onClick={() => !readonly && onChange?.(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(null)}
        >★</span>
      ))}
    </span>
  );
}
