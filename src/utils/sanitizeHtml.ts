import DOMPurify from 'dompurify';

/**
 * Sanitizes rich-text HTML (blog articles) before it is rendered with
 * dangerouslySetInnerHTML. Normal formatting (headings, lists, tables, images, links)
 * is preserved; scripts, event handlers, javascript: URLs and other active content are
 * removed. Embedded videos are allowed only from YouTube / Vimeo.
 */
const ALLOWED_IFRAME_SRC = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

let hooksInstalled = false;

const installHooks = () => {
  if (hooksInstalled) return;
  hooksInstalled = true;

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
      const src = (node as Element).getAttribute?.('src') || '';
      if (!ALLOWED_IFRAME_SRC.test(src)) {
        node.parentNode?.removeChild(node);
      }
    }
  });

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Links opening a new tab must not get access to window.opener
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

export const sanitizeHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  installHooks();
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder', 'loading'],
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'object', 'embed'],
  });
};
