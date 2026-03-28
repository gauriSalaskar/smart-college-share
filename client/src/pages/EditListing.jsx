import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { RiUploadCloud2Line, RiCloseLine, RiSaveLine } from 'react-icons/ri';

const CATEGORIES = ['Books', 'Lab Equipment', 'Appliances', 'Electronics', 'Stationery', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const PRICE_UNITS = ['fixed', 'per day', 'per week', 'per month'];

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Books', type: 'Sell',
    price: '', priceUnit: 'fixed', condition: 'Good',
    location: '', contactPreference: 'email', tags: '',
  });

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then(({ data }) => {
        const l = data.listing;
        setForm({
          title: l.title || '', description: l.description || '',
          category: l.category || 'Books', type: l.type || 'Sell',
          price: l.price || '', priceUnit: l.priceUnit || 'fixed',
          condition: l.condition || 'Good', location: l.location || '',
          contactPreference: l.contactPreference || 'email',
          tags: l.tags?.join(', ') || '',
        });
        if (l.images?.length > 0) {
          setPreviews(l.images.map(img => img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`));
        }
      })
      .catch(() => { toast.error('Listing not found'); navigate('/dashboard'); })
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 4);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));
      await API.put(`/listings/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Listing updated!');
      navigate(`/listings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="page-container"><div className="h-8 skeleton rounded w-1/3 mb-4" /><div className="card p-8 space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-10 skeleton rounded" />)}</div></div>;

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Edit Listing</h1>
        <p className="text-gray-500 text-sm">Update your resource details</p>
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
                </div>
              ))}
              <button type="button" onClick={() => fileRef.current.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500/50 flex flex-col items-center justify-center text-gray-500 hover:text-brand-400 transition-colors">
                <RiUploadCloud2Line className="text-2xl mb-1" />
                <span className="text-xs">Replace</span>
              </button>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </div>

          <div>
            <label className="label">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type</label>
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

          {form.type !== 'Share' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₹)</label>
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">Price Unit</label>
                <select name="priceUnit" value={form.priceUnit} onChange={handleChange} className="input">
                  {PRICE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="input" />
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

          <div>
            <label className="label">Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} className="input" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiSaveLine />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
