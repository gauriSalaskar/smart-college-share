import { useState, useEffect } from 'react';
import API from '../utils/api';
import ListingCard from '../components/ListingCard';
import SkeletonCard from '../components/SkeletonCard';
import toast from 'react-hot-toast';
import { RiBookmarkLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/bookmarks')
      .then(({ data }) => setBookmarks(data.bookmarks))
      .catch(() => toast.error('Failed to load bookmarks'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <RiBookmarkLine className="text-brand-400" /> Bookmarks
        </h1>
        <p className="text-gray-500 text-sm mt-1">Items you've saved for later</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 mb-6">Save listings you're interested in to find them quickly</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">Browse Listings</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {bookmarks.map((listing, i) => listing && (
            <div key={listing._id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
