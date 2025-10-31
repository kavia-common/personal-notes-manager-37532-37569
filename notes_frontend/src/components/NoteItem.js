import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteItem
 * Renders a single note with title/content preview and action buttons.
 */
export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <div style={{
      background: 'var(--bg-secondary, #f8f9fa)',
      border: '1px solid var(--border-color, #e5e7eb)',
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>{note.title}</h3>
        <small style={{ opacity: 0.7 }}>{new Date(note.updated_at || note.created_at).toLocaleString()}</small>
      </div>
      <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
        {note.content.length > 160 ? note.content.slice(0, 160) + '…' : note.content}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onEdit(note)} className="theme-toggle" aria-label="Edit note" style={{ padding: '6px 10px' }}>
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(note)} className="theme-toggle" aria-label="Delete note" style={{ padding: '6px 10px', background: 'var(--error, #EF4444)' }}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
