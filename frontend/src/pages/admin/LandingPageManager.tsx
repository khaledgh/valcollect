import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getLandingPages,
  deleteLandingPage,
} from '../../api/client';
import {
  Search, 
  RefreshCcw, 
  Plus, 
  Trash2, 
  TrendingUp, 
  FileText,
  Clock,
  ExternalLink,
  Edit3
} from 'lucide-react';
import type { LandingPage } from '../../types';

const LandingPageManager: React.FC = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await getLandingPages();
      setPages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this page?')) {
      await deleteLandingPage(id);
      fetchPages();
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Reduced Header Size */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Landing Pages</h2>
          <p className="text-xs text-gray-500">Manage marketing campaigns</p>
        </div>
        <button 
          onClick={() => navigate('/admin/landing-pages/new')}
          className="flex items-center gap-1.5 bg-[#16c66c] hover:bg-[#7a00e0] text-white px-4 py-2 rounded-xl font-bold shadow-md shadow-emerald-100 transition-all active:scale-95 text-xs"
        >
          <Plus size={16} /> New Page
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-grow">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Search pages..." 
              className="w-full pr-10 pl-3 py-2 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-[#16c66c] outline-none transition-all text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchPages}
            className="p-2 text-gray-400 hover:text-[#16c66c] hover:bg-emerald-50 rounded-lg transition-all"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-bold">Details</th>
                <th className="px-6 py-3 font-bold">Slug</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold">Views</th>
                <th className="px-6 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPages.map(page => (
                <tr key={page.ID} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {page.image ? (
                        <img src={getImageUrl(page.image)} className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0" />
                      ) : (
                        <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-300 shrink-0">
                          <FileText size={14} />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-800 text-xs truncate max-w-[200px]">{page.title}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {new Date(page.CreatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <code className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 font-mono">/{page.slug}</code>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      page.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {page.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-xs text-gray-600">
                    <div className="flex items-center justify-end gap-1.5">
                      <TrendingUp size={12} className="text-emerald-500" />
                      {page.views}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={`/landing/${page.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Live"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button 
                        onClick={() => navigate(`/admin/landing-pages/edit/${page.ID}`)}
                        className="p-1.5 text-gray-400 hover:text-[#16c66c] hover:bg-emerald-50 rounded-lg transition-all"
                        title="Edit Page"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(page.ID)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-300 text-xs font-semibold uppercase tracking-widest">
                    No landing pages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LandingPageManager;
