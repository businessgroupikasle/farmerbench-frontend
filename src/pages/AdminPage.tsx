import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminStats, useAdminMutations } from '../hooks/useAdmin';
import { useProducts, useProductMutations } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useAdminOrders, useOrderMutations } from '../hooks/useOrders';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  ShieldAlert,
  BarChart3,
  Layers,
} from 'lucide-react';
import { OrderStatus, CreateProductInput } from '@formerbench/shared';

export const AdminPage: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory'>('analytics');

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useAdminStats();
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ limit: 50 });
  const { data: categories = [] } = useCategories();
  const { data: ordersData, isLoading: isOrdersLoading } = useAdminOrders({ limit: 50 });

  // Mutations
  const { updateInventoryStock } = useAdminMutations();
  const { createProduct, updateProduct, deleteProduct, isCreating, isUpdating } = useProductMutations();
  const { updateOrderStatus } = useOrderMutations();

  // Product CRUD Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<{
    title: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    stock: number;
    categoryId: string;
    images: string;
    featured: boolean;
  }>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    discountPrice: null,
    stock: 10,
    categoryId: '',
    images: '',
    featured: false,
  });

  // Quick Stock state
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <ShieldAlert size={48} style={{ color: 'var(--color-danger)', margin: '0 auto 1rem' }} />
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You must be an administrator to view this portal.</p>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      slug: '',
      description: '',
      price: 0,
      discountPrice: null,
      stock: 10,
      categoryId: categories[0]?.id || '',
      images: '',
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice,
      stock: prod.stock,
      categoryId: prod.categoryId,
      images: prod.images.join(', '),
      featured: prod.featured,
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArray = productForm.images
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreateProductInput = {
      title: productForm.title,
      slug: productForm.slug.toLowerCase().replace(/\s+/g, '-'),
      description: productForm.description,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      stock: Number(productForm.stock),
      categoryId: productForm.categoryId,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      featured: productForm.featured,
    };

    if (editingProductId) {
      await updateProduct({ id: editingProductId, data: payload });
    } else {
      await createProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  const handleSaveStock = async (productId: string) => {
    const newStock = stockEdits[productId];
    if (newStock !== undefined) {
      await updateInventoryStock({ productId, stock: newStock });
      const next = { ...stockEdits };
      delete next[productId];
      setStockEdits(next);
    }
  };

  const productsList = productsData?.data || [];
  const ordersList = ordersData?.orders || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
              Management Console
            </span>
            <Badge variant="primary">Admin</Badge>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Store Administration</h1>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {(['analytics', 'products', 'orders', 'inventory'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                border: 'none',
                textTransform: 'capitalize',
                background: activeTab === tab ? 'var(--brand-primary)' : 'transparent',
                fontWeight: activeTab === tab ? 700 : 500,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {isStatsLoading ? (
            <LoadingSpinner message="Calculating store analytics..." />
          ) : stats ? (
            <>
              {/* Metric Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL REVENUE</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>${stats.totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Package size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ORDERS</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalOrders}</h3>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-info-bg)',
                      color: 'var(--color-info)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Layers size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE PRODUCTS</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalProducts}</h3>
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-warning-bg)',
                      color: 'var(--color-warning)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>REGISTERED CLIENTS</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalCustomers}</h3>
                  </div>
                </div>
              </div>

              {/* Monthly Sales Visualization */}
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <BarChart3 size={20} style={{ color: 'var(--brand-primary)' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Monthly Revenue Distribution</h3>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '1rem',
                    height: '220px',
                    paddingTop: '2rem',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  {stats.monthlySales.map((month) => {
                    const maxSales = Math.max(...stats.monthlySales.map((m) => m.sales), 100);
                    const heightPercent = (month.sales / maxSales) * 100;

                    return (
                      <div
                        key={month.month}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'flex-end',
                          gap: '0.5rem',
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          ${month.sales > 0 ? month.sales.toFixed(0) : '0'}
                        </span>
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '40px',
                            height: `${Math.max(heightPercent, 6)}%`,
                            borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                            background: month.sales > 0 ? 'var(--brand-gradient)' : 'var(--bg-subtle)',
                            transition: 'height 0.4s ease',
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{month.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Low Stock Warning */}
              {stats.lowStockProducts.length > 0 && (
                <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--color-warning)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Low Stock Alert</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-subtle)',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</span>
                        <Badge variant="warning">{p.stock} in stock</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* 2. PRODUCTS CRUD TAB */}
      {activeTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Catalog Inventory ({productsList.length})</h2>
            <Button variant="gradient" size="sm" leftIcon={<Plus size={16} />} onClick={handleOpenCreateModal}>
              Create New Product
            </Button>
          </div>

          {isProductsLoading ? (
            <LoadingSpinner message="Loading catalog..." />
          ) : (
            <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Product</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Price</th>
                    <th style={{ padding: '1rem' }}>Stock</th>
                    <th style={{ padding: '1rem' }}>Featured</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt=""
                          style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{prod.title}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {prod.category?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                        ${prod.price.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={prod.stock <= 5 ? 'warning' : 'neutral'}>{prod.stock}</Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {prod.featured ? <Badge variant="primary">Yes</Badge> : <span style={{ color: 'var(--text-muted)' }}>No</span>}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${prod.title}"?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="btn btn-secondary btn-icon"
                            style={{ width: '32px', height: '32px', padding: 0, color: 'var(--color-danger)' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Customer Orders ({ordersList.length})</h2>

          {isOrdersLoading ? (
            <LoadingSpinner message="Loading orders..." />
          ) : (
            <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Order ID</th>
                    <th style={{ padding: '1rem' }}>Customer</th>
                    <th style={{ padding: '1rem' }}>Items</th>
                    <th style={{ padding: '1rem' }}>Total</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700 }}>
                        #{ord.id.slice(0, 8)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <p style={{ fontWeight: 600 }}>{ord.user?.name || ord.shippingAddress?.fullName}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.user?.email}</p>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>{ord.items.length} items</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>${ord.totalPrice.toFixed(2)}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge
                          variant={
                            ord.orderStatus === 'DELIVERED'
                              ? 'success'
                              : ord.orderStatus === 'CANCELLED'
                              ? 'danger'
                              : 'primary'
                          }
                        >
                          {ord.orderStatus}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={ord.orderStatus}
                          onChange={(e) =>
                            updateOrderStatus({
                              id: ord.id,
                              data: { orderStatus: e.target.value as OrderStatus },
                            })
                          }
                          className="input-field"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. INVENTORY STOCK EDITOR TAB */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Quick Stock Level Editor</h2>

          <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Product Title</th>
                  <th style={{ padding: '1rem' }}>Current Stock</th>
                  <th style={{ padding: '1rem' }}>Adjust Quantity</th>
                  <th style={{ padding: '1rem' }}>Save</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((prod) => {
                  const currentValue = stockEdits[prod.id] !== undefined ? stockEdits[prod.id] : prod.stock;
                  const isDirty = stockEdits[prod.id] !== undefined && stockEdits[prod.id] !== prod.stock;

                  return (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{prod.title}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={prod.stock <= 5 ? 'warning' : 'neutral'}>{prod.stock} units</Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <input
                          type="number"
                          min="0"
                          value={currentValue}
                          onChange={(e) =>
                            setStockEdits({
                              ...stockEdits,
                              [prod.id]: parseInt(e.target.value || '0', 10),
                            })
                          }
                          className="input-field"
                          style={{ width: '100px', padding: '0.4rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Button
                          variant={isDirty ? 'primary' : 'secondary'}
                          size="sm"
                          disabled={!isDirty}
                          leftIcon={<Check size={14} />}
                          onClick={() => handleSaveStock(prod.id)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProductId ? 'Edit Product' : 'Create New Product'}
        maxWidth="600px"
      >
        <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Product Title"
            value={productForm.title}
            onChange={(e) => {
              const title = e.target.value;
              setProductForm({
                ...productForm,
                title,
                slug: editingProductId ? productForm.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              });
            }}
            required
          />

          <Input
            label="URL Slug"
            value={productForm.slug}
            onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
            required
          />

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value || '0') })}
              required
            />
            <Input
              label="Discount Price ($ optional)"
              type="number"
              step="0.01"
              value={productForm.discountPrice || ''}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  discountPrice: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Stock Quantity"
              type="number"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value || '0', 10) })}
              required
            />

            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                className="input-field"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Image URLs (Comma-separated)"
            placeholder="https://images.unsplash.com/photo-..., https://..."
            value={productForm.images}
            onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
            helperText="Enter high-resolution CDN or Unsplash URLs."
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={productForm.featured}
              onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
              style={{ accentColor: 'var(--brand-primary)', width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Feature on Homepage Banner</span>
          </label>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            isLoading={isCreating || isUpdating}
            style={{ marginTop: '0.5rem' }}
          >
            {editingProductId ? 'Update Product' : 'Create Product'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
