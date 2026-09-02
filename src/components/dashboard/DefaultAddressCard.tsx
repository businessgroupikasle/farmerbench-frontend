import React from 'react';
import { MapPin, Plus } from 'lucide-react';
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
  const recipientName = shippingAddress?.fullName || user?.name;
  const location = user?.location;
  const phone = shippingAddress?.phone || user?.phone;

  const hasAddress = !!shippingAddress || !!location;

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">
          <MapPin size={18} color="#0F4726" />
          Default Delivery Address
        </h3>
      </div>

      <div className="fb-address-card-content">
        {hasAddress ? (
          <>
            <div className="fb-address-name">{recipientName}</div>
            <p className="fb-address-text">
              {shippingAddress
                ? `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}`
                : location}
            </p>
            {phone && <div className="fb-address-phone">{phone}</div>}

            <div style={{ marginTop: '0.5rem' }}>
              <button className="fb-btn-outline" onClick={onManageAddresses}>
                Manage Addresses
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ fontSize: '0.825rem', color: 'var(--fb-text-muted)', marginBottom: '0.75rem' }}>
              No primary farm or delivery address added yet.
            </p>
            <button className="fb-btn-outline" onClick={onManageAddresses} style={{ fontSize: '0.825rem' }}>
              <Plus size={14} /> Add Delivery Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
