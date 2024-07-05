import { useMemo, useState } from 'react';
import { LinkPreview } from '@/components/data-display/link-preview';
import { cn } from '@/utils/cn';
import { Message } from '../../../types';

export interface MessageItemLinksProps {
  message: Message;
  isMe?: boolean;
}

export const MessageItemLinks = ({
  message,
  isMe = false,
}: MessageItemLinksProps) => {
  const htmlContent = message.content;
  const [failedCount, setFailedCount] = useState(0);

  const links = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const anchors = doc.querySelectorAll('a');
    // return unique links
    const result = Array.from(anchors).reduce((acc: string[], anchor) => {
      const href = anchor.getAttribute('href');
      if (href && !acc.includes(href)) {
        acc.push(href);
      }
      return acc;
    }, []);
    return result.slice(0, 5); // limit to 5 links
  }, [htmlContent]);
  if (links.length === 0 || failedCount === links.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col space-y-1 border-primary px-1 pt-0.5',
        isMe ? 'items-end border-r-2' : 'items-start border-l-2',
      )}
    >
      {links.map((link, index) => (
        <LinkPreview
          onFailLoad={() => {
            setFailedCount((prev) => prev + 1);
          }}
          key={link}
          url={link as string}
        />
      ))}
    </div>
  );
};
