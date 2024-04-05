import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface LinkPreviewProps {
  url: string;
  onFailLoad?: () => void;
}

export const LinkPreview = ({ url: _url, onFailLoad }: LinkPreviewProps) => {
  const [isImageError, setIsImageError] = useState(false);
  const { data, isError, isFetched } = useQuery({
    queryKey: ['link-preview', _url],
    queryFn: async () => {
      try {
        const res = axios.get('/api/link-preview', {
          params: {
            q: _url,
          },
        });
        return res;
      } catch (error) {
        return null;
      }
    },
  });

  const previewData = data?.data.data as {
    title: string;
    description: string;
    url: string;
    favicon: string;
    image?: string;
  } | null;

  useEffect(() => {
    if (!isFetched) return;
    if (!previewData || isError || !previewData.favicon) {
      onFailLoad?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_url, isError, previewData, isFetched]);

  if (!previewData || isError || !previewData.favicon) {
    return null;
  }

  return (
    <Link
      href={previewData?.url}
      target="_blank"
      className="block w-full max-w-lg rounded-2xl border p-2 hover:opacity-90"
    >
      <div className="flex items-center gap-1">
        <div className="size-4 shrink-0">
          {/* <Image
            quality={100}
            src={previewData?.favicon}
            width={500}
            height={500}
            alt={previewData?.title}
          /> */}
        </div>
        <h6 className="line-clamp-1 text-sm font-bold text-primary">
          {previewData?.title}
        </h6>
      </div>
      <p className="line-clamp-1 text-base text-neutral-600 md:text-sm">
        {previewData?.description}
      </p>
      {!isImageError && previewData.image && (
        <div className="mt-3  max-w-64 overflow-hidden rounded-lg border md:max-w-none">
          {/* <Image
            quality={100}
            src={previewData.image}
            width={500}
            height={500}
            alt={previewData.title}
            onError={(e) => {
              setIsImageError(true);
            }}
          /> */}
        </div>
      )}
    </Link>
  );
};
