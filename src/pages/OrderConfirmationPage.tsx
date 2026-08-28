import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Retrieving order receipt..." />;
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          We could not locate the details for this order.
        </p>
        <Link to="/catalog">
          <Button variant="primary">Return to Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle size={36} />
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Thank You For Your Order!</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
          Your payment was processed successfully. We are preparing your items for express insured dispatch.
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order ID:</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>{order.id}</span>
          <Badge variant="success">{order.orderStatus}</Badge>
        </div>
      </div>

      {/* Fulfillment Status Timeline */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Fulfillment Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={16} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Order Placed</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confirmed</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={16} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>Processing</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Warehouse</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={16} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Shipped</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated: 2-3 Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details & Summary */}
      <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Items in this Order</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt=""
                    style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                )}
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</p>
                </div>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', marginLeft: 'auto', width: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal:</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Shipping:</span>
            <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tax:</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '1.15rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '0.5rem',
            }}
          >
            <span>Total Paid:</span>
            <span style={{ color: 'var(--brand-primary)' }}>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <Link to="/dashboard?tab=orders">
            <Button variant="secondary" size="md">
              View All Orders
            </Button>
          </Link>
          <Link to="/catalog">
            <Button variant="gradient" size="md" rightIcon={<ArrowRight size={16} />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
