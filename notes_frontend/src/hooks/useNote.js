import { useCallback, useEffect, useMemo, useState } from 'react';
import { getNote, updateNote, deleteNote } from '../lib/notesService';

/**
 * PUBLIC_INTERFACE
 * useNote
 * Hook to fetch and manage a single note by id.
 */
export default function useNote(id) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNote(id);
      setNote(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(async (updates) => {
    if (!id) throw new Error('Missing id');
    setError(null);
    const before = note;
    setNote(prev => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
    try {
      const updated = await updateNote(id, updates);
      setNote(updated);
      return updated;
    } catch (e) {
      setNote(before);
      setError(e);
      throw e;
    }
  }, [id, note]);

  const remove = useCallback(async () => {
    if (!id) throw new Error('Missing id');
    setError(null);
    try {
      await deleteNote(id);
      setNote(null);
      return true;
    } catch (e) {
      setError(e);
      throw e;
    }
  }, [id]);

  return useMemo(() => ({
    note, loading, error, reload, save, remove
  }), [note, loading, error, reload, save, remove]);
}
