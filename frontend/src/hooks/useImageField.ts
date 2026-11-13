import { useCallback, useRef, useState, type ChangeEvent } from 'react';
import { authUploadFile } from '@/services/api';

export function useImageField(initial = '') {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef(initial);
  const uploadingRef = useRef(false);
  const [url, setUrl] = useState(initial);
  const [uploading, setUploading] = useState(false);

  const setImage = useCallback((next: string) => {
    urlRef.current = next;
    setUrl(next);
  }, []);

  const onFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file?.type.startsWith('image/')) return;
      uploadingRef.current = true;
      setUploading(true);
      try {
        const { url: uploaded } = await authUploadFile(file);
        setImage(uploaded);
      } finally {
        uploadingRef.current = false;
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [setImage],
  );

  const waitForImage = useCallback(async () => {
    while (uploadingRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return urlRef.current;
  }, []);

  return { fileInputRef, url, setImage, uploading, onFileChange, waitForImage };
}
