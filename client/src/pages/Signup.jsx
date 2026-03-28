import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { RiMailLine, RiLockLine, RiUserLine, RiPhoneLine, RiBuilding2Line, RiEyeLine, RiEyeOffLine, RiGraduationCapLine } from 'react-icons/ri';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', college: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await signup(form);
      toast.success(`Welcome to CampusShare, ${data.user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ icon: Icon, name, type = 'text', placeholder, required }) => (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type={type} name={name} value={form[name]} onChange={handleChange}
        placeholder={placeholder} required={required} className="input pl-11"
      />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 grid-bg">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 glow-green mb-4">
            <RiGraduationCapLine className="text-brand-400 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Join CampusShare</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your free student account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <Field icon={RiUserLine} name="name" placeholder="Your full name" required />
            </div>
            <div>
              <label className="label">College Email *</label>
              <Field icon={RiMailLine} name="email" type="email" placeholder="you@college.edu" required />
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min. 6 characters" required className="input pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Phone Number</label>
              <Field icon={RiPhoneLine} name="phone" type="tel" placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="label">College / University</label>
              <Field icon={RiBuilding2Line} name="college" placeholder="Your college name" />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-border text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
