import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

export const CartPage: React.FC = () => {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const shippingPrice = subtotal >= 100 ? 0 : 15;
  const taxPrice = Number((subtotal * 0.08).toFixed(2));
  const totalPrice = Number((subtotal + shippingPrice + taxPrice - promoDiscount).toFixed(2));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FORMER20') {
      const discount = Number((subtotal * 0.2).toFixed(2));
      setPromoDiscount(discount);
      addToast({ type: 'success', message: 'Promo code FORMER20 applied: 20% discount!' });
    } else {
      addToast({ type: 'error', message: 'Invalid promo code. Try "FORMER20" for 20% off!' });
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your Shopping Bag is Empty"
        description="You have not added any items to your bag yet. Explore our curated catalog to begin."
        actionText="Browse Catalog"
        onAction={() => navigate('/catalog')}
        icon={<ShoppingBag size={32} />}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Shopping Bag</h1>
        <button
          onClick={clearCart}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Trash2 size={15} /> Clear All
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Items List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
          {items.map((item) => {
            const product = item.product;
            const unitPrice = product.discountPrice ?? product.price;

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                  alt={product.title}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    backgroundColor: 'var(--bg-subtle)',
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                        marginBottom: '0.35rem',
                        maxWidth: '85%',
                      }}
                    >
                      {product.title}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id, item.productId)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    ${(unitPrice * item.quantity).toFixed(2)}
                    {item.quantity > 1 && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        (${unitPrice.toFixed(2)} ea)
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <QuantitySelector
                      size="sm"
                      quantity={item.quantity}
                      onChange={(q) => updateQuantity(item.id, item.productId, q)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/catalog"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--brand-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            ← Continue Browsing
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
          {/* Promo Code Form */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Promo code (try FORMER20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Apply
              </Button>
            </form>
          </div>

          {/* Totals Breakdown */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Shipping</span>
                <span style={{ fontWeight: 600 }}>
                  {shippingPrice === 0 ? <span style={{ color: 'var(--color-success)' }}>FREE</span> : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sales Tax (8%)</span>
                <span style={{ fontWeight: 600 }}>${taxPrice.toFixed(2)}</span>
              </div>

              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Tag size={14} /> Discount
                  </span>
                  <span style={{ fontWeight: 600 }}>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.85rem',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                }}
              >
                <span>Estimated Total</span>
                <span style={{ color: 'var(--brand-primary)' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="gradient"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={() => navigate('/checkout')}
              style={{ width: '100%' }}
            >
              Proceed to Checkout
            </Button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={16} /> 256-Bit Encrypted Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
