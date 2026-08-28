import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useOrderMutations } from '../hooks/useOrders';
import { useUIStore } from '../store/uiStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ShippingAddress, PaymentMethod } from '@formerbench/shared';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { openAuthModal } = useUIStore();
  const { createOrder, isCreatingOrder } = useOrderMutations();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');

  // Credit Card Mock Inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const shippingPrice = subtotal >= 100 ? 0 : 15;
  const taxPrice = Number((subtotal * 0.08).toFixed(2));
  const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    try {
      const order = await createOrder({
        shippingAddress,
        paymentMethod,
      });

      if (order?.data?.id) {
        navigate(`/order-confirmation/${order.data.id}`);
      }
    } catch (err) {
      // Error handled by hook toast
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Checkout Steps Progress */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: step >= 1 ? 'var(--brand-primary)' : 'var(--bg-subtle)',
              color: step >= 1 ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            1
          </div>
          <span style={{ fontWeight: step === 1 ? 700 : 500, fontSize: '0.9rem' }}>Shipping</span>
        </div>

        <div style={{ width: '40px', height: '2px', backgroundColor: step >= 2 ? 'var(--brand-primary)' : 'var(--border-color)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: step >= 2 ? 'var(--brand-primary)' : 'var(--bg-subtle)',
              color: step >= 2 ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            2
          </div>
          <span style={{ fontWeight: step === 2 ? 700 : 500, fontSize: '0.9rem' }}>Payment</span>
        </div>

        <div style={{ width: '40px', height: '2px', backgroundColor: step === 3 ? 'var(--brand-primary)' : 'var(--border-color)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: step === 3 ? 'var(--brand-primary)' : 'var(--bg-subtle)',
              color: step === 3 ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            3
          </div>
          <span style={{ fontWeight: step === 3 ? 700 : 500, fontSize: '0.9rem' }}>Review & Place</span>
        </div>
      </div>

      {/* Guest Warning / Login Suggestion */}
      {!isAuthenticated && (
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--brand-primary-light)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.925rem' }}>
              Already have an account?
            </p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Sign in to use your saved shipping addresses and track real-time fulfillment.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => openAuthModal('login')}>
            Sign In
          </Button>
        </div>
      )}

      {/* Step Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Form Column */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Truck size={20} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Shipping Address</h2>
              </div>

              <Input
                label="Recipient Full Name"
                placeholder="Sarah Jenkins"
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                required
              />

              <Input
                label="Street Address"
                placeholder="742 Evergreen Terrace, Apt 4B"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="City"
                  placeholder="San Francisco"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                />
                <Input
                  label="State / Province"
                  placeholder="CA"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                  label="Postal / ZIP Code"
                  placeholder="94107"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" variant="gradient" size="lg" style={{ marginTop: '0.5rem' }}>
                Continue to Payment
              </Button>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} style={{ color: 'var(--brand-primary)' }} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Select Payment Method</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Methods Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'PAYPAL', label: 'PayPal Instant Express', icon: ShieldCheck },
                  { id: 'STRIPE', label: 'Stripe Pay (Apple Pay / Google Pay)', icon: Lock },
                  { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: Truck },
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--brand-primary-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method.id as PaymentMethod)}
                        style={{ accentColor: 'var(--brand-primary)' }}
                      />
                      <Icon size={18} style={{ color: 'var(--brand-primary)' }} />
                      <span style={{ fontWeight: 600, fontSize: '0.925rem' }}>{method.label}</span>
                    </label>
                  );
                })}
              </div>

              {/* Simulated Card Fields if Credit Card is selected */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <Input
                    label="Card Number (Demo)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    leftElement={<CreditCard size={16} />}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                      label="Expires"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                    <Input
                      label="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button type="submit" variant="gradient" size="lg" style={{ flex: 1 }}>
                  Review Order
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Review & Place Order */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Review & Confirmation</h2>
              </div>

              {/* Shipping Review Box */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>DELIVERY DESTINATION</span>
                  <button
                    onClick={() => setStep(1)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Change
                  </button>
                </div>
                <p style={{ fontWeight: 700 }}>{shippingAddress.fullName}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Phone: {shippingAddress.phone}</p>
              </div>

              {/* Payment Review Box */}
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PAYMENT METHOD</span>
                  <button
                    onClick={() => setStep(2)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    Change
                  </button>
                </div>
                <p style={{ fontWeight: 700 }}>{paymentMethod.replace(/_/g, ' ')}</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button
                  type="button"
                  variant="gradient"
                  size="lg"
                  isLoading={isCreatingOrder}
                  onClick={handlePlaceOrder}
                  style={{ flex: 1 }}
                >
                  Authorize & Place Order (${totalPrice.toFixed(2)})
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Order Items ({items.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto' }}>
            {items.map((item) => {
              const product = item.product;
              const unitPrice = product.discountPrice ?? product.price;

              return (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img
                    src={product.images[0]}
                    alt=""
                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title}
                    </p>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    ${(unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span style={{ fontWeight: 600 }}>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (8%)</span>
              <span style={{ fontWeight: 600 }}>${taxPrice.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem',
                fontSize: '1.15rem',
                fontWeight: 800,
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--brand-primary)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
