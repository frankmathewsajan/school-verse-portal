import React from 'react';

/**
 * Utility function to detect and parse URLs in text
 */
// Helper: returns true if urlStr is a valid http/https URL, false otherwise.
const isSafeHttpUrl = (urlStr: string): boolean => {
  try {
    const url = new URL(urlStr, 'https://example.com');
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const parseTextWithLinks = (text: string): React.ReactNode[] => {
  // Regex to match URLs (http, https, www, or naked domains)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi;
  
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (urlRegex.test(part)) {
      let href = part;
      
      // Add protocol if missing
      if (!part.startsWith('http://') && !part.startsWith('https://')) {
        href = 'https://' + part;
      }
      // Only render link if url is valid and protocol is safe (http/https)
      const sanitizedHref = sanitizeUrl(href);
      if (sanitizedHref) {
        return (
          <a
            key={index}
            href={sanitizedHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {part}
          </a>
        );
      } else {
        // Unsafe protocol or invalid URL, render as plain text
        return part;
      }
    }
    
    return part;
  });
};

/**
 * Component to render text with clickable links
 */
interface TextWithLinksProps {
  text: string;
  className?: string;
}

export const TextWithLinks: React.FC<TextWithLinksProps> = ({ text, className = '' }) => {
  const parsedContent = parseTextWithLinks(text);
  
  return (
    <span className={`break-words ${className}`}>
      {parsedContent}
    </span>
  );
};

/**
 * Component to render announcement content with proper wrapping and clickable links
 */
interface AnnouncementContentProps {
  content: string;
  className?: string;
  maxLines?: number;
}

export const AnnouncementContent: React.FC<AnnouncementContentProps> = ({ 
  content, 
  className = '',
  maxLines 
}) => {
  const baseClasses = "break-words whitespace-pre-wrap";
  const lineClampClass = maxLines ? `line-clamp-${maxLines}` : '';
  const finalClassName = `${baseClasses} ${lineClampClass} ${className}`.trim();
  
  return (
    <div className={finalClassName}>
      <TextWithLinks text={content} />
    </div>
  );
};
