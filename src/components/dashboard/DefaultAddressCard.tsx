import React from 'react';
import { MapPin } from 'lucide-react';
import { User, ShippingAddress } from '@formerbench/shared';

interface DefaultAddressCardProps {
  user: User | null;
  shippingAddress?: ShippingAddress | null;
  onManageAddresses: () => void;
}

export const DefaultAddressCard: React.FC<DefaultAddressCardProps> = ({
  user,
  shippingAddress,
  onManageAddresses,
}) => {
  const recipientName = shippingAddress?.fullName || user?.name || 'Ramanathan';
  const street = shippingAddress?.street || '123, Green Fields';
  const city = shippingAddress?.city || 'Thanjavur';
  const state = shippingAddress?.state || 'Tamil Nadu';
  const postalCode = shippingAddress?.postalCode || '613001';
  const phone = shippingAddress?.phone || user?.phone || '+91 98765 43210';

  const fullAddress = `${street}, ${city}, ${state} - ${postalCode}`;

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">
          <MapPin size={18} color="#0F4726" />
          Default Delivery Address
        </h3>
      </div>

      <div className="fb-address-card-content">
        <div className="fb-address-name">{recipientName}</div>
        <p className="fb-address-text">{fullAddress}</p>
        <div className="fb-address-phone">{phone}</div>

        <div style={{ marginTop: '0.5rem' }}>
          <button className="fb-btn-outline" onClick={onManageAddresses}>
            Manage Addresses
          </button>
        </div>
      </div>
    </div>
  );
};
