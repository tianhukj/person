import { useCallback, useState } from 'react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';

/**
 * Uploads an image file to the person-docs bucket and returns the relative path.
 * Relative path = `person-docs/<path>` (no leading slash, no full URL).
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, folder: string): Promise<string | null> => {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      return fileName; // relative path within bucket
    } catch (err) {
      const msg = err instanceof Error ? err.message : '上传失败';
      setError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  /** Build a usable public URL from a relative path stored in the DB. */
  const publicUrl = useCallback((relativePath: string | null | undefined): string => {
    if (!relativePath) return '';
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(relativePath).data.publicUrl;
  }, []);

  const remove = useCallback(async (relativePath: string | null | undefined) => {
    if (!relativePath) return;
    try {
      await supabase.storage.from(STORAGE_BUCKET).remove([relativePath]);
    } catch {
      /* ignore */
    }
  }, []);

  return { upload, publicUrl, remove, uploading, error };
}
