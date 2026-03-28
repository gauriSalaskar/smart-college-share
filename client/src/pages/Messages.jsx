import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { RiMessage2Line, RiSendPlaneLine, RiInboxLine } from 'react-icons/ri';

export default function Messages() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [tab, setTab] = useState('inbox');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/messages/inbox'), API.get('/messages/sent')])
      .then(([i, s]) => { setInbox(i.data.messages); setSent(s.data.messages); })
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await API.patch(`/messages/${id}/read`);
      setInbox(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch {}
  };

  const messages = tab === 'inbox' ? inbox : sent;
  const unreadCount = inbox.filter(m => !m.read).length;

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <RiMessage2Line className="text-brand-400" /> Messages
        </h1>
      </div>

      <div className="flex gap-1 border-b border-surface-border mb-6">
        <button onClick={() => setTab('inbox')} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2 ${tab === 'inbox' ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
          <RiInboxLine /> Inbox
          {unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">{unreadCount}</span>}
        </button>
        <button onClick={() => setTab('sent')} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-2 ${tab === 'sent' ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
          <RiSendPlaneLine /> Sent
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-white mb-2">No messages</h3>
          <p className="text-gray-500 text-sm">
            {tab === 'inbox' ? "When someone messages you, it'll appear here" : "Messages you've sent will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => {
            const other = tab === 'inbox' ? msg.sender : msg.receiver;
            const listingImg = msg.listing?.images?.[0]?.url;
            const listingImgUrl = listingImg ? (listingImg.startsWith('http') ? listingImg : `http://localhost:5000${listingImg}`) : null;

            return (
              <div
                key={msg._id}
                className={`card p-4 !hover:transform-none cursor-pointer ${tab === 'inbox' && !msg.read ? 'border-brand-500/30 bg-brand-500/5' : ''}`}
                onClick={() => tab === 'inbox' && !msg.read && markRead(msg._id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-sm flex-shrink-0">
                    {other?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-sm">{other?.name}</span>
                      <span className="text-xs text-gray-600">
                        {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    {msg.listing && (
                      <Link to={`/listings/${msg.listing._id}`} className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 mb-1.5" onClick={e => e.stopPropagation()}>
                        {listingImgUrl && <img src={listingImgUrl} alt="" className="w-4 h-4 rounded object-cover" />}
                        Re: {msg.listing.title}
                      </Link>
                    )}
                    <p className="text-gray-400 text-sm">{msg.content}</p>
                  </div>
                  {tab === 'inbox' && !msg.read && (
                    <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
