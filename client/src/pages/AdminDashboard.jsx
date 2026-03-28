import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import {
  RiShieldLine, RiUserLine, RiListCheck, RiCheckLine, RiCloseLine,
  RiEyeLine, RiDeleteBinLine, RiTimeLine, RiGroupLine, RiBarChartLine
} from 'react-icons/ri';

const TABS = ['overview', 'listings', 'users'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'listings') {
      setLoading(true);
      API.get(`/admin/listings?status=${statusFilter}&limit=50`)
        .then(({ data }) => setListings(data.listings))
        .catch(() => toast.error('Failed to load'))
        .finally(() => setLoading(false));
    }
    if (tab === 'users') {
      setLoading(true);
      API.get('/admin/users')
        .then(({ data }) => setUsers(data.users))
        .catch(() => toast.error('Failed to load'))
        .finally(() => setLoading(false));
    }
  }, [tab, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/admin/listings/${id}/status`, { status });
      setListings(prev => prev.map(l => l._id === id ? { ...l, status } : l));
      toast.success(`Listing ${status}`);
    } catch { toast.error('Failed'); }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await API.delete(`/listings/${id}`);
      setListings(prev => prev.filter(l => l._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const toggleUser = async (id) => {
    try {
      const { data } = await API.patch(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? data.user : u));
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <RiShieldLine className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Manage listings, users, and platform health</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-surface-border mb-8">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px flex items-center gap-2 ${
              tab === t ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}>
            {t === 'overview' && <RiBarChartLine />}
            {t === 'listings' && <RiListCheck />}
            {t === 'users' && <RiGroupLine />}
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && stats && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: <RiUserLine />, color: 'text-blue-400' },
              { label: 'Total Listings', value: stats.totalListings, icon: <RiListCheck />, color: 'text-white' },
              { label: 'Pending Review', value: stats.pendingListings, icon: <RiTimeLine />, color: 'text-yellow-400' },
              { label: 'Live Listings', value: stats.approvedListings, icon: <RiCheckLine />, color: 'text-green-400' },
            ].map(s => (
              <div key={s.label} className="card p-5 !hover:transform-none">
                <div className={`text-2xl mb-2 ${s.color}`}>{s.icon}</div>
                <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          {stats.categoryStats?.length > 0 && (
            <div className="card p-6 !hover:transform-none">
              <h2 className="font-semibold text-white mb-4">Listings by Category</h2>
              <div className="space-y-3">
                {stats.categoryStats.map(({ _id, count }) => (
                  <div key={_id} className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-32">{_id}</span>
                    <div className="flex-1 h-2 bg-surface-hover rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${(count / stats.totalListings) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-sm w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.pendingListings > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-yellow-900/20 border border-yellow-800/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-300">
                <RiTimeLine />
                <span className="text-sm font-medium">{stats.pendingListings} listing{stats.pendingListings !== 1 ? 's' : ''} waiting for review</span>
              </div>
              <button onClick={() => { setTab('listings'); setStatusFilter('pending'); }} className="text-xs text-yellow-400 hover:text-yellow-300 underline">
                Review now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Listings */}
      {tab === 'listings' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            {['pending', 'approved', 'rejected', ''].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                  statusFilter === s ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'border-surface-border text-gray-500 hover:text-gray-300'
                }`}>
                {s || 'All'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No {statusFilter} listings found</div>
          ) : (
            <div className="space-y-3">
              {listings.map(listing => {
                const img = listing.images?.[0]?.url;
                const imgUrl = img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : null;
                return (
                  <div key={listing._id} className="card p-4 flex items-center gap-4 !hover:transform-none">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-hover flex-shrink-0">
                      {imgUrl ? <img src={imgUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate mb-1">{listing.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                        <span>{listing.category}</span>
                        <span>•</span>
                        <span>{listing.type}</span>
                        <span>•</span>
                        <span>by <span className="text-gray-400">{listing.owner?.name}</span></span>
                        <span>•</span>
                        <span className={`badge ${
                          listing.status === 'approved' ? 'badge-approved' :
                          listing.status === 'pending' ? 'badge-pending' : 'badge-rejected'
                        }`}>{listing.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link to={`/listings/${listing._id}`} className="p-2 text-gray-400 hover:text-white hover:bg-surface-hover rounded-lg transition-colors">
                        <RiEyeLine />
                      </Link>
                      {listing.status !== 'approved' && (
                        <button onClick={() => updateStatus(listing._id, 'approved')}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="Approve">
                          <RiCheckLine />
                        </button>
                      )}
                      {listing.status !== 'rejected' && (
                        <button onClick={() => updateStatus(listing._id, 'rejected')}
                          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors" title="Reject">
                          <RiCloseLine />
                        </button>
                      )}
                      <button onClick={() => deleteListing(listing._id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="animate-fade-in">
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u._id} className="card p-4 flex items-center gap-4 !hover:transform-none">
                  <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold flex-shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">{u.name}</span>
                      {u.role === 'admin' && <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs">Admin</span>}
                      {!u.isActive && <span className="badge bg-red-900/30 text-red-400 border border-red-800/30 text-xs">Inactive</span>}
                    </div>
                    <p className="text-xs text-gray-500">{u.email} {u.college && `• ${u.college}`}</p>
                  </div>
                  <div className="text-xs text-gray-600">{new Date(u.createdAt).toLocaleDateString('en-IN')}</div>
                  {u.role !== 'admin' && (
                    <button onClick={() => toggleUser(u._id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        u.isActive
                          ? 'text-red-400 border-red-800/30 hover:bg-red-500/10'
                          : 'text-green-400 border-green-800/30 hover:bg-green-500/10'
                      }`}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
