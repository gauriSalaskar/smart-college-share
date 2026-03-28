import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import {
  RiSearchLine, RiFilter3Line, RiAddCircleLine,
  RiBookLine, RiFlaskLine, RiPlugLine, RiComputerLine,
  RiPencilLine, RiInboxLine
} from 'react-icons/ri';

const CATEGORIES = ['All', 'Books', 'Lab Equipment', 'Appliances', 'Electronics', 'Stationery', 'Others'];
const TYPES = ['All', 'Rent', 'Sell', 'Share'];
const SORTS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Viewed' },
];
const CAT_ICONS = {
  Books: <RiBookLine />, 'Lab Equipment': <RiFlaskLine />,
  Appliances: <RiPlugLine />, Electronics: <RiComputerLine />,
  Stationery: <RiPencilLine />, Others: <RiInboxLine />,
};

export default function Home() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort });
      if (category !== 'All') params.append('category', category);
      if (type !== 'All') params.append('type', type);
      if (search) params.append('search', search);
      const { data } = await API.get(`/listings?${params}`);
      setListings(data.listings);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, category, type, sort, search]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat) => { setCategory(cat); setPage(1); };
  const handleTypeChange = (t) => { setType(t); setPage(1); };

  return (
    <div className="noise">
      {/* Hero */}
      <div className="relative grid-bg border-b border-surface-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              College Resource Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Share, Rent & Sell<br />
              <span className="text-brand-400 text-glow">Campus Resources</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Connect with fellow students to trade books, equipment, and appliances. Save money, reduce waste, build community.
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
              <div className="relative flex-1">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder="Search books, equipment, appliances..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="input pl-11"
                />
              </div>
              <button type="submit" className="btn-primary px-6">Search</button>
            </form>
            {!user && (
              <p className="mt-4 text-sm text-gray-500">
                <Link to="/signup" className="text-brand-400 hover:underline">Create a free account</Link> to list your items
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-surface-border bg-surface-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6 overflow-x-auto">
          {CATEGORIES.slice(1).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors ${category === cat ? 'text-brand-400 font-medium' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {CAT_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Type filter */}
          <div className="flex items-center gap-1 bg-surface-card border border-surface-border rounded-xl p-1">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${type === t ? 'bg-brand-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${category === cat ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'border-surface-border text-gray-500 hover:text-gray-300 hover:border-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="input py-2 text-sm w-auto bg-surface-card"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {user && (
              <Link to="/add-listing" className="btn-primary text-sm flex items-center gap-2 whitespace-nowrap">
                <RiAddCircleLine /> List Item
              </Link>
            )}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-5">
            {pagination.total > 0
              ? `Showing ${listings.length} of ${pagination.total} listings${search ? ` for "${search}"` : ''}`
              : 'No listings found'}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No listings found</h3>
            <p className="text-gray-500 mb-6">
              {search ? `No results for "${search}"` : 'Be the first to list something!'}
            </p>
            {user && (
              <Link to="/add-listing" className="btn-primary inline-flex items-center gap-2">
                <RiAddCircleLine /> Add First Listing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing, i) => (
              <div key={listing._id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} pages={pagination.pages || 1} onPageChange={setPage} />
      </div>
    </div>
  );
}
