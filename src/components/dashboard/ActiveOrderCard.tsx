import React from 'react';
import { ArrowRight, Check, Truck, Download, Eye } from 'lucide-react';
import { Order } from '@formerbench/shared';
import growthBoosterImg from '../../assets/growth-booster.jpg';
import neemOilImg from '../../assets/neem-oil-bottle.jpg';

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
  // If real active order exists, format dynamic fields
  const orderId = activeOrder
    ? `#GL-${activeOrder.id.slice(0, 5).toUpperCase()}`
    : '#GL-10482';

  const placedDate = activeOrder
    ? new Date(activeOrder.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '28 Aug 2026';

  const orderStatus = activeOrder?.orderStatus || 'SHIPPED';
  const totalPrice = activeOrder?.totalPrice ?? 1480;
  const paymentMethod = activeOrder?.paymentMethod ? 'Paid Online' : 'Paid Online';

  // Items preview
  const displayItems = activeOrder?.items && activeOrder.items.length > 0
    ? activeOrder.items
    : [
        {
          id: 'item-1',
          title: 'Growth Booster for All Crops',
          quantity: 2,
          imageUrl: growthBoosterImg,
        },
        {
          id: 'item-2',
          title: 'Neem Oil 100% Cold Pressed',
          quantity: 1,
          imageUrl: neemOilImg,
        },
      ];

  // Map tracking steps
  const getStepStatus = (stepIndex: number) => {
    // 0: Confirmed, 1: Packed/Processing, 2: Shipped, 3: Delivered
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
        <span className="fb-status-pill-blue">{orderStatus}</span>
        <div className="fb-expected-delivery">
          Expected by <strong>Monday, 31 Aug</strong>
        </div>
      </div>

      {/* Products and Total */}
      <div className="fb-order-preview-row">
        <div className="fb-order-items-list">
          {displayItems.slice(0, 2).map((item, idx) => (
            <div key={item.id || idx} className="fb-order-item-thumb">
              <img
                src={item.imageUrl || (idx === 0 ? growthBoosterImg : neemOilImg)}
                alt={item.title}
                className="fb-order-item-img"
              />
              <div className="fb-order-item-details">
                <span className="fb-order-item-name">{item.title}</span>
                <span className="fb-order-item-qty">x {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fb-order-total-block">
          <div className="fb-order-total-label">Order Total</div>
          <div className="fb-order-total-amount">₹{totalPrice.toLocaleString()}</div>
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
            <span className="fb-stepper-sub">28 Aug</span>
          </div>

          {/* Step 2: Packed */}
          <div className="fb-stepper-node">
            <div className={`fb-stepper-dot ${getStepStatus(1) === 'completed' ? 'completed' : 'active'}`}>
              <Check size={14} strokeWidth={3} />
            </div>
            <span className="fb-stepper-title">Packed</span>
            <span className="fb-stepper-sub">28 Aug</span>
          </div>

          {/* Step 3: Shipped */}
          <div className="fb-stepper-node">
            <div className={`fb-stepper-dot ${getStepStatus(2) === 'active-blue' ? 'current-blue' : getStepStatus(2) === 'completed' ? 'completed' : ''}`}>
              <Truck size={14} />
            </div>
            <span className="fb-stepper-title">Shipped</span>
            <span className="fb-stepper-sub">28 Aug</span>
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
          Dispatched from Coimbatore Warehouse
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
