import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Share2, Copy, Check, Mail, Smartphone } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { getUploadUrl } from '../../utils/image';
import { formatPrice } from '../../utils/currency';
import './ProductShareModal.css';

interface ProductShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    slug?: string;
    price?: number;
    discountPrice?: number | null;
    images?: string[];
    category?: { name: string };
  } | null;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

export const ProductShareModal: React.FC<ProductShareModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToast } = useUIStore();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const shareUrl = `${window.location.origin}/product/${product.slug || product.id}`;
  const effectivePrice = product.discountPrice || product.price || 0;
  const shareTitle = product.title;
  const shareText = `Check out ${product.title} (${formatPrice(effectivePrice)}) on AgriEra!`;
  const primaryImage = getUploadUrl(product.images?.[0], FALLBACK_IMAGE);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      addToast({
        type: 'success',
        message: 'Product link copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to copy link. Please copy manually.',
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // WhatsApp share URL
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;

  // Facebook share URL
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  // Twitter / X share URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  // Telegram share URL
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  // Email share URL
  const emailUrl = `mailto:?subject=${encodeURIComponent(`AgriEra Product: ${product.title}`)}&body=${encodeURIComponent(`Hi,\n\nI found this agricultural product on AgriEra and wanted to share it with you:\n\n${product.title}\nPrice: ${formatPrice(effectivePrice)}\n\nView here: ${shareUrl}\n\nAgriEra - Grow Better, Live Better`)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 800 }}>
          <Share2 size={18} />
          <span style={{ fontSize: '1.025rem' }}>Share Product</span>
        </div>
      }
      maxWidth="400px"
    >
      <div className="agri-share-modal-content">
        {/* Product Preview Card */}
        <div className="agri-share-product-preview">
          <img
            src={primaryImage}
            alt={product.title}
            className="agri-share-product-img"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
          <div className="agri-share-product-info">
            {product.category && (
              <span className="agri-share-product-cat">{product.category.name}</span>
            )}
            <h4 className="agri-share-product-title" title={product.title}>
              {product.title}
            </h4>
            <span className="agri-share-product-price">
              {formatPrice(effectivePrice)}
            </span>
          </div>
        </div>

        {/* Social Share Options */}
        <div>
          <div className="agri-share-section-title">Share via Social Media</div>
          <div className="agri-share-buttons-grid">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="agri-share-btn whatsapp"
              title="Share on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="agri-share-btn facebook"
              title="Share on Facebook"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="agri-share-btn twitter"
              title="Share on X (Twitter)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="agri-share-btn telegram"
              title="Share on Telegram"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              <span>Telegram</span>
            </a>

            {/* Email */}
            <a
              href={emailUrl}
              className="agri-share-btn email"
              title="Share via Email"
            >
              <Mail size={16} />
              <span>Email</span>
            </a>

            {/* Device / Native Web Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="agri-share-btn device"
                title="More sharing options"
              >
                <Smartphone size={16} />
                <span>More...</span>
              </button>
            )}
          </div>
        </div>

        {/* Copy Link Section */}
        <div>
          <div className="agri-share-section-title">Copy Link</div>
          <div className="agri-share-copy-box">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="agri-share-copy-input"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`agri-share-copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductShareModal;
