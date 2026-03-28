import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { RiUploadCloud2Line, RiCloseLine, RiAddLine, RiInformationLine } from 'react-icons/ri';

const CATEGORIES = ['Books', 'Lab Equipment', 'Appliances', 'Electronics', 'Stationery', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const PRICE_UNITS = ['fixed', 'per day', 'per week', 'per month'];

export default function AddListing() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Books', type: 'Sell',
    price: '', priceUnit: 'fixed', condition: 'Good',
    location: '', contactPreference: 'email', tags: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 4);
    setFiles(selected);
    const urls = selected.map(f => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const removeImage = (i) => {
    const newFiles = files.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setFiles(newFiles); setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Title and description are required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));
      await API.post('/listings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Listing submitted for approval!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">List a Resource</h1>
        <p className="text-gray-500 text-sm">Share your item with fellow students on campus</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div>
            <label className="label">Photos (up to 4)</label>
            <div className="flex gap-3 flex-wrap">
              {previews.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-surface-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    <RiCloseLine />
                  </button>
                </div>
              ))}
              {previews.length < 4 && (
                <button type="button" onClick={() => fileRef.current.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/50 flex flex-col items-center justify-center text-gray-500 hover:text-brand-400 transition-colors">
                  <RiUploadCloud2Line className="text-2xl mb-1" />
                  <span className="text-xs">Add Photo</span>
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </div>

          {/* Title */}
          <div>
            <label className="label">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="e.g. Engineering Mathematics Vol.2 by R.K. Jain"
              className="input" maxLength={100} />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required
              placeholder="Describe your item — condition, edition, any damage, etc."
              rows={4} className="input resize-none" maxLength={1000} />
            <p className="text-xs text-gray-600 mt-1 text-right">{form.description.length}/1000</p>
          </div>

          {/* Category + Type + Condition row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Listing Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="input">
                <option>Sell</option><option>Rent</option><option>Share</option>
              </select>
            </div>
            <div>
              <label className="label">Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange} className="input">
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          {form.type !== 'Share' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹) *</label>
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange}
                  placeholder="0" required className="input" />
              </div>
              <div>
                <label className="label">Price Unit</label>
                <select name="priceUnit" value={form.priceUnit} onChange={handleChange} className="input">
                  {PRICE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Location + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location / Hostel</label>
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Boys Hostel Block C" className="input" />
            </div>
            <div>
              <label className="label">Contact Preference</label>
              <select name="contactPreference" value={form.contactPreference} onChange={handleChange} className="input">
                <option value="email">Email only</option>
                <option value="phone">Phone only</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="calculus, sem3, btech, maths" className="input" />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-900/20 border border-blue-800/30 text-sm text-blue-300">
            <RiInformationLine className="flex-shrink-0 mt-0.5" />
            <span>Your listing will be reviewed by an admin before it appears publicly. This usually takes a few hours.</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiAddLine />}
              {loading ? 'Submitting...' : 'Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
