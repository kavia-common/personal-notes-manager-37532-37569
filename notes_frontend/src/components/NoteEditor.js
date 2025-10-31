import React, { useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Form to create or edit a note.
 * - Renders primary button text as "Create" when adding a new note, "Save" when editing.
 * - Disables primary action when title/content are empty (no inline error messages are shown).
 * - Uses onSave/onCancel props for parent-controlled flow.
 */
export default function NoteEditor({ initialValue = null, onSave, onCancel, saving = false }) {
  const [title, setTitle] = useState(initialValue?.title || '');
  const [content, setContent] = useState(initialValue?.content || '');

  // Determine whether we are editing an existing note or creating a new one
  const isEditing = useMemo(() => Boolean(initialValue && initialValue.id), [initialValue]);
  const primaryLabel = isEditing ? 'Save' : 'Create';

  useEffect(() => {
    // Keep internal state in sync with parent-provided value
    setTitle(initialValue?.title || '');
    setContent(initialValue?.content || '');
  }, [initialValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent submission if fields are empty; we do not render inline errors
    if (!title.trim() || !content.trim()) return;
    await onSave?.({ title: title.trim(), content: content.trim() });
  };

  const isDisabled = saving || !title.trim() || !content.trim();

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
      </div>
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
