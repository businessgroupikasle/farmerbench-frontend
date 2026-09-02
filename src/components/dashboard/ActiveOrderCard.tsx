import React from 'react';
import { ArrowRight, Check, Truck, Download, Eye, Package, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@formerbench/shared';

interface ActiveOrderCardProps {
  activeOrder?: Order | null;
  onViewAllOrders: () => void;
  onTrackOrder: (order?: Order | null) => void;
  onViewDetails: (order?: Order | null) => void;
  onDownloadInvoice: (order?: Order | null) => void;
}

export const ActiveOrderCard: React.FC<ActiveOrderCardProps> = ({
  activeOrder,
  onViewAllOrders,
  onTrackOrder,
  onViewDetails,
  onDownloadInvoice,
}) => {
  const navigate = useNavigate();

  if (!activeOrder) {
    return (
      <div className="fb-card fb-active-order-card">
        <div className="fb-card-header">
          <h2 className="fb-card-title">Your Active Order</h2>
          <a
            className="fb-card-link"
            onClick={(e) => {
              e.preventDefault();
              onViewAllOrders();
            }}
          >
            View All Orders <ArrowRight size={14} />
          </a>
        </div>

        <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--fb-green-50)',
              color: 'var(--fb-green-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <Package size={22} />
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fb-text-dark)' }}>
            No Active Orders Found
          </h4>
          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--fb-text-muted)',
              marginTop: '0.25rem',
              maxWidth: '380px',
              margin: '0.25rem auto 1.25rem auto',
            }}
          >
            When you purchase agri-inputs or equipment, live step-by-step dispatch tracking and invoices will be displayed here.
          </p>
          <button
            className="fb-btn-primary-dark"
            onClick={() => navigate('/products')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
          >
            <ShoppingBag size={14} /> Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  const orderId = `#GL-${activeOrder.id.slice(0, 8).toUpperCase()}`;
  const placedDate = new Date(activeOrder.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const orderStatus = activeOrder.orderStatus;
  const totalPrice = activeOrder.totalPrice;
  const paymentMethod = activeOrder.paymentStatus === 'PAID' ? 'Paid Online' : activeOrder.paymentMethod || 'Paid Online';
  const items = activeOrder.items || [];

  // Map tracking steps
  const getStepStatus = (stepIndex: number) => {
    if (orderStatus === 'DELIVERED') return 'completed';
    if (orderStatus === 'SHIPPED') {
      if (stepIndex < 2) return 'completed';
      if (stepIndex === 2) return 'active-blue';
      return 'pending';
    }
    if (orderStatus === 'PROCESSING') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'active-blue';
      return 'pending';
    }
    // PENDING
    if (stepIndex === 0) return 'active-blue';
    return 'pending';
  };

  const getProgressWidth = () => {
    if (orderStatus === 'DELIVERED') return '100%';
    if (orderStatus === 'SHIPPED') return '66%';
    if (orderStatus === 'PROCESSING') return '33%';
    return '0%';
  };

  return (
    <div className="fb-card fb-active-order-card">
      <div className="fb-card-header">
        <h2 className="fb-card-title">Your Active Order</h2>
        <a
          className="fb-card-link"
          onClick={(e) => {
            e.preventDefault();
            onViewAllOrders();
          }}
        >
          View All Orders <ArrowRight size={14} />
        </a>
      </div>

      {/* Meta Row */}
      <div className="fb-active-order-meta">
        <div>
          <span className="fb-order-id-badge">Order {orderId}</span>
          <span className="fb-order-date">Placed on {placedDate}</span>
        </div>
        <span className={orderStatus === 'DELIVERED' ? 'fb-status-pill-green' : 'fb-status-pill-blue'}>
          {orderStatus}
        </span>
        <div className="fb-expected-delivery">
          Status: <strong>{orderStatus}</strong>
        </div>
      </div>

      {/* Products and Total */}
      <div className="fb-order-preview-row">
        <div className="fb-order-items-list">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="fb-order-item-thumb">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="fb-order-item-img" />
              ) : (
                <div
                  className="fb-order-item-img"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}
                >
                  <Package size={16} />
                </div>
              )}
              <div className="fb-order-item-details">
                <span className="fb-order-item-name">{item.title}</span>
                <span className="fb-order-item-qty">x {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fb-order-total-block">
          <div className="fb-order-total-label">Order Total</div>
          <div className="fb-order-total-amount">₹{totalPrice.toFixed(2)}</div>
          <div className="fb-order-paid-status">{paymentMethod}</div>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="fb-stepper-wrap">
        <div className="fb-stepper-track">
          <div className="fb-stepper-progress-bg" />
          <div
            className="fb-stepper-progress-fill"
            style={{ width: getProgressWidth() }}
          />

          {/* Step 1: Confirmed */}
          <div className="fb-stepper-node">
            <div className={`fb-stepper-dot ${getStepStatus(0) === 'completed' ? 'completed' : 'active'}`}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="fb-stepper-title">Order Confirmed</span>
            <span className="fb-stepper-sub">{placedDate}</span>
          </div>

          {/* Step 2: Packed */}
          <div className="fb-stepper-node">
            <div className={`fb-stepper-dot ${getStepStatus(1) === 'completed' ? 'completed' : getStepStatus(1) === 'active-blue' ? 'current-blue' : ''}`}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="fb-stepper-title">Packed</span>
            <span className="fb-stepper-sub">{orderStatus === 'PENDING' ? 'Pending' : 'Completed'}</span>
          </div>

          {/* Step 3: Shipped */}
          <div className="fb-stepper-node">
            <div className={`fb-stepper-dot ${getStepStatus(2) === 'active-blue' ? 'current-blue' : getStepStatus(2) === 'completed' ? 'completed' : ''}`}>
              <Truck size={14} />
            </div>
            <span className="fb-stepper-title">Shipped</span>
            <span className="fb-stepper-sub">{orderStatus === 'SHIPPED' || orderStatus === 'DELIVERED' ? 'In Transit' : 'Pending'}</span>
          </div>

          {/* Step 4: Delivered */}
          <div className="fb-stepper-node">
            <div className={`fb-stepper-dot ${getStepStatus(3) === 'completed' ? 'completed' : ''}`}>
              <Check size={14} />
            </div>
            <span className="fb-stepper-title">Delivered</span>
            <span className="fb-stepper-sub">{orderStatus === 'DELIVERED' ? 'Completed' : 'Pending'}</span>
          </div>
        </div>

        <div className="fb-warehouse-note">
          Dispatched from Fulfillment Center
        </div>
      </div>

      {/* Action Footer */}
      <div className="fb-order-actions-bar">
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            className="fb-btn-primary-dark"
            onClick={() => onTrackOrder(activeOrder)}
          >
            <Truck size={15} /> Track Order
          </button>
          <button
            className="fb-btn-outline"
            onClick={() => onViewDetails(activeOrder)}
          >
            <Eye size={15} /> View Details
          </button>
        </div>

        <a
          className="fb-download-invoice-link"
          onClick={(e) => {
            e.preventDefault();
            onDownloadInvoice(activeOrder);
          }}
        >
          <Download size={15} /> Download Invoice
        </a>
      </div>
    </div>
  );
};
