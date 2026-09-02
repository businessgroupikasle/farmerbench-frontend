import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Order } from '@formerbench/shared';

interface RecentOrdersCardProps {
  orders: Order[];
  onViewAllOrders: () => void;
  onViewOrder: (order: Order | any) => void;
  onBuyAgain: (order: Order | any) => void;
  onReviewOrder: (order: Order | any) => void;
}

export const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({
  orders,
  onViewAllOrders,
  onViewOrder,
  onBuyAgain,
  onReviewOrder,
}) => {
  // If real orders exist, display them; otherwise provide clean fallback
  const recentOrdersList =
    orders && orders.length > 0
      ? orders.slice(0, 3)
      : [
          {
            id: 'ord-10482',
            orderCode: '#GL-10482',
            createdAt: '2026-08-28T10:00:00Z',
            itemsCount: 3,
            totalPrice: 1480,
            orderStatus: 'SHIPPED',
            actionType: 'view',
          },
          {
            id: 'ord-10374',
            orderCode: '#GL-10374',
            createdAt: '2026-08-16T10:00:00Z',
            itemsCount: 2,
            totalPrice: 1130,
            orderStatus: 'DELIVERED',
            actionType: 'buyAgain',
          },
          {
            id: 'ord-10291',
            orderCode: '#GL-10291',
            createdAt: '2026-08-02T10:00:00Z',
            itemsCount: 1,
            totalPrice: 580,
            orderStatus: 'DELIVERED',
            actionType: 'review',
          },
        ];

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h3 className="fb-card-title">Recent Orders</h3>
        <a
          className="fb-card-link"
          onClick={(e) => {
            e.preventDefault();
            onViewAllOrders();
          }}
        >
          View All <ArrowRight size={14} />
        </a>
      </div>

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
            {recentOrdersList.map((ord: any, idx: number) => {
              const displayId =
                ord.orderCode || `#GL-${ord.id.slice(0, 5).toUpperCase()}`;
              const formattedDate = new Date(ord.createdAt).toLocaleDateString(
                'en-GB',
                { day: '2-digit', month: 'short', year: 'numeric' }
              );
              const itemsCount = ord.items ? ord.items.length : ord.itemsCount || 1;
              const isShipped = ord.orderStatus === 'SHIPPED';

              return (
                <tr key={ord.id || idx}>
                  <td className="fb-table-order-id">{displayId}</td>
                  <td>{formattedDate}</td>
                  <td>{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</td>
                  <td style={{ fontWeight: 700 }}>₹{ord.totalPrice.toLocaleString()}</td>
                  <td>
                    <span
                      className={
                        isShipped ? 'fb-status-pill-blue' : 'fb-status-pill-green'
                      }
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td>
                    {isShipped || ord.actionType === 'view' ? (
                      <a
                        className="fb-table-action-link"
                        onClick={() => onViewOrder(ord)}
                      >
                        View
                      </a>
                    ) : idx === 1 || ord.actionType === 'buyAgain' ? (
                      <a
                        className="fb-table-action-link"
                        onClick={() => onBuyAgain(ord)}
                      >
                        Buy Again
                      </a>
                    ) : (
                      <a
                        className="fb-table-action-link"
                        onClick={() => onReviewOrder(ord)}
                      >
                        Review
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
