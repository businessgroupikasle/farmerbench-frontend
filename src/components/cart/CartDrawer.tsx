import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { useCart } from '../../hooks/useCart';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { QuantitySelector } from '../product/QuantitySelector';
import { Button } from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useCartStore();
  const { items, subtotal, totalItems, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={closeDrawer}
    >
      <div
        className="animate-slide-in-right"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--brand-primary)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Shopping Bag ({totalItems})
            </h3>
          </div>
          <button
            onClick={closeDrawer}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px', padding: 0 }}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body - Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                gap: '1rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShoppingBag size={48} style={{ strokeWidth: 1.5 }} />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Your bag is empty
                </p>
                <p style={{ fontSize: '0.875rem' }}>Explore our collection and find something you love.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  closeDrawer();
                  navigate('/catalog');
                }}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const product = item.product;
              const unitPrice = product.discountPrice ?? product.price;

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                    alt={product.title}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      backgroundColor: 'var(--bg-subtle)',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      onClick={closeDrawer}
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                        marginBottom: '0.3rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.title}
                    </Link>

                    <div style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      ${(unitPrice * item.quantity).toFixed(2)}
                      {item.quantity > 1 && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                          (${unitPrice.toFixed(2)} ea)
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <QuantitySelector
                        size="sm"
                        quantity={item.quantity}
                        onChange={(qty) => updateQuantity(item.id, item.productId, qty)}
                      />

                      <button
                        onClick={() => removeItem(item.id, item.productId)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          padding: '4px',
                        }}
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-elevated)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Subtotal</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
              Shipping and taxes calculated at checkout.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Button
                variant="gradient"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
                onClick={handleCheckout}
                style={{ width: '100%' }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleViewCart}
                style={{ width: '100%' }}
              >
                View Full Bag
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
