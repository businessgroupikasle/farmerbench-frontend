import React from 'react';
import { Headset, Phone, MessageSquare } from 'lucide-react';

interface NeedHelpCardProps {
  onContactSupport: () => void;
}

export const NeedHelpCard: React.FC<NeedHelpCardProps> = ({ onContactSupport }) => {
  return (
    <div className="fb-help-card">
      <div className="fb-help-header">
        <Headset size={20} color="#0F4726" />
        <span>Need Help?</span>
      </div>

      <p className="fb-help-desc">
        We're here to help you with your orders and farming needs.
      </p>

      <div className="fb-help-contacts">
        <div className="fb-help-phone">
          <Phone size={15} color="#0F4726" />
          <span>+91 98765 43210</span>
        </div>

        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="fb-whatsapp-link"
        >
          <MessageSquare size={15} color="#16a34a" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      <div style={{ marginTop: '0.4rem' }}>
        <button className="fb-btn-outline" style={{ width: '100%' }} onClick={onContactSupport}>
          Contact Support
        </button>
      </div>
    </div>
  );
};
