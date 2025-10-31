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
      className="input"
      style={{ marginBottom: 0 }}
    />
  );
}
