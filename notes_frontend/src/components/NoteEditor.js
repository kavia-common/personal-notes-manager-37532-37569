import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Form to create or edit a note.
 */
export default function NoteEditor({ initialValue = null, onSave, onCancel, saving = false }) {
  const [title, setTitle] = useState(initialValue?.title || '');
  const [content, setContent] = useState(initialValue?.content || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialValue?.title || '');
    setContent(initialValue?.content || '');
  }, [initialValue]);

  const validate = () => {
    if (!title.trim()) return 'Title is required';
    if (!content.trim()) return 'Content is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    await onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      border: '1px solid var(--border-color, #e5e7eb)',
      borderRadius: 10,
      padding: 12,
      textAlign: 'left',
      marginBottom: 12
    }}>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: 4 }}>Title</label>
        <input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color, #e5e7eb)' }}
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="content" style={{ display: 'block', marginBottom: 4 }}>Content</label>
        <textarea
          id="content"
          rows={5}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your note..."
          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border-color, #e5e7eb)', fontFamily: 'inherit' }}
        />
      </div>
      {error && <div role="status" aria-live="polite" style={{ color: 'var(--error, #EF4444)', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="theme-toggle" disabled={saving} aria-label="Save note" style={{ padding: '8px 12px' }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        {onCancel && (
          <button type="button" className="theme-toggle" onClick={onCancel} aria-label="Cancel edit" style={{ padding: '8px 12px', background: '#6b7280' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
