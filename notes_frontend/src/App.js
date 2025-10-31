import React, { useState, useEffect } from 'react';
import './App.css';
import { getSupabaseClient, isSupabaseConfigured } from './lib/supabaseClient';

import useNotes from './hooks/useNotes';
import SearchBar from './components/SearchBar';
import NoteEditor from './components/NoteEditor';
import NotesList from './components/NotesList';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [sbStatus, setSbStatus] = useState('checking');

  // notes state and actions
  const {
    notes,
    loading,
    error,
    search,
    setSearch,
    reload,
    addNote,
    editNote,
    removeNote
  } = useNotes({ initialSearch: '', userId: null, limit: null });

  // local UI state
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check Supabase configuration once on mount
  useEffect(() => {
    setSbStatus(isSupabaseConfigured() ? 'configured' : 'not-configured');
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const testSupabase = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setToast('Supabase client OK. Session present: ' + Boolean(data?.session));
    } catch (e) {
      setToast('Supabase error: ' + e.message);
    } finally {
      setTimeout(() => setToast(''), 2500);
    }
  };

  const startNewNote = () => {
    // Open editor in "create" mode by clearing current editing state
    setEditing(null);
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      if (editing && editing.id) {
        await editNote(editing.id, payload);
        setToast('Note updated');
      } else {
        await addNote(payload);
        setToast('Note created');
      }
      // Close editor after save
      setEditing(null);
    } catch (e) {
      setToast(e.message || 'Error saving note');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(''), 2500);
    }
  };

  const handleEdit = (note) => {
    setEditing(note);
  };

  const handleDelete = async (note) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await removeNote(note.id);
      setToast('Note deleted');
    } catch (e) {
      setToast(e.message || 'Error deleting note');
    } finally {
      setTimeout(() => setToast(''), 2500);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-top">
          <h1 style={{ margin: 0, fontSize: 24 }}>Personal Notes</h1>
          <div className="top-actions">
            <button
              className="btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button className="btn secondary" onClick={testSupabase} aria-label="Test Supabase">
              🔌 Test Supabase
            </button>
          </div>
        </div>

        <div role="status" aria-live="polite" style={{ minHeight: 20, color: 'var(--text-secondary)' }}>
          {toast}
        </div>

        <div className="container" style={{ textAlign: 'left' }}>
          {/* Responsive top toolbar: Search (flex-1), New Note, Reload */}
          <div className="app-toolbar mb-3" role="toolbar" aria-label="Notes toolbar">
            <div className="flex-1" style={{ minWidth: 200 }}>
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <button
              className="btn"
              onClick={startNewNote}
              aria-label="Create new note"
            >
              ➕ New Note
            </button>
            <button
              className="btn"
              onClick={reload}
              aria-label="Reload notes"
            >
              ⟳ Reload
            </button>
          </div>

          {/* Editor with footer actions (Save/Create/Cancel are inside component) */}
          <NoteEditor
            initialValue={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />

          {loading && <p>Loading notes…</p>}
          {error && <p style={{ color: 'var(--error)' }}>Error: {error.message}</p>}

          <NotesList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />

          <div className="mt-3" aria-hidden="true">
            <small>Supabase: <strong>{sbStatus}</strong></small>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
