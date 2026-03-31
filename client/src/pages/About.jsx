import { Link } from 'react-router-dom';
import { RiGraduationCapLine, RiTeamLine, RiShieldCheckLine, RiLeafLine, RiAddCircleLine } from 'react-icons/ri';

const STATS = [
  { value: '500+', label: 'Active Students' },
  { value: '1000+', label: 'Listings Posted' },
  { value: '6', label: 'Categories' },
  { value: '₹50K+', label: 'Student Savings' },
];

const VALUES = [
  { icon: <RiTeamLine className="text-2xl" />, title: 'Community First', desc: 'Built for students, by students. We believe in the power of sharing within a campus community.' },
  { icon: <RiShieldCheckLine className="text-2xl" />, title: 'Trust & Safety', desc: 'Every listing is reviewed by admins before going live. Your safety is our top priority.' },
  { icon: <RiLeafLine className="text-2xl" />, title: 'Sustainability', desc: 'By reusing resources, we reduce waste and promote a greener, more sustainable campus culture.' },
  { icon: <RiGraduationCapLine className="text-2xl" />, title: 'Student Savings', desc: 'We help students save thousands of rupees every semester by connecting them with affordable resources.' },
];

const CATEGORIES = [
  { icon: '📚', name: 'Books', desc: 'Textbooks, reference books, novels' },
  { icon: '🔬', name: 'Lab Equipment', desc: 'Multimeters, oscilloscopes, kits' },
  { icon: '🔌', name: 'Appliances', desc: 'Fans, kettles, irons, lamps' },
  { icon: '💻', name: 'Electronics', desc: 'Calculators, keyboards, cables' },
  { icon: '✏️', name: 'Stationery', desc: 'Drawing tools, geometry sets' },
  { icon: '📦', name: 'Others', desc: 'Anything else useful for students' },
];

export default function About() {
  return (
    <div className="noise">
      {/* Hero */}
      <div className="relative grid-bg border-b border-surface-border py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 glow-green mb-6">
            <RiGraduationCapLine className="text-brand-400 text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-brand-400">CampusShare</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A smart marketplace built exclusively for college students to rent, sell, and share academic and hostel resources — saving money and reducing waste, one listing at a time.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-surface-border bg-surface-card/50">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-brand-400 mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Every semester, college students spend thousands of rupees on books, lab equipment, and appliances that are used for just a few months. After the semester ends, these resources collect dust in hostel rooms.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              <b className="text-white">CampusShare</b> was created to solve this problem. We provide a trusted, campus-exclusive platform where students can easily list, discover, and transact resources — saving money and building a collaborative campus culture.
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <RiAddCircleLine /> Browse Listings
            </Link>
          </div>
          <div className="card p-6 space-y-4 !hover:transform-none">
            <h3 className="font-semibold text-white">The Problem We Solve</h3>
            {[
              'Students spend ₹5,000–₹15,000/semester on resources used once',
              'No trusted platform for campus peer-to-peer transactions',
              'Informal WhatsApp groups are inefficient and unsafe',
              "New students don't know who has resources to share",
            ].map((pt, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-gray-400 text-sm">{pt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(val => (
              <div key={val.title} className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-3">
                  {val.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{val.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What You Can Share</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="card p-4 flex items-center gap-4 !hover:transform-none">
                <div className="text-3xl">{cat.icon}</div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                  <p className="text-gray-500 text-xs">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your free student account with your college email in under 2 minutes.' },
              { step: '02', title: 'List or Browse', desc: 'Post your unused resources or browse listings from fellow students on campus.' },
              { step: '03', title: 'Connect & Transact', desc: 'Message the owner, make a secure payment, and collect your resource on campus.' },
            ].map(s => (
              <div key={s.step} className="card p-6 text-center">
                <div className="text-4xl font-bold text-brand-500/30 mb-3">{s.step}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Built by */}
        <div className="card p-8 text-center !hover:transform-none">
          <h2 className="text-xl font-bold text-white mb-3">Built For Students, By a Student</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto mb-4">
            CampusShare was developed as a mini project by <b className="text-white">Gauri Salaskar</b>, a Computer Engineering student, under the guidance of <b className="text-white">Prof. Vijila. G</b>. Built with React.js, Node.js, MongoDB, and deployed on Vercel + Render.
          </p>
          <p className="text-gray-600 text-sm">© 2025 CampusShare. All rights reserved.</p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Saving?</h2>
          <p className="text-gray-500 mb-6">Join hundreds of students already using CampusShare</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary">Create Free Account</Link>
            <Link to="/" className="btn-secondary">Browse Listings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}