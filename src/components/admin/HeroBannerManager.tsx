import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Edit3, Image as ImageIcon, Plus, Power, Trash2, X } from 'lucide-react';
import { HeroBanner, HeroPage } from '@formerbench/shared';
import { useAdminHeroBanners, useHeroBannerMutations } from '../../hooks/useHeroBanners';
import { uploadService } from '../../services/upload.service';
import { getUploadUrl } from '../../utils/image';

const pages: HeroPage[] = ['HOME', 'ABOUT', 'SERVICES', 'PRODUCTS'];
const empty = (page: HeroPage) => ({ page, title: '', highlightedText: '', eyebrow: '', description: '', desktopImage: '', mobileImage: '', imageAlt: '', primaryButtonText: '', primaryButtonLink: '', secondaryButtonText: '', secondaryButtonLink: '', textAlignment: 'left', overlayColor: '#000000', overlayOpacity: .15, isActive: true, sortOrder: 0, autoplayDuration: 5000, startsAt: null, endsAt: null });

export const HeroBannerManager: React.FC = () => {
  const [page, setPage] = useState<HeroPage>('HOME');
  const [editing, setEditing] = useState<HeroBanner | null>(null);
  const [form, setForm] = useState<any>(empty('HOME'));
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: banners = [] } = useAdminHeroBanners(page);
  const { createBanner, updateBanner, deleteBanner, reorderBanners } = useHeroBannerMutations();

  const begin = (banner?: HeroBanner) => { setEditing(banner || null); setForm(banner ? { ...banner, startsAt: banner.startsAt ? String(banner.startsAt).slice(0, 16) : null, endsAt: banner.endsAt ? String(banner.endsAt).slice(0, 16) : null } : { ...empty(page), sortOrder: banners.length }); setOpen(true); };
  const upload = async (file: File, field: 'desktopImage' | 'mobileImage') => { setUploading(true); try { const result = await uploadService.uploadImage(file, 'banners'); if (result.data?.url) setForm((value: any) => ({ ...value, [field]: result.data!.url })); } finally { setUploading(false); } };
  const save = async (event: React.FormEvent) => { event.preventDefault(); const payload = { ...form, overlayOpacity: Number(form.overlayOpacity), autoplayDuration: Number(form.autoplayDuration), sortOrder: Number(form.sortOrder), startsAt: form.startsAt || null, endsAt: form.endsAt || null }; if (editing) await updateBanner({ id: editing.id, data: payload }); else await createBanner(payload); setOpen(false); };
  const move = async (index: number, step: number) => { const next = [...banners]; const target = index + step; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; await reorderBanners(next.map((item) => item.id)); };
  const remove = async (banner: HeroBanner) => { if (!window.confirm(`Permanently delete banner "${banner.title}"? This action cannot be undone.`)) return; await deleteBanner(banner.id); };

  return <div className="hero-manager">
    <div className="admin-card-header"><div><h2 className="admin-welcome-title" style={{ fontSize: '1.4rem' }}>Page Hero Banners</h2><p className="admin-welcome-sub">Manage images, content, buttons and carousel order for every main page.</p></div><button className="admin-primary-btn" onClick={() => begin()}><Plus size={16} /> Add Banner</button></div>
    <details className="hero-banner-guide" open>
      <summary><ImageIcon size={17} /> Hero Banner Upload Guide</summary>
      <div className="hero-banner-guide-grid">
        <div className="hero-guide-card"><strong>Desktop image</strong><span>Recommended: 1920 × 720 px</span><span>Minimum: 1440 × 540 px</span><small>Wide landscape ratio, approximately 8:3.</small></div>
        <div className="hero-guide-card"><strong>Mobile image</strong><span>Recommended: 768 × 900 px</span><span>Minimum: 640 × 750 px</span><small>Portrait image. If omitted, the desktop image is used.</small></div>
        <div className="hero-guide-card"><strong>File requirements</strong><span>WebP, JPG or PNG</span><span>Maximum upload: 10 MB</span><small>WebP under 1 MB gives the best page speed.</small></div>
        <div className="hero-guide-card"><strong>Image safe area</strong><span>Keep the subject away from edges</span><span>Leave 40% space for text</span><small>Do not place important text inside the uploaded image.</small></div>
        <div className="hero-guide-card"><strong>Content length</strong><span>Title: up to 45 characters</span><span>Description: up to 140 characters</span><small>Use the highlighted title for the second coloured line.</small></div>
        <div className="hero-guide-card"><strong>Buttons and links</strong><span>Example: /products</span><span>Example: /services</span><small>Leave button text empty when that button is not required.</small></div>
        <div className="hero-guide-card"><strong>Carousel timing</strong><span>Recommended: 5000 ms</span><span>Allowed: 2000–30000 ms</span><small>Four to six seconds works best for normal banners.</small></div>
        <div className="hero-guide-card"><strong>Accessibility</strong><span>Describe the image clearly</span><span>Do not repeat the banner title</span><small>Example: Farmer inspecting healthy paddy crops.</small></div>
      </div>
      <div className="hero-guide-note"><strong>Important:</strong> Upload separate desktop and mobile images for the best crop. Preview the title position, activate only completed banners, and use the arrow controls below to set the carousel order.</div>
    </details>
    <div className="hero-manager-pages">{pages.map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{item.charAt(0) + item.slice(1).toLowerCase()}</button>)}</div>
    <div className="hero-manager-grid">{banners.map((banner, index) => <article key={banner.id} className="hero-manager-card"><img src={getUploadUrl(banner.desktopImage)} alt={banner.imageAlt || banner.title} /><div className="hero-manager-card-body"><div><small>{banner.eyebrow || banner.page}</small><h3>{banner.title} <span>{banner.highlightedText}</span></h3><p>{banner.description}</p></div><div className="hero-manager-meta"><span className={`admin-status-badge ${banner.isActive ? 'paid' : 'cancelled'}`}>{banner.isActive ? 'Active' : 'Inactive'}</span><span>Order {index + 1}</span><span>{banner.autoplayDuration / 1000}s</span></div><div className="hero-manager-actions"><button className="admin-mini-btn" onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={13} /></button><button className="admin-mini-btn" onClick={() => move(index, 1)} disabled={index === banners.length - 1}><ArrowDown size={13} /></button><button className="admin-mini-btn" onClick={() => begin(banner)}><Edit3 size={13} /> Update</button><button className="admin-mini-btn" onClick={() => updateBanner({ id: banner.id, data: { isActive: !banner.isActive } })}><Power size={13} /> {banner.isActive ? 'Disable' : 'Enable'}</button><button className="admin-mini-btn hero-banner-delete-btn" onClick={() => remove(banner)}><Trash2 size={13} /> Delete</button></div></div></article>)}</div>
    {!banners.length && <div className="hero-manager-empty"><ImageIcon size={30} /><p>No {page.toLowerCase()} banners yet. The page continues using its original hero.</p></div>}
    {open && <div className="admin-modal-overlay" onClick={() => setOpen(false)}><div className="admin-modal-card hero-manager-modal" onClick={(e) => e.stopPropagation()}><div className="admin-modal-header"><h3 className="admin-modal-title">{editing ? 'Edit' : 'Add'} {page} Hero Banner</h3><button className="admin-modal-close-btn" onClick={() => setOpen(false)}><X size={20} /></button></div><form onSubmit={save}><div className="admin-modal-body hero-manager-form">
      <label>Eyebrow<input className="admin-form-input" value={form.eyebrow || ''} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} /></label>
      <label>Title *<input required className="admin-form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
      <label>Highlighted title<input className="admin-form-input" value={form.highlightedText || ''} onChange={(e) => setForm({ ...form, highlightedText: e.target.value })} /></label>
      <label className="wide">Description<textarea className="admin-form-textarea" rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
      <label>Desktop image *<input required className="admin-form-input" value={form.desktopImage} onChange={(e) => setForm({ ...form, desktopImage: e.target.value })} /><input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'desktopImage')} /></label>
      <label>Mobile image<input className="admin-form-input" value={form.mobileImage || ''} onChange={(e) => setForm({ ...form, mobileImage: e.target.value })} /><input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'mobileImage')} /></label>
      <label>Image alt text<input className="admin-form-input" value={form.imageAlt || ''} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} /></label>
      <label>Text alignment<select className="admin-form-select" value={form.textAlignment} onChange={(e) => setForm({ ...form, textAlignment: e.target.value })}><option>left</option><option>center</option><option>right</option></select></label>
      <label>Primary button text<input className="admin-form-input" value={form.primaryButtonText || ''} onChange={(e) => setForm({ ...form, primaryButtonText: e.target.value })} /></label><label>Primary button link<input className="admin-form-input" value={form.primaryButtonLink || ''} onChange={(e) => setForm({ ...form, primaryButtonLink: e.target.value })} /></label>
      <label>Secondary button text<input className="admin-form-input" value={form.secondaryButtonText || ''} onChange={(e) => setForm({ ...form, secondaryButtonText: e.target.value })} /></label><label>Secondary button link<input className="admin-form-input" value={form.secondaryButtonLink || ''} onChange={(e) => setForm({ ...form, secondaryButtonLink: e.target.value })} /></label>
      <label>Autoplay milliseconds<input type="number" min="2000" max="30000" className="admin-form-input" value={form.autoplayDuration} onChange={(e) => setForm({ ...form, autoplayDuration: e.target.value })} /></label><label>Overlay opacity<input type="number" min="0" max="1" step=".05" className="admin-form-input" value={form.overlayOpacity} onChange={(e) => setForm({ ...form, overlayOpacity: e.target.value })} /></label>
      <label>Starts at<input type="datetime-local" className="admin-form-input" value={form.startsAt || ''} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /></label><label>Ends at<input type="datetime-local" className="admin-form-input" value={form.endsAt || ''} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} /></label>
      <label className="hero-manager-check"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
    </div><div className="admin-modal-footer"><button type="button" className="admin-quick-btn" onClick={() => setOpen(false)}>Cancel</button><button className="admin-primary-btn" disabled={uploading}>{uploading ? 'Uploading…' : 'Save Banner'}</button></div></form></div></div>}
  </div>;
};
