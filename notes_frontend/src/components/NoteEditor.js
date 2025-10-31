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
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ padding: 12, textAlign: 'left', marginBottom: 12 }}
    >
      <div className="mb-2">
        <label htmlFor="title" style={{ display: 'block', marginBottom: 4 }}>Title</label>
        <input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          className="input"
        />
        {!title.trim() && (
          <small style={{ color: 'var(--error)', display: 'block', marginTop: 4 }}>
            Title is required.
          </small>
        )}
      </div>
      <div className="mb-2">
        <label htmlFor="content" style={{ display: 'block', marginBottom: 4 }}>Content</label>
        <textarea
          id="content"
          rows={5}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your note..."
          className="input"
          style={{ fontFamily: 'inherit' }}
        />
        {!content.trim() && (
          <small style={{ color: 'var(--error)', display: 'block', marginTop: 4 }}>
            Content is required.
          </small>
        )}
      </div>
      {(error || helper) && (
        <div role="status" aria-live="polite" style={{ color: 'var(--error)', marginBottom: 8 }}>
          {error || helper}
        </div>
      )}
      <div className="editor-actions">
        <button
          type="submit"
          className="btn"
          disabled={isDisabled}
          aria-label={`${primaryLabel} note`}
        >
          {saving ? 'Saving…' : primaryLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn muted"
            onClick={onCancel}
            aria-label="Cancel edit"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
