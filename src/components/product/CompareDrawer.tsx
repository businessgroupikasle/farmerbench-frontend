import React, { useState } from 'react';
import { useCompareStore } from '../../store/compareStore';
import { useCart } from '../../hooks/useCart';
import { getUploadUrl } from '../../utils/image';
import { formatPrice } from '../../utils/currency';
import { RatingStars } from './RatingStars';
import { X, Layers, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

export const CompareDrawer: React.FC = () => {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Compare Bar */}
      <div className="fb-compare-floating-bar animate-fade-in" role="complementary" aria-label="Product Comparison Bar">
        <div className="fb-compare-bar-content">
          <div className="fb-compare-bar-left">
            <div className="fb-compare-icon-wrap">
              <Layers size={18} />
            </div>
            <div>
              <p className="fb-compare-bar-title">Product Comparison</p>
              <p className="fb-compare-bar-sub">{items.length} of 4 items selected</p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="fb-compare-thumbnails">
            {items.map((prod) => (
              <div key={prod.id} className="fb-compare-thumb-item">
                <img
                  src={getUploadUrl(prod.images?.[0], FALLBACK_IMAGE)}
                  alt={prod.title}
                  className="fb-compare-thumb-img"
                />
                <button
                  type="button"
                  onClick={() => removeFromCompare(prod.id)}
                  className="fb-compare-thumb-remove"
                  title={`Remove ${prod.title}`}
                  aria-label={`Remove ${prod.title}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="fb-compare-actions">
            <button
              type="button"
              onClick={clearCompare}
              className="fb-compare-clear-btn"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="fb-compare-launch-btn"
              disabled={items.length < 1}
            >
              <span>Compare ({items.length})</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Comparison Modal */}
      {isModalOpen && (
        <div className="fb-compare-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="fb-compare-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="fb-compare-modal-header">
              <div className="fb-compare-modal-title-wrap">
                <Layers size={20} color="#166534" />
                <h3>Product Comparison</h3>
                <span className="fb-compare-modal-badge">{items.length} Products</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="fb-compare-modal-close"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="fb-compare-table-wrapper">
              <table className="fb-compare-table">
                <thead>
                  <tr>
                    <th className="fb-compare-th-feature">Feature</th>
                    {items.map((prod) => (
                      <th key={prod.id} className="fb-compare-th-product">
                        <div className="fb-compare-card-head">
                          <button
                            type="button"
                            onClick={() => removeFromCompare(prod.id)}
                            className="fb-compare-table-remove"
                            title="Remove from comparison"
                          >
                            <X size={14} /> Remove
                          </button>
                          <img
                            src={getUploadUrl(prod.images?.[0], FALLBACK_IMAGE)}
                            alt={prod.title}
                            className="fb-compare-table-img"
                          />
                          <Link
                            to={`/product/${prod.slug || prod.id}`}
                            className="fb-compare-table-title"
                            onClick={() => setIsModalOpen(false)}
                          >
                            {prod.title}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr>
                    <td className="fb-compare-feature-name">Price</td>
                    {items.map((prod) => (
                      <td key={prod.id} className="fb-compare-td-val">
                        <div className="fb-compare-price-wrap">
                          <span className="fb-compare-price-current">
                            {formatPrice(prod.discountPrice || prod.price)}
                          </span>
                          {prod.discountPrice && prod.discountPrice < prod.price && (
                            <span className="fb-compare-price-original">
                              {formatPrice(prod.price)}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="fb-compare-feature-name">Category</td>
                    {items.map((prod) => (
                      <td key={prod.id} className="fb-compare-td-val">
                        <span className="fb-compare-cat-badge">
                          {prod.category?.name || 'General'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="fb-compare-feature-name">Rating & Reviews</td>
                    {items.map((prod) => (
                      <td key={prod.id} className="fb-compare-td-val">
                        {prod.rating > 0 ? (
                          <div className="fb-compare-rating-wrap">
                            <RatingStars rating={prod.rating} numReviews={prod.numReviews} />
                            <span>({prod.numReviews || 0})</span>
                          </div>
                        ) : (
                          <span className="text-muted">No reviews yet</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Availability */}
                  <tr>
                    <td className="fb-compare-feature-name">Availability</td>
                    {items.map((prod) => (
                      <td key={prod.id} className="fb-compare-td-val">
                        {prod.stock > 0 ? (
                          <span className="fb-compare-stock in-stock">
                            In Stock ({prod.stock} units)
                          </span>
                        ) : (
                          <span className="fb-compare-stock out-of-stock">
                            Out of Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Pack Size / Specifications */}
                  <tr>
                    <td className="fb-compare-feature-name">Pack Size / Specs</td>
                    {items.map((prod) => (
                      <td key={prod.id} className="fb-compare-td-val">
                        <span>
                          {prod.attributes?.packSize ||
                            prod.attributes?.unit ||
                            prod.attributes?.weight ||
                            'Standard Commercial Pack'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td className="fb-compare-feature-name">Description</td>
                    {items.map((prod) => (
                      <td key={prod.id} className="fb-compare-td-val fb-compare-desc">
                        {prod.description?.replace(/<[^>]*>?/gm, '').slice(0, 150)}...
                      </td>
                    ))}
                  </tr>

                  {/* Action Row */}
                  <tr>
                    <td className="fb-compare-feature-name">Action</td>
                    {items.map((prod) => (
                      <td key={prod.id} className="fb-compare-td-val">
                        <button
                          type="button"
                          onClick={() => addToCart(prod, 1)}
                          disabled={prod.stock === 0}
                          className="fb-add-to-cart-btn"
                          style={{ width: '100%' }}
                        >
                          <ShoppingBag size={15} />
                          <span>{prod.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareDrawer;
