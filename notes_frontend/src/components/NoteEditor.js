import React, { useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Form to create or edit a note.
 * - Renders primary button text as "Create" when adding a new note, "Save" when editing.
 * - Disables primary action when title/content are empty and shows helper text.
 * - Uses onSave/onCancel props for parent-controlled flow.
 */
export default function NoteEditor({ initialValue = null, onSave, onCancel, saving = false }) {
  const [title, setTitle] = useState(initialValue?.title || '');
  const [content, setContent] = useState(initialValue?.content || '');
  const [error, setError] = useState('');

  // Determine whether we are editing an existing note or creating a new one
  const isEditing = useMemo(() => Boolean(initialValue && initialValue.id), [initialValue]);
  const primaryLabel = isEditing ? 'Save' : 'Create';

  useEffect(() => {
    // Keep internal state in sync with parent-provided value
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
    // Delegate save to parent. Parent decides create vs update.
    await onSave?.({ title: title.trim(), content: content.trim() });
  };

  const isDisabled = saving || !title.trim() || !content.trim();
  const helper = !title.trim()
    ? 'Please enter a title.'
    : !content.trim()
      ? 'Please enter content.'
      : '';

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
        {!title.trim() && (
          <small style={{ color: 'var(--error, #EF4444)', display: 'block', marginTop: 4 }}>
            Title is required.
          </small>
        )}
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
        {!content.trim() && (
          <small style={{ color: 'var(--error, #EF4444)', display: 'block', marginTop: 4 }}>
            Content is required.
          </small>
        )}
      </div>
      {(error || helper) && (
        <div role="status" aria-live="polite" style={{ color: 'var(--error, #EF4444)', marginBottom: 8 }}>
          {error || helper}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="submit"
          className="theme-toggle"
          disabled={isDisabled}
          aria-label={`${primaryLabel} note`}
          style={{ padding: '8px 12px' }}
        >
          {saving ? 'Saving…' : primaryLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="theme-toggle"
            onClick={onCancel}
            aria-label="Cancel edit"
            style={{ padding: '8px 12px', background: '#6b7280' }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
