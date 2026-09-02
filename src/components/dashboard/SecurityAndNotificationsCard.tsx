import React from 'react';
import { ShieldCheck, ArrowRight, Package, Stethoscope, Star } from 'lucide-react';

interface SecurityAndNotificationsCardProps {
  onManageSecurity: () => void;
  onViewAllNotifications: () => void;
}

export const SecurityAndNotificationsCard: React.FC<SecurityAndNotificationsCardProps> = ({
  onManageSecurity,
  onViewAllNotifications,
}) => {
  const notifications = [
    {
      id: 'notif-1',
      icon: <Package size={15} color="#2563eb" />,
      text: 'Your order #GL-10482 has been shipped.',
      time: '28 Aug 2026, 02:45 PM',
    },
    {
      id: 'notif-2',
      icon: <Stethoscope size={15} color="#16a34a" />,
      text: 'Dr. Arun replied to your Crop Doctor request.',
      time: '28 Aug 2026, 11:20 AM',
    },
    {
      id: 'notif-3',
      icon: <Star size={15} color="#f59e0b" />,
      text: 'Your Growth Booster review is now published.',
      time: '28 Aug 2026, 10:15 AM',
    },
  ];

  return (
    <div className="fb-security-notifications-stack">
      {/* Account Security Box */}
      <div className="fb-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--fb-green-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fb-green-800)',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>Account Security</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fb-text-muted)' }}>
                Password last changed 45 days ago
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <a
            className="fb-card-link"
            onClick={(e) => {
              e.preventDefault();
              onManageSecurity();
            }}
          >
            Manage Security <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Recent Notifications Feed */}
      <div className="fb-card">
        <div className="fb-card-header">
          <h3 className="fb-card-title">Recent Notifications</h3>
          <a
            className="fb-card-link"
            onClick={(e) => {
              e.preventDefault();
              onViewAllNotifications();
            }}
          >
            View All <ArrowRight size={14} />
          </a>
        </div>

        <div className="fb-notifications-list">
          {notifications.map((n) => (
            <div key={n.id} className="fb-notification-item">
              <div style={{ marginTop: '0.1rem' }}>{n.icon}</div>
              <div>
                <span>{n.text}</span>
                <span className="fb-notification-time">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
