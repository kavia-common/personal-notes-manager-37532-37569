import React from 'react';
import NoteItem from './NoteItem';

/**
 * PUBLIC_INTERFACE
 * NotesList
 * Renders a collection of notes.
 */
export default function NotesList({ notes, onEdit, onDelete }) {
  if (!notes?.length) {
    return <p style={{ opacity: 0.7 }}>No notes found.</p>;
  }
  return (
    <div>
      {notes.map((n) => (
        <NoteItem key={n.id} note={n} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
