import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { load } from '@cashfreepayments/cashfree-js'; // ✅ NEW
import {
  RiHeartLine, RiHeartFill, RiBookmarkLine, RiBookmarkFill,
  RiEditLine, RiDeleteBinLine, RiMapPinLine, RiPhoneLine,
  RiMailLine, RiCalendarLine, RiEyeLine, RiArrowLeftLine,
  RiMessage2Line, RiStarLine, RiShoppingCartLine // ✅ NEW icon
} from 'react-icons/ri';

const CONDITION_COLOR = { New: 'text-green-400', 'Like New': 'text-emerald-400', Good: 'text-blue-400', Fair: 'text-yellow-400', Poor: 'text-red-400' };

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [msgModal, setMsgModal] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false); // ✅ NEW

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then(({ data }) => {
        setListing(data.listing);
        setLiked(data.listing.likes?.includes(user?._id));
        setLikeCount(data.listing.likes?.length || 0);
        setBookmarked(user?.bookmarks?.includes?.(id) || false);
      })
      .catch(() => toast.error('Listing not found'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { toast.error('Please log in'); return; }
    try {
      const { data } = await API.post(`/listings/${id}/like`);
      setLiked(data.liked); setLikeCount(data.likes);
    } catch { toast.error('Failed'); }
  };

  const handleBookmark = async () => {
    if (!user) { toast.error('Please log in'); return; }
    try {
      await API.post(`/users/bookmark/${id}`);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Bookmarked!');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await API.delete(`/listings/${id}`);
      toast.success('Listing deleted');
      navigate('/dashboard');
    } catch { toast.error('Failed to delete'); }
  };

  const handleSendMessage = async () => {
    if (!msgContent.trim()) { toast.error('Message cannot be empty'); return; }
    setMsgLoading(true);
    try {
      await API.post('/messages', { listingId: id, content: msgContent });
      toast.success('Message sent!');
      setMsgModal(false);
      setMsgContent('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally { setMsgLoading(false); }
  };

  // ✅ NEW — Buy Now handler
  const handleBuyNow = async () => {
    if (!user) { toast.error('Please log in'); return; }
    setPayLoading(true);
    try {
      // Step 1: Create order on backend
      const { data } = await API.post('/cashfree/create-order', { listingId: id });

      if (!data.success) {
        toast.error(data.message || 'Failed to create order');
        return;
      }

      // Step 2: Save listingId so PaymentSuccess page can verify
      localStorage.setItem('pendingListingId', id);

      // Step 3: Load Cashfree SDK and open payment
      const cashfree = await load({ mode: 'sandbox' });

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self',
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return (
    <div className="page-container">
      <div className="grid md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square skeleton rounded-2xl" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-6 skeleton rounded" style={{ width: `${80 - i * 10}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="page-container text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-bold text-white mb-2">Listing not found</h2>
      <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-4"><RiArrowLeftLine /> Back to Home</Link>
    </div>
  );

  const isOwner = user?._id === listing.owner?._id;
  const imgs = listing.images?.length > 0 ? listing.images : [];
  const getImgUrl = (img) => img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`;

  return (
    <div className="page-container">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm">
        <RiArrowLeftLine /> Back to listings
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-card border border-surface-border">
            {imgs.length > 0 ? (
              <img src={getImgUrl(imgs[activeImg])} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {listing.category === 'Books' ? '📚' : listing.category === 'Lab Equipment' ? '🔬' : '📦'}
              </div>
            )}
          </div>
          {imgs.length > 1 && (
            <div className="flex gap-2">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-brand-500' : 'border-surface-border'}`}>
                  <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {/* Status + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge ${listing.type === 'Rent' ? 'badge-rent' : listing.type === 'Sell' ? 'badge-sell' : 'badge-share'}`}>
              {listing.type}
            </span>
            <span className="badge bg-surface-hover text-gray-300 border border-surface-border">{listing.category}</span>
            {listing.condition && (
              <span className={`text-sm font-medium ${CONDITION_COLOR[listing.condition]}`}>
                <RiStarLine className="inline mr-1" />{listing.condition}
              </span>
            )}
            {listing.status === 'pending' && <span className="badge badge-pending">Pending Approval</span>}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{listing.title}</h1>
            {listing.type !== 'Share' ? (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-brand-400">₹{listing.price?.toLocaleString()}</span>
                {listing.priceUnit && listing.priceUnit !== 'fixed' && (
                  <span className="text-gray-500">{listing.priceUnit}</span>
                )}
              </div>
            ) : (
              <span className="text-2xl font-bold text-brand-400">Free / Share</span>
            )}
          </div>

          <p className="text-gray-400 leading-relaxed">{listing.description}</p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {listing.location && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RiMapPinLine className="text-brand-400 flex-shrink-0" /> {listing.location}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RiCalendarLine className="text-brand-400 flex-shrink-0" />
              {new Date(listing.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RiEyeLine className="text-brand-400 flex-shrink-0" /> {listing.views} views
            </div>
          </div>

          {/* Tags */}
          {listing.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-surface-hover text-gray-400 text-xs border border-surface-border">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Owner card */}
          <div className="card p-4 !hover:transform-none">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Listed by</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold">
                {listing.owner?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{listing.owner?.name}</p>
                {listing.owner?.college && <p className="text-xs text-gray-500">{listing.owner.college}</p>}
              </div>
            </div>
            {user && (listing.contactPreference === 'email' || listing.contactPreference === 'both') && listing.owner?.email && (
              <a href={`mailto:${listing.owner.email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 mt-3 transition-colors">
                <RiMailLine /> {listing.owner.email}
              </a>
            )}
            {user && (listing.contactPreference === 'phone' || listing.contactPreference === 'both') && listing.owner?.phone && (
              <a href={`tel:${listing.owner.phone}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-400 mt-2 transition-colors">
                <RiPhoneLine /> {listing.owner.phone}
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            {isOwner ? (
              <>
                <Link to={`/edit-listing/${listing._id}`} className="btn-secondary flex items-center gap-2 flex-1">
                  <RiEditLine /> Edit Listing
                </Link>
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium text-sm">
                  <RiDeleteBinLine /> Delete
                </button>
              </>
            ) : user ? (
              <>
                {/* ✅ NEW — Buy Now button (only for Sell/Rent type) */}
                {(listing.type === 'Sell' || listing.type === 'Rent') && listing.status !== 'sold' && (
                  <button
                    onClick={handleBuyNow}
                    disabled={payLoading}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-60"
                  >
                    {payLoading
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <RiShoppingCartLine />
                    }
                    {payLoading ? 'Processing...' : `Buy Now ₹${listing.price?.toLocaleString()}`}
                  </button>
                )}

                {listing.status === 'sold' && (
                  <div className="flex-1 text-center py-2.5 rounded-xl bg-gray-500/10 text-gray-500 border border-gray-500/20 font-medium text-sm">
                    Sold Out
                  </div>
                )}

                <button onClick={() => setMsgModal(true)} className="btn-secondary flex items-center gap-2 flex-1">
                  <RiMessage2Line /> Contact Owner
                </button>
                <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${liked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-surface-border text-gray-400 hover:border-red-500/30 hover:text-red-400'}`}>
                  {liked ? <RiHeartFill /> : <RiHeartLine />} {likeCount}
                </button>
                <button onClick={handleBookmark} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${bookmarked ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'border-surface-border text-gray-400 hover:border-brand-500/30 hover:text-brand-400'}`}>
                  {bookmarked ? <RiBookmarkFill /> : <RiBookmarkLine />}
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2 flex-1 justify-center">
                Sign in to contact
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {msgModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setMsgModal(false)}>
          <div className="card p-6 w-full max-w-md animate-fade-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Send a Message</h3>
            <p className="text-gray-500 text-sm mb-4">About: <span className="text-gray-300">{listing.title}</span></p>
            <textarea
              value={msgContent} onChange={e => setMsgContent(e.target.value)}
              placeholder="Hi! I'm interested in this item..."
              rows={4} className="input resize-none mb-4"
              maxLength={500}
            />
            <p className="text-xs text-gray-600 mb-4 text-right">{msgContent.length}/500</p>
            <div className="flex gap-3">
              <button onClick={() => setMsgModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSendMessage} disabled={msgLoading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                {msgLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RiMessage2Line />}
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}