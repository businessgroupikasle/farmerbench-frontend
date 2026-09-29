import React, { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Droplets, Leaf, MapPin, Mountain, Sprout, Users } from 'lucide-react';
import farmHero from '../assets/farm-dev-hero.jpg';
import { serviceBookingService } from '../services/serviceBooking.service';
import { useAuth } from '../hooks/useAuth';
import { postalCodeService } from '../services/postalCode.service';
import './CropCalendarPage.css';

const districts: Record<string, string[]> = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kanchipuram', 'Karur', 'Krishnagiri', 'Madurai', 'Namakkal', 'Salem', 'Thanjavur', 'Theni', 'Tirunelveli', 'Tiruppur', 'Trichy', 'Vellore', 'Virudhunagar'],
  Karnataka: ['Bengaluru Rural', 'Belagavi', 'Ballari', 'Mysuru', 'Shivamogga', 'Tumakuru'],
  Kerala: ['Alappuzha', 'Ernakulam', 'Idukki', 'Kozhikode', 'Palakkad', 'Thrissur'],
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'Guntur', 'Kurnool', 'Nellore', 'Visakhapatnam'],
  Telangana: ['Hyderabad', 'Karimnagar', 'Khammam', 'Nalgonda', 'Warangal'],
};
const crops = ['Paddy / Rice', 'Banana', 'Coconut', 'Cotton', 'Groundnut', 'Maize', 'Onion', 'Sugarcane', 'Tomato', 'Chilli'];
const varieties: Record<string, string[]> = {
  'Paddy / Rice': ['ADT 43', 'ADT 45', 'CO 51', 'IR 20', 'Ponni'],
  Banana: ['Grand Naine', 'Nendran', 'Poovan', 'Red Banana'],
  Coconut: ['East Coast Tall', 'West Coast Tall', 'Chowghat Orange Dwarf'],
  Tomato: ['Arka Rakshak', 'PKM 1', 'Roma', 'Hybrid'],
};
const initialForm = { name: '', email: '', phone: '', pincode: '', state: '', district: '', city: '', postOffice: '', locationType: 'Rural', crop: '', variety: '', season: '', soilType: '', irrigationType: '' };

type Field = keyof typeof initialForm;
type SelectProps = { icon: React.ReactNode; label: string; required?: boolean; value: string; onChange: (value: string) => void; placeholder: string; options: string[]; disabled?: boolean };

const FormSelect: React.FC<SelectProps> = ({ icon, label, required, value, onChange, placeholder, options, disabled }) => (
  <div className="crop-calendar-field">
    <div className="crop-calendar-label">{icon}<label>{label} {required && <em>*</em>}</label></div>
    <select required={required} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

export const CropCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!user) return;
    const cleanPhone = (user.phone || '').replace(/\D/g, '').slice(-10);
    const locationParts = (user.location || '').split(',').map((part) => part.trim()).filter(Boolean);
    const profileDistrict = locationParts[0] || '';
    const profileState = locationParts[1] || '';
    const matchedState = Object.keys(districts).find((state) => state.toLowerCase() === profileState.toLowerCase()) || '';
    const matchedDistrict = matchedState && districts[matchedState]?.find((district) => district.toLowerCase() === profileDistrict.toLowerCase()) || '';

    setForm((current) => ({
      ...current,
      name: current.name || user.name || '',
      email: current.email || user.email || '',
      phone: current.phone || cleanPhone,
      state: current.state || matchedState,
      district: current.district || matchedDistrict,
    }));
  }, [user]);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const [postalStatus, setPostalStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');
  const [postOfficeOptions, setPostOfficeOptions] = useState<string[]>([]);

  useEffect(() => {
    const pin = form.pincode;
    if (pin.length !== 6) {
      setPostalStatus('idle');
      setForm((current) => current.state || current.district || current.city ? { ...current, state: '', district: '', city: '', postOffice: '' } : current);
      return;
    }
    let active = true;
    setPostalStatus('loading');
    postalCodeService.lookup(pin).then((place) => {
      if (!active) return;
      const offices = Array.from(new Set((place.postOffices?.length ? place.postOffices : [place.postOffice]).filter(Boolean)));
      setPostOfficeOptions(offices);
      setForm((current) => ({ ...current, state: place.state || '', district: place.district || '', city: place.city || '', postOffice: offices.length === 1 ? offices[0] : '' }));
      setPostalStatus('found');
    }).catch(() => {
      if (!active) return;
      setForm((current) => ({ ...current, state: '', district: '', city: '', postOffice: '' }));
      setPostOfficeOptions([]);
      setPostalStatus('error');
    });
    return () => { active = false; };
  }, [form.pincode]);

  const update = (field: Field, value: string) => setForm((current) => ({
    ...current,
    [field]: value,
    ...(field === 'state' ? { district: '' } : {}),
    ...(field === 'crop' ? { variety: '' } : {}),
  }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await serviceBookingService.createBooking({
        serviceSlug: 'crop-calendar', serviceName: 'Crop Calendar Request',
        name: form.name.trim(), phone: form.phone.replace(/\D/g, ''), email: form.email.trim(),
        location: `${form.postOffice}, ${form.city}, ${form.district}, ${form.state} - ${form.pincode}`, cropType: form.crop,
        message: JSON.stringify({ ...form, requestType: 'CROP_CALENDAR' }),
      });
      setReference(response.data?.bookingReference || 'Saved');
    } catch (err: any) {
      setError(err.message || 'Unable to save your crop calendar request. Please try again.');
    } finally { setSubmitting(false); }
  };

  return <div className="crop-calendar-page">
    <section className="crop-calendar-hero" style={{ '--crop-calendar-hero-image': `url(${farmHero})` } as React.CSSProperties} aria-labelledby="crop-calendar-title">
      <div className="crop-calendar-hero__shade" aria-hidden="true" />
      <div className="crop-calendar-hero__content"><div className="crop-calendar-hero__icon"><CalendarDays size={42} /></div><div className="crop-calendar-hero__copy"><h1 id="crop-calendar-title">Crop Calendar</h1><p className="crop-calendar-hero__tagline">Plan Smart. Grow Better.</p><p className="crop-calendar-hero__description">Get a customized crop calendar based on your location, crop, and season.</p></div></div>
    </section>
    <section className="crop-calendar-builder">
      <div className="crop-calendar-form-card">
        <header className="crop-calendar-form-header"><div><h2>Get Your Crop Calendar</h2><p>Fill in the details below to get a personalized crop calendar with important activities, timelines and expert recommendations.</p></div><div className="crop-calendar-form-art"><CalendarDays size={54} /><Leaf size={25} /></div></header>
        {reference ? <div className="crop-calendar-success"><CheckCircle2 size={54} /><h3>Request Saved Successfully!</h3><p>Your crop calendar request is now available in the admin dashboard.</p><strong>Reference: {reference}</strong><button type="button" onClick={() => { setReference(''); setForm({ ...initialForm, name: user?.name || '', email: user?.email || '', phone: (user?.phone || '').replace(/\D/g, '').slice(-10) }); }}>Create Another Calendar</button></div> :
        <form onSubmit={submit} className="crop-calendar-form">
          <div className="crop-calendar-field"><div className="crop-calendar-label"><Users /><label>Full Name <em>*</em></label></div><input required type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Enter your full name" autoComplete="name" /></div>
          <div className="crop-calendar-field"><div className="crop-calendar-label"><Leaf /><label>Email Address <em>*</em></label></div><input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Enter your email address" autoComplete="email" /></div>
          <div className="crop-calendar-field"><div className="crop-calendar-label"><Users /><label>Mobile Number <em>*</em></label></div><input required type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))} placeholder="Enter 10-digit mobile number" autoComplete="tel" /></div>
          <div className="crop-calendar-field"><div className="crop-calendar-label"><MapPin /><label>Pincode <em>*</em></label></div><div><input required type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={form.pincode} onChange={(e) => update('pincode', e.target.value.replace(/\D/g, ''))} placeholder="Enter 6-digit pincode" autoComplete="postal-code" />{postalStatus === 'loading' && <small className="crop-calendar-postal-status">Finding location...</small>}{postalStatus === 'error' && <small className="crop-calendar-postal-status error">Pincode not found. Please enter a valid Indian pincode.</small>}</div></div>
          <div className="crop-calendar-field"><div className="crop-calendar-label"><MapPin /><label>State <em>*</em></label></div><input required readOnly value={form.state} placeholder="Auto-filled from pincode" className="crop-calendar-readonly" /></div>
          <div className="crop-calendar-field"><div className="crop-calendar-label"><Users /><label>District <em>*</em></label></div><input required readOnly value={form.district} placeholder="Auto-filled from pincode" className="crop-calendar-readonly" /></div>
<div className="crop-calendar-field"><div className="crop-calendar-label"><MapPin /><label>City <em>*</em></label></div><input required readOnly value={form.city} placeholder="Auto-filled from pincode" className="crop-calendar-readonly" /></div>
          <FormSelect icon={<MapPin />} label="Post Office" required value={form.postOffice} onChange={(value) => update('postOffice', value)} placeholder="Select Post Office" options={postOfficeOptions} disabled={postalStatus !== 'found' || postOfficeOptions.length === 0} />
          <div className="crop-calendar-field"><div className="crop-calendar-label"><MapPin /><label>Your Location Type <em>*</em></label></div><div className="crop-calendar-radio-group">{['Rural', 'Urban'].map((type) => <label key={type}><input type="radio" name="locationType" checked={form.locationType === type} onChange={() => update('locationType', type)} /> {type}</label>)}</div></div>
          <FormSelect icon={<Sprout />} label="Select Crop" required value={form.crop} onChange={(v) => update('crop', v)} placeholder="Select Crop" options={crops} />
          <FormSelect icon={<Leaf />} label="Variety (Optional)" value={form.variety} onChange={(v) => update('variety', v)} placeholder="Select Variety" options={varieties[form.crop] || ['Local Variety', 'Hybrid', 'Other']} disabled={!form.crop} />
          <FormSelect icon={<CalendarDays />} label="Season" required value={form.season} onChange={(v) => update('season', v)} placeholder="Select Season" options={['Kharif', 'Rabi', 'Zaid / Summer', 'Year Round']} />
          <FormSelect icon={<Mountain />} label="Soil Type (Optional)" value={form.soilType} onChange={(v) => update('soilType', v)} placeholder="Select Soil Type" options={['Alluvial Soil', 'Black Soil', 'Clay Soil', 'Laterite Soil', 'Loamy Soil', 'Red Soil', 'Sandy Soil']} />
          <FormSelect icon={<Droplets />} label="Irrigation Type (Optional)" value={form.irrigationType} onChange={(v) => update('irrigationType', v)} placeholder="Select Irrigation Type" options={['Rainfed', 'Drip Irrigation', 'Sprinkler Irrigation', 'Canal Irrigation', 'Borewell / Tube Well']} />
          {error && <p className="crop-calendar-error">{error}</p>}
          <button className="crop-calendar-submit" type="submit" disabled={submitting}><CalendarDays size={17} /> {submitting ? 'Saving Request...' : 'Generate Crop Calendar'}</button>
        </form>}
      </div>
    </section>
  </div>;
};
export default CropCalendarPage;










