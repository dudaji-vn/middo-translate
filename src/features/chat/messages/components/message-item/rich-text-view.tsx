'use client';
import '@/components/tiptap/styles.css';
import './styles/rich-text-view.styles.css';

import DOMPurify from 'dompurify';
import { memo, useEffect, useState } from 'react';
import { MentionSuggestion } from '../message-editor/mention-suggestion-options';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { CookingPot } from 'lucide-react';

type RichTextViewProps = {
  content: string;
  editorStyle?: string;
  mentions?: MentionSuggestion[];
  keyword?: string;
};

const processContent = (
  content: string,
  mentions?: MentionSuggestion[],
  userId?: string,
  keyword?: string,
): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const mentionElements = doc.querySelectorAll('.mention[data-id]');
  // Update mention labels
  if (mentions && mentions.length !== 0) {
    mentionElements.forEach((mentionElement) => {
      const mentionId = mentionElement.getAttribute('data-id');
      const mention = mentions.find((m) => m.id === mentionId);
      if (mention) {
        mentionElement.setAttribute('data-label', mention.label);
        mentionElement.textContent = `@${mention.label}`;
        if (userId === mentionId) {
          mentionElement.classList.add('me');
        }
      }
    });
  }

  // Process empty <p> tags
  const paragraphs = Array.from(doc.querySelectorAll('p'));

  // Remove leading empty <p> tags
  while (paragraphs.length > 0 && paragraphs[0]?.textContent?.trim() === '') {
    paragraphs?.shift()?.remove();
  }

  // Remove trailing empty <p> tags
  while (
    paragraphs.length > 0 &&
    paragraphs[paragraphs.length - 1]?.textContent?.trim() === ''
  ) {
    paragraphs?.pop()?.remove();
  }

  // Replace other empty <p> tags with <br>
  paragraphs.forEach((p) => {
    if (p.textContent?.trim() === '') {
      p.innerHTML = '<br>';
    }
  });

  // process links
  const links = Array.from(doc.querySelectorAll('a'));
  links.forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // Highlight keyword
  if (keyword) {
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');

    const highlightTextNodes = (node: any) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(
          regex,
          '<span class="content-highlight">$1</span>',
        );
        node.replaceWith(...Array.from(span.childNodes));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.childNodes.forEach((child: any) => highlightTextNodes(child));
      }
    };

    highlightTextNodes(doc.body);
  }

  return doc.body.innerHTML;
};

const RichTextView = ({
  content,
  editorStyle = '',
  mentions,
  keyword,
}: RichTextViewProps) => {
  const userId = useAuthStore((state) => state.user?._id);
  const [sanitizedHtml, setSanitizedHtml] = useState(
    DOMPurify.sanitize(content),
  );

  useEffect(() => {
    const updatedContent = processContent(content, mentions, userId, keyword);
    const sanitizedContent = DOMPurify.sanitize(updatedContent, {
      ALLOWED_ATTR: ['data-id', 'data-label', 'class', 'href', 'target', 'rel'],
    });
    setSanitizedHtml(sanitizedContent);
  }, [content, keyword, mentions, userId]);

  console.log(sanitizedHtml);

  return (
    <div
      className={cn('editor-view rich-text-view tiptap prose', editorStyle)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

const MemoRichTextView = memo(RichTextView);
export { MemoRichTextView as RichTextView };
