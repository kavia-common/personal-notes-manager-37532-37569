import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteItem
 * Renders a single note with title/content preview and action buttons.
 */
export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <div className="card" style={{ padding: 12, marginBottom: 10, textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>{note.title}</h3>
        <small style={{ opacity: 0.7 }}>{new Date(note.updated_at || note.created_at).toLocaleString()}</small>
      </div>
      <p style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
        {note.content.length > 160 ? note.content.slice(0, 160) + '…' : note.content}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onEdit(note)} className="btn" aria-label="Edit note">
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(note)} className="btn danger" aria-label="Delete note">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
