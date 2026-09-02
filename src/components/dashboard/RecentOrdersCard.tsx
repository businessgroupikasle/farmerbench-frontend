import React from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@formerbench/shared';

interface RecentOrdersCardProps {
  orders: Order[];
  onViewAllOrders: () => void;
  onViewOrder: (order: Order | any) => void;
  onBuyAgain: (order: Order | any) => void;
  onReviewOrder: (order: Order | any) => void;
}

export const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({
  orders = [],
  onViewAllOrders,
  onViewOrder,
  onBuyAgain,
  onReviewOrder,
}) => {
  const navigate = useNavigate();
  const recentOrdersList = orders.slice(0, 3);

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">Recent Orders</h3>
        {orders.length > 0 && (
          <a
            className="fb-card-link"
            onClick={(e) => {
              e.preventDefault();
              onViewAllOrders();
            }}
          >
            View All <ArrowRight size={14} />
          </a>
        )}
      </div>

      {recentOrdersList.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <Package size={28} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--fb-text-muted)', marginBottom: '0.75rem' }}>
            No recent orders placed yet.
          </p>
          <button
            className="fb-btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="fb-table-wrap">
          <table className="fb-recent-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrdersList.map((ord: Order) => {
                const displayId = `#GL-${ord.id.slice(0, 8).toUpperCase()}`;
                const formattedDate = new Date(ord.createdAt).toLocaleDateString(
                  'en-GB',
                  { day: '2-digit', month: 'short', year: 'numeric' }
                );
                const itemsCount = ord.items ? ord.items.length : 1;
                const isShipped = ord.orderStatus === 'SHIPPED';
                const isDelivered = ord.orderStatus === 'DELIVERED';

                return (
                  <tr key={ord.id}>
                    <td className="fb-table-order-id">{displayId}</td>
                    <td>{formattedDate}</td>
                    <td>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</td>
                    <td style={{ fontWeight: 700 }}>₹{ord.totalPrice.toFixed(2)}</td>
                    <td>
                      <span
                        className={
                          isDelivered
                            ? 'fb-status-pill-green'
                            : isShipped
                            ? 'fb-status-pill-blue'
                            : 'fb-status-pill-blue'
                        }
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td>
                      {isDelivered ? (
                        <a
                          className="fb-table-action-link"
                          onClick={() => onReviewOrder(ord)}
                        >
                          Review
                        </a>
                      ) : isShipped ? (
                        <a
                          className="fb-table-action-link"
                          onClick={() => onViewOrder(ord)}
                        >
                          View
                        </a>
                      ) : (
                        <a
                          className="fb-table-action-link"
                          onClick={() => onBuyAgain(ord)}
                        >
                          Reorder
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
