import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiGraduationCapLine } from 'react-icons/ri';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 grid-bg">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 glow-green mb-4">
            <RiGraduationCapLine className="text-brand-400 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your CampusShare account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@college.edu" required
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPwd ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" required
                  className="input pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-border text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Create one free</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl bg-surface-hover border border-surface-border">
            <p className="text-xs text-gray-500 font-medium mb-2">Demo credentials</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Admin: <code className="text-brand-400">admin@college.edu</code> / <code className="text-brand-400">admin123</code></p>
              <p>Student: <code className="text-brand-400">student@college.edu</code> / <code className="text-brand-400">student123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
