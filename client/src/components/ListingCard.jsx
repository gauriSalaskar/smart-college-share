import { Link } from 'react-router-dom';
import { RiHeartLine, RiHeartFill, RiMapPinLine, RiEyeLine, RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = {
  Books: '📚', 'Lab Equipment': '🔬', Appliances: '🔌',
  Electronics: '💻', Stationery: '✏️', Others: '📦',
};

export default function ListingCard({ listing, onLikeToggle }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(listing.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(listing.likes?.length || 0);
  const [bookmarked, setBookmarked] = useState(
    user?.bookmarks?.includes?.(listing._id) || false
  );

  const img = listing.images?.[0]?.url
    ? listing.images[0].url.startsWith('http')
      ? listing.images[0].url
      : `http://localhost:5000${listing.images[0].url}`
    : null;

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please log in to like listings'); return; }
    try {
      const { data } = await API.post(`/listings/${listing._id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes);
      if (onLikeToggle) onLikeToggle(listing._id, data);
    } catch { toast.error('Failed to update like'); }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please log in to bookmark'); return; }
    try {
      await API.post(`/users/bookmark/${listing._id}`);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked!');
    } catch { toast.error('Failed to update bookmark'); }
  };

  return (
    <Link to={`/listings/${listing._id}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-hover overflow-hidden">
        {img ? (
          <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {CATEGORY_ICONS[listing.category] || '📦'}
          </div>
        )}
        {/* Type badge */}
        <span className={`badge absolute top-3 left-3 ${listing.type === 'Rent' ? 'badge-rent' : listing.type === 'Sell' ? 'badge-sell' : 'badge-share'}`}>
          {listing.type}
        </span>
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={handleBookmark} className="w-8 h-8 rounded-lg bg-surface/80 backdrop-blur flex items-center justify-center text-gray-300 hover:text-brand-400 transition-colors">
            {bookmarked ? <RiBookmarkFill className="text-brand-400" /> : <RiBookmarkLine />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 flex-1">
            {listing.title}
          </h3>
          {listing.type !== 'Share' && (
            <span className="text-brand-400 font-bold text-sm whitespace-nowrap">
              ₹{listing.price?.toLocaleString()}
              {listing.priceUnit && listing.priceUnit !== 'fixed' && (
                <span className="text-xs text-gray-500 font-normal">/{listing.priceUnit.replace('per ', '')}</span>
              )}
            </span>
          )}
          {listing.type === 'Share' && <span className="text-brand-400 font-bold text-sm">Free</span>}
        </div>

        <span className="inline-flex items-center gap-1 text-xs text-gray-500 mb-3">
          {CATEGORY_ICONS[listing.category]} {listing.category}
        </span>

        {listing.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <RiMapPinLine /> {listing.location}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-surface-border">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
              {listing.owner?.name?.[0]?.toUpperCase()}
            </div>
            <span className="truncate max-w-[80px]">{listing.owner?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <RiEyeLine /> {listing.views || 0}
            </span>
            <button onClick={handleLike} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors">
              {liked ? <RiHeartFill className="text-red-400" /> : <RiHeartLine />}
              {likeCount}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
