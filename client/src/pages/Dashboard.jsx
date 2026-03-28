import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  RiAddCircleLine, RiEditLine, RiDeleteBinLine,
  RiEyeLine, RiHeartLine, RiTimeLine, RiCheckLine, RiCloseLine
} from 'react-icons/ri';

const STATUS_BADGE = {
  pending: 'badge-pending',
  approved: 'badge-approved',
  rejected: 'badge-rejected',
  sold: 'bg-gray-800 text-gray-400 border border-gray-700',
};

const STATUS_ICON = {
  pending: <RiTimeLine />,
  approved: <RiCheckLine />,
  rejected: <RiCloseLine />,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    API.get('/listings/my')
      .then(({ data }) => setListings(data.listings))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await API.delete(`/listings/${id}`);
      setListings(listings.filter(l => l._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = listings.filter(l => activeTab === 'all' || l.status === activeTab);
  const counts = {
    all: listings.length,
    approved: listings.filter(l => l.status === 'approved').length,
    pending: listings.filter(l => l.status === 'pending').length,
    rejected: listings.filter(l => l.status === 'rejected').length,
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <Link to="/add-listing" className="btn-primary flex items-center gap-2">
          <RiAddCircleLine /> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: counts.all, color: 'text-white' },
          { label: 'Live', value: counts.approved, color: 'text-green-400' },
          { label: 'Pending', value: counts.pending, color: 'text-yellow-400' },
          { label: 'Rejected', value: counts.rejected, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="card p-4 !hover:transform-none">
            <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Profile card */}
      <div className="card p-5 mb-8 !hover:transform-none">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xl">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {user?.college && <p className="text-gray-600 text-xs mt-0.5">{user.college}</p>}
          </div>
          <div className="ml-auto">
            <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {user?.role === 'admin' ? '👑 Admin' : '🎓 Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div>
        <div className="flex items-center gap-1 border-b border-surface-border mb-6">
          {Object.entries(counts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
                activeTab === key
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {key} <span className="ml-1 text-xs text-gray-600">({count})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="text-lg font-semibold text-white mb-2">No {activeTab !== 'all' ? activeTab : ''} listings</h3>
            <p className="text-gray-500 text-sm mb-5">Start sharing your resources with fellow students</p>
            <Link to="/add-listing" className="btn-primary inline-flex items-center gap-2">
              <RiAddCircleLine /> Add First Listing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(listing => {
              const img = listing.images?.[0]?.url;
              const imgUrl = img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : null;
              return (
                <div key={listing._id} className="card p-4 flex items-center gap-4 !hover:transform-none">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-hover flex-shrink-0 border border-surface-border">
                    {imgUrl
                      ? <img src={imgUrl} alt={listing.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-semibold text-white text-sm truncate">{listing.title}</h3>
                      <span className={`badge text-xs ${STATUS_BADGE[listing.status] || ''}`}>
                        {STATUS_ICON[listing.status]} {listing.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className={`badge ${listing.type === 'Rent' ? 'badge-rent' : listing.type === 'Sell' ? 'badge-sell' : 'badge-share'} text-xs`}>
                        {listing.type}
                      </span>
                      {listing.type !== 'Share' && <span className="text-brand-400 font-medium">₹{listing.price?.toLocaleString()}</span>}
                      <span className="flex items-center gap-1"><RiEyeLine /> {listing.views}</span>
                      <span className="flex items-center gap-1"><RiHeartLine /> {listing.likes?.length || 0}</span>
                      <span>{new Date(listing.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/listings/${listing._id}`} className="p-2 text-gray-400 hover:text-white hover:bg-surface-hover rounded-lg transition-colors">
                      <RiEyeLine />
                    </Link>
                    <Link to={`/edit-listing/${listing._id}`} className="p-2 text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors">
                      <RiEditLine />
                    </Link>
                    <button onClick={() => handleDelete(listing._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
