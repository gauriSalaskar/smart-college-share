import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiMenuLine, RiCloseLine, RiAddCircleLine, RiDashboardLine,
  RiLogoutCircleLine, RiShieldLine, RiBookmarkLine, RiMessage2Line,
  RiGraduationCapLine
} from 'react-icons/ri';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
    setDropOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center glow-green">
              <RiGraduationCapLine className="text-white text-lg" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Campus<span className="text-brand-400">Share</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={({isActive}) => `btn-ghost text-sm ${isActive ? 'text-white bg-surface-hover' : ''}`}>
              Browse
            </NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" className={({isActive}) => `btn-ghost text-sm ${isActive ? 'text-white bg-surface-hover' : ''}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/messages" className={({isActive}) => `btn-ghost text-sm ${isActive ? 'text-white bg-surface-hover' : ''}`}>
                  Messages
                </NavLink>
                <NavLink to="/bookmarks" className={({isActive}) => `btn-ghost text-sm ${isActive ? 'text-white bg-surface-hover' : ''}`}>
                  Bookmarks
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={({isActive}) => `btn-ghost text-sm text-brand-400 ${isActive ? 'bg-surface-hover' : ''}`}>
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/add-listing" className="btn-primary text-sm flex items-center gap-2">
                  <RiAddCircleLine className="text-base" /> List Item
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-xl px-3 py-2 hover:border-brand-500/50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-sm">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 max-w-[100px] truncate">{user.name}</span>
                  </button>
                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 card border border-surface-border shadow-xl py-1 z-50">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <RiLogoutCircleLine /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden btn-ghost p-2">
            {open ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-surface-border py-4 space-y-1 animate-fade-in">
            <NavLink to="/" end onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-surface-hover hover:text-white text-sm transition-colors">
              Browse
            </NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-surface-hover hover:text-white text-sm transition-colors">
                  <RiDashboardLine /> Dashboard
                </NavLink>
                <NavLink to="/messages" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-surface-hover hover:text-white text-sm transition-colors">
                  <RiMessage2Line /> Messages
                </NavLink>
                <NavLink to="/bookmarks" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-surface-hover hover:text-white text-sm transition-colors">
                  <RiBookmarkLine /> Bookmarks
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-brand-400 hover:bg-surface-hover text-sm transition-colors">
                    <RiShieldLine /> Admin Panel
                  </NavLink>
                )}
                <Link to="/add-listing" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-brand-500/10 text-brand-400 text-sm">
                  <RiAddCircleLine /> List an Item
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-colors">
                  <RiLogoutCircleLine /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm flex-1 text-center">Sign In</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary text-sm flex-1 text-center">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
