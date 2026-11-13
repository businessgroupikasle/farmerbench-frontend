import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { ServiceBooking } from '../../types/serviceBooking';
import { serviceBookingService } from '../../services/serviceBooking.service';
import { apiClient } from '../../services/api';

const labels: Record<string, string> = {
  sowingDate: 'Planting Date', growthStage: 'Growth Stage', affectedPart: 'Affected Parts',
  noticedWhen: 'Problem Duration', affectedPercent: 'Affected Area (%)', problemSeverity: 'Severity',
  symptomsDescription: 'Symptoms', locationPincode: 'Location / Pincode', budget: 'Development Budget',
  startDate: 'Expected Starting Date', additionalNotes: 'Additional Requirements',
  responseMethod: 'Preferred Response Method', preferredResponseMethod: 'Preferred Response Method',
  termsAgreed: 'Consent', termsConfirmed: 'Consent', farmerName: 'Farmer Name', mobileNumber: 'Mobile Number',
};
const label = (key: string) => labels[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
const display = (value: unknown): string => value === null || value === undefined || value === '' ? 'Not provided'
  : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : Array.isArray(value) ? value.map(display).join(', ')
  : typeof value === 'object' ? Object.entries(value).map(([key, val]) => `${label(key)}: ${display(val)}`).join('\n') : String(value);

const Attachment: React.FC<{ bookingId: string; file: NonNullable<ServiceBooking['attachments']>[number] }> = ({ bookingId, file }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let active = true;
    let objectUrl = '';
    apiClient.get<Blob, Blob>(`/service-bookings/${bookingId}/attachments/${encodeURIComponent(file.filename)}`, { responseType: 'blob' })
      .then(blob => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      }).catch(() => { if (active) setError('Could not load this attachment. Close details and try again.'); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [bookingId, file.filename]);
  return <div className="booking-attachment">
    {error ? <p role="alert">{error}</p> : !url ? <p>Loading attachment…</p> : <>
      {file.mimeType.startsWith('image/') && <img src={url} alt={file.name} style={expanded ? { height: 'auto', maxHeight: '70vh' } : undefined} />}
      {file.mimeType === 'application/pdf' && expanded && <iframe src={url} title={file.name} />}
      <div>{file.name}</div>
      <button type="button" className="admin-quick-btn" onClick={() => setExpanded(value => !value)}>{expanded ? 'Close Preview' : 'Preview'}</button>{' '}
      <a href={url} download={file.name}>Download</a>
    </>}
  </div>;
};

export const BookingDetailsModal: React.FC<{ booking: ServiceBooking | null; onClose: () => void }> = ({ booking, onClose }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['booking-details', booking?.id],
    queryFn: async () => (await serviceBookingService.getBookingById(booking!.id)).data,
    enabled: Boolean(booking), staleTime: 0,
  });
  const record = data || booking;
  if (!record) return null;
  let legacy: Record<string, unknown> = {};
  try { const parsed = JSON.parse(record.message || '{}'); if (parsed && !Array.isArray(parsed) && typeof parsed === 'object') legacy = parsed; } catch { legacy = { message: record.message }; }
  const details = { ...legacy, ...(record.details || {}) };
  const contactKeys = new Set(['farmerName', 'mobileNumber', 'email', 'location', 'farmLocation', 'locationPincode']);
  const preferences = /response|language|contact|urgency|consultationMode|preferredDateTime/i;
  const problem = /problem|affected|noticed|symptom|treatment|mainConcern|previousTreatment/i;
  const hidden = /^(photosCount|photoNames|uploadedFilesCount|termsAgreed|termsConfirmed)$/;
  const groups: Record<string, Array<[string, unknown]>> = { 'Crop & Service Details': [], 'Problem Details': [], 'Communication Preferences': [] };
  for (const [key, value] of Object.entries(details)) {
    if (hidden.test(key) || contactKeys.has(key)) continue;
    const group = preferences.test(key) ? 'Communication Preferences' : problem.test(key) ? 'Problem Details' : 'Crop & Service Details';
    groups[group].push([key, value]);
  }
  const fields = (entries: Array<[string, unknown]>) => <dl>{entries.map(([key, value]) => <div key={key}><dt>{label(key)}</dt><dd>{display(value)}</dd></div>)}</dl>;
  return <Modal isOpen={Boolean(booking)} onClose={onClose} title={`Request Details — ${record.bookingReference}`} maxWidth="850px">
    <div className="booking-details">
      {isLoading && <p>Loading complete request…</p>}
      {isError && <p role="alert">Could not refresh request details. <button onClick={() => refetch()}>Retry</button></p>}
      <section><h4>Booking</h4>{fields([['service', record.serviceName], ['status', record.status.replaceAll('_', ' ')], ['submitted', new Date(record.createdAt).toLocaleString('en-IN')], ['preferredDate', record.preferredDate], ['farmSize', record.farmSize], ['cropType', record.cropType]])}</section>
      <section><h4>Contact Details</h4>{fields([['farmerName', record.name], ['mobileNumber', record.phone], ['email', record.email], ['location', record.location]])}</section>
      {Object.entries(groups).filter(([, entries]) => entries.length).map(([title, entries]) => <section key={title}><h4>{title}</h4>{fields(entries)}</section>)}
      <section><h4>Photos & Supporting Documents</h4>
        {record.attachments?.length ? <div className="booking-attachments">{record.attachments.map(file => <Attachment key={file.filename} bookingId={record.id} file={file} />)}</div>
          : <p>No saved attachments are available for this request.</p>}
      </section>
      {record.adminNotes && <section><h4>Team Notes</h4><p style={{ whiteSpace: 'pre-wrap' }}>{record.adminNotes}</p></section>}
    </div>
  </Modal>;
};
