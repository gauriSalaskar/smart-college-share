import { Link } from 'react-router-dom';
import { RiGraduationCapLine, RiMailLine, RiHeartFill } from 'react-icons/ri';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface-card/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center glow-green">
                <RiGraduationCapLine className="text-white text-lg" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Campus<span className="text-brand-400">Share</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              A smart college resource sharing platform where students can rent, sell, and share books, lab equipment, and hostel appliances.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="mailto:campusshare@college.edu"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-400 transition-colors">
                <RiMailLine /> campusshare@college.edu
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Browse Listings' },
                { to: '/add-listing', label: 'List an Item' },
                { to: '/dashboard', label: 'My Dashboard' },
                { to: '/messages', label: 'Messages' },
                { to: '/about', label: 'About Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-gray-500 hover:text-brand-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/terms', label: 'Terms & Conditions' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/about', label: 'About Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-gray-500 hover:text-brand-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {year} CampusShare. All rights reserved. Unauthorized use or reproduction is prohibited.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Made with <RiHeartFill className="text-red-400 text-xs" /> for college students in India
          </p>
        </div>
      </div>
    </footer>
  );
}