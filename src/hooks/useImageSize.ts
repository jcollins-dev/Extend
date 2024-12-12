import { useEffect, useState } from 'react';

export interface ImageSize {
  width: number;
  height: number;
}
export default function useImageSize(url: string): null | ImageSize {
  const [size, setSize] = useState<null | ImageSize>(null);

  useEffect(() => {
    if (!url) return;
    const img = document.createElement('img');
    img.addEventListener('load', (e: Event) => {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget as HTMLImageElement;
      setSize({ width, height });
    });
    img.src = url;
  }, [url]);

  return size;
}
