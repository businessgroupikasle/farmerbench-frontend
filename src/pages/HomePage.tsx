import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useFeaturedProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const { data: featuredProducts = [], isLoading: isFeaturedLoading } = useFeaturedProducts(8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(236, 72, 153, 0.08) 100%)',
          border: '1px solid var(--border-color)',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--brand-primary)',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Sparkles size={15} /> 2026 High-Performance Collection
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: '850px',
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em',
          }}
        >
          Engineered for Perfection.{' '}
          <span
            style={{
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Curated for You.
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          Discover cutting-edge audio gear, titanium wearables, minimalist computing, and artisanal home essentials crafted without compromise.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="gradient"
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/catalog')}
          >
            Explore Collection
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/catalog?featured=true')}
          >
            View Featured Drops
          </Button>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--brand-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Browse By Department
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Explore Categories</h2>
          </div>
          <Link
            to="/catalog"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.5rem 1rem',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  backgroundColor: 'var(--bg-subtle)',
                }}
              >
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.3rem' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {cat._count?.products ? `${cat._count.products} items` : 'Explore catalog'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--brand-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Staff Picks & Bestsellers
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Products</h2>
          </div>
          <Link
            to="/catalog"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            See Full Store <ArrowRight size={16} />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} isLoading={isFeaturedLoading} />
      </section>

      {/* Promotional Banner */}
      <section
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)',
          color: '#ffffff',
          padding: '3rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '2rem',
          border: 'none',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            LIMITED DROP
          </span>
          <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Dolby Atmos Spatial Audio Experience
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Elevate your home cinema and studio mastering with 450W peak room-calibrated soundbars.
          </p>
          <Button
            variant="gradient"
            size="md"
            onClick={() => navigate('/catalog?category=audio-acoustics')}
          >
            Discover Audio Gear
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80"
            alt="Spatial Soundbar"
            style={{
              maxHeight: '260px',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </section>
    </div>
  );
};
