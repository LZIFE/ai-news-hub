'use client';

import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

export default function SanitizedHTML({ html, className }: SanitizedHTMLProps) {
  const [clean, setClean] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClean(DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'pre', 'code', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'width', 'height', 'loading', 'data-src', 'data-original', 'referrerpolicy', 'decoding'],
    }));
  }, [html]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ac = new AbortController();
    const imgs = containerRef.current.querySelectorAll('img');
    imgs.forEach((img) => {
      if (!img.getAttribute('src') || img.getAttribute('src') === '') {
        const dataSrc = img.getAttribute('data-src') || img.getAttribute('data-original');
        if (dataSrc) {
          img.setAttribute('src', dataSrc);
        }
      }
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '0.5rem';
      img.style.margin = '1.5rem 0';
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      img.addEventListener('error', () => { img.style.display = 'none'; }, { signal: ac.signal });
      img.addEventListener('load', () => {
        if (!img.hasAttribute('width')) {
          img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
        }
      }, { signal: ac.signal });
    });
    return () => ac.abort();
  }, [clean]);

  if (!clean) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
