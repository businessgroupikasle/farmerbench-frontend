import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, MessageCircle, MessageSquare, Phone, Sprout, Stethoscope } from 'lucide-react';
import { ServiceBookingRecord } from '../../services/serviceBooking.service';

interface CropDoctorRequestsPanelProps {
  bookings: ServiceBookingRecord[];
  isLoading?: boolean;
  limit?: number;
  onViewAll?: () => void;
}

const readDetails = (message?: string | null): Record<string, any> => {
  if (!message) return {};
  try {
    const parsed = JSON.parse(message);
    return parsed && typeof parsed === 'object' ? parsed : { symptoms: message };
  } catch {
    return { symptoms: message };
  }
};

const statusLabel: Record<string, string> = {
  NEW: 'Request received',
  CONTACTED: 'Expert contacted',
  IN_PROGRESS: 'Diagnosis in progress',
  COMPLETED: 'Expert replied',
  CANCELLED: 'Request cancelled',
};

const normalizeResponseMethod = (booking: ServiceBookingRecord, details: Record<string, any>) =>
  String(
    (booking.details as Record<string, any> | null)?.responseMethod ||
      details.preferredResponseMethod ||
      details.responseMethod ||
      'WhatsApp'
  );

export const CropDoctorRequestsPanel: React.FC<CropDoctorRequestsPanelProps> = ({
  bookings,
  isLoading = false,
  limit,
  onViewAll,
}) => {
  const cropRequests = bookings.filter((booking) => booking.serviceSlug === 'crop-doctor');
  const visibleRequests = typeof limit === 'number' ? cropRequests.slice(0, limit) : cropRequests;

  return (
    <div className="fb-card">
      <div className="fb-card-header">
        <h2 className="fb-card-title">
          <Stethoscope size={20} color="#0F4726" /> Crop Doctor Requests
        </h2>
        {onViewAll && cropRequests.length > visibleRequests.length && (
          <button type="button" className="fb-btn-outline" onClick={onViewAll}>View All</button>
        )}
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--fb-text-muted)', padding: '1rem 0' }}>Loading your requests...</p>
      ) : cropRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <Sprout size={38} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1rem' }}>No Crop Doctor requests yet</h3>
          <p style={{ color: 'var(--fb-text-muted)', margin: '0.35rem 0 1rem' }}>
            Submit crop symptoms to receive advice from an agriculture expert.
          </p>
          <Link to="/crop-doctor" className="fb-btn-primary-dark">Ask Crop Doctor</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {visibleRequests.map((booking) => {
            const details = readDetails(booking.message);
            const hasReply = Boolean(booking.adminNotes?.trim());
            const responseMethod = normalizeResponseMethod(booking, details);
            const preferredLanguage =
              (booking.details as Record<string, any> | null)?.preferredLanguage || details.preferredLanguage;
            const bestTime =
              (booking.details as Record<string, any> | null)?.bestTimeToContact || details.bestTimeToContact;
            const whatsappFollowUpUrl = `https://wa.me/919360763060?text=${encodeURIComponent(
              `Hello AgriEra Crop Doctor, following up on request ${booking.bookingReference} (${details.cropName || booking.cropType || 'Crop'}).`
            )}`;

            return (
              <article key={booking.id} style={{ border: '1px solid var(--fb-card-border)', borderRadius: 12, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ color: '#0F4726' }}>{booking.bookingReference}</strong>
                    <div style={{ fontWeight: 800, marginTop: '0.25rem' }}>
                      {details.cropName || booking.cropType || 'Crop'} — {details.problemCategory || 'Health diagnosis'}
                    </div>
                  </div>
                  <span className={booking.status === 'COMPLETED' ? 'fb-status-pill-green' : 'fb-status-pill-blue'}>
                    {statusLabel[booking.status] || booking.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', color: 'var(--fb-text-muted)', fontSize: '0.8rem', marginTop: '0.7rem', alignItems: 'center' }}>
                  <span><CalendarDays size={13} /> {new Date(booking.createdAt).toLocaleDateString('en-GB')}</span>
                  <span><MapPin size={13} /> {booking.location}</span>
                  {details.problemSeverity && <span>Severity: {details.problemSeverity}</span>}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F0FDF4', color: '#166534', padding: '0.15rem 0.55rem', borderRadius: 999, fontWeight: 700, border: '1px solid #BBF7D0' }}>
                    {responseMethod === 'Phone Call' ? <Phone size={12} /> : responseMethod === 'WhatsApp' ? <MessageCircle size={12} /> : <MessageSquare size={12} />}
                    {responseMethod}
                  </span>
                  {preferredLanguage && <span>Language: {preferredLanguage}</span>}
                  {bestTime && responseMethod === 'Phone Call' && <span>Best time: {bestTime}</span>}
                </div>

                {details.symptoms && (
                  <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '0.75rem', marginTop: '0.8rem', fontSize: '0.85rem' }}>
                    <strong>Your symptoms:</strong> {details.symptoms}
                  </div>
                )}

                <div style={{ background: hasReply ? '#ECFDF3' : '#FFF7ED', border: `1px solid ${hasReply ? '#BBF7D0' : '#FED7AA'}`, borderRadius: 8, padding: '0.85rem', marginTop: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: hasReply ? '0.35rem' : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: hasReply ? '#166534' : '#9A3412' }}>
                      <MessageSquare size={15} />
                      {hasReply
                        ? 'In-App Expert Response'
                        : responseMethod === 'Phone Call'
                        ? `Awaiting expert phone call to ${booking.phone}`
                        : responseMethod === 'WhatsApp'
                        ? `Awaiting expert WhatsApp message on ${booking.phone}`
                        : 'Awaiting in-app expert reply'}
                    </div>
                    {responseMethod === 'WhatsApp' && (
                      <a
                        href={whatsappFollowUpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.76rem', fontWeight: 700, color: '#15803D', textDecoration: 'underline' }}
                      >
                        <MessageCircle size={13} /> Open WhatsApp Support
                      </a>
                    )}
                  </div>
                  {hasReply && <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{booking.adminNotes}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
