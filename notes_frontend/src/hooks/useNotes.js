import { useCallback, useEffect, useMemo, useState } from 'react';
import { listNotes, createNote, updateNote, deleteNote } from '../lib/notesService';

/**
 * PUBLIC_INTERFACE
 * useNotes
 * React hook to manage a list of notes with loading/error state, search, and optimistic updates.
 * Options:
 *  - userId?: filter by user_id
 *  - initialSearch?: initial search text
 *  - limit?: limit results
 */
export default function useNotes({ userId = null, initialSearch = '', limit = null } = {}) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listNotes({ search, userId, limit });
      setNotes(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [search, userId, limit]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Optimistic create
  const addNote = useCallback(async ({ title, content }) => {
    setError(null);
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, title, content, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), user_id: userId };
    setNotes(prev => [optimistic, ...prev]);
    try {
      const created = await createNote({ title, content, user_id: userId });
      setNotes(prev => prev.map(n => (n.id === tempId ? created : n)));
      return created;
    } catch (e) {
      setNotes(prev => prev.filter(n => n.id !== tempId));
      setError(e);
      throw e;
    }
  }, [userId]);

  // Optimistic update
  const editNote = useCallback(async (id, updates) => {
    setError(null);
    const before = notes;
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n)));
    try {
      const updated = await updateNote(id, updates);
      setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
      return updated;
    } catch (e) {
      setNotes(before);
      setError(e);
      throw e;
    }
  }, [notes]);

  // Optimistic delete
  const removeNote = useCallback(async (id) => {
    setError(null);
    const before = notes;
    setNotes(prev => prev.filter(n => n.id !== id));
    try {
      await deleteNote(id);
      return true;
    } catch (e) {
      setNotes(before);
      setError(e);
      throw e;
    }
  }, [notes]);

  return useMemo(() => ({
    notes,
    loading,
    error,
    search,
    setSearch,
    reload,
    addNote,
    editNote,
    removeNote,
  }), [notes, loading, error, search, reload, addNote, editNote, removeNote]);
}
