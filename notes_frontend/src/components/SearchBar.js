import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar
 * Controlled input for searching notes.
 */
export default function SearchBar({ value, onChange, placeholder = 'Search notes...' }) {
  return (
    <input
      aria-label="Search notes"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid var(--border-color, #e5e7eb)',
        outline: 'none',
        marginBottom: 12
      }}
    />
  );
}
