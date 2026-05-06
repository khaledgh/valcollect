import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/client';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      localStorage.setItem('valcollect_token', res.data.token);
      localStorage.setItem('valcollect_user', JSON.stringify(res.data.user));
      navigate('/admin');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-ltr min-h-screen bg-gradient-to-br from-[#141b24] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#16c66c] to-[#141b24] rounded-2xl shadow-lg shadow-emerald-500/30 mb-4">
            <Lock className="text-white" size={28} />
          </div>
          <h1 className="text-white text-2xl font-black">Valcollect Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your platform</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 rounded-xl outline-none focus:border-[#16c66c] focus:ring-1 focus:ring-[#16c66c]/50 transition-all placeholder:text-gray-600"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 rounded-xl outline-none focus:border-[#16c66c] focus:ring-1 focus:ring-[#16c66c]/50 transition-all placeholder:text-gray-600"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#16c66c] to-[#141b24] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>

          <p className="text-gray-600 text-xs text-center mt-4">
            Protected area آ· Valcollect آ© {new Date().getFullYear()}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
