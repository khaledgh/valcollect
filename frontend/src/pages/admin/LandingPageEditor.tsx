import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createLandingPage,
  updateLandingPage,
  getLandingPages,
  uploadLandingPageImage
} from '../../api/client';
import {
  FileText,
  Globe,
  Image as ImageIcon,
  ArrowLeft,
  Loader2,
  Save,
  TrendingUp,
  Plus
} from 'lucide-react';
import type { LandingPage } from '../../types';

const LandingPageEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<LandingPage>>({
    title: '',
    slug: '',
    description: '',
    content: '',
    status: 'active',
    meta_title: '',
    meta_description: '',
    keywords: '',
    image: '',
    mobile_image: '',
    image_alt: '',
    og_image: ''
  });

  useEffect(() => {
    if (id) {
      // Find the specific page from the list (simpler than adding a GetByID admin endpoint right now)
      getLandingPages().then(res => {
        const page = res.data.find((p: LandingPage) => p.ID === parseInt(id));
        if (page) setFormData(page);
        setLoading(false);
      }).catch(() => {
        alert('Failed to load page');
        navigate('/admin');
      });
    }
  }, [id, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (id) {
        await updateLandingPage(parseInt(id), formData);
      } else {
        await createLandingPage(formData);
      }
      navigate('/admin'); // Navigate back to dashboard (which shows the list)
    } catch (err) {
      alert('Error saving landing page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(field);
    try {
      const res = await uploadLandingPageImage(file);
      setFormData(prev => ({ ...prev, [field]: res.data.url }));
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(null);
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] admin-ltr">
        <Loader2 className="animate-spin text-[#16c66c]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] p-4 md:p-8 admin-ltr font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-all mb-2 font-semibold text-sm"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {id ? 'Edit' : 'Create New'} Landing Page
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#16c66c] hover:bg-[#7a00e0] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {id ? 'Update Page' : 'Save Page'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Main Grid: Info & SEO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Basic Info Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="text-[#16c66c]" size={20} />
                <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Page Title *</label>
                  <input 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#16c66c] outline-none transition-all font-semibold text-gray-800"
                    placeholder="e.g. Technical Analysis Summer Offer"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">URL Slug *</label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-4 py-4 rounded-l-2xl border border-r-0 border-gray-100 text-gray-400 font-mono text-sm">/landing/</span>
                    <input 
                      required
                      className="flex-grow p-4 bg-gray-50 border border-gray-100 rounded-r-2xl focus:border-[#16c66c] outline-none font-mono text-sm"
                      placeholder="summer-offer"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Short Description</label>
                  <textarea 
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#16c66c] outline-none resize-none font-medium text-gray-600"
                    placeholder="Brief intro for the hero section..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
                  <div className="flex gap-4">
                    {['active', 'draft'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, status: s as any})}
                        className={`flex-1 p-3 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                          formData.status === s 
                          ? 'bg-emerald-50 border-[#16c66c] text-[#16c66c]' 
                          : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="text-emerald-500" size={20} />
                <h2 className="text-lg font-bold text-gray-800">SEO Settings</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Meta Title</label>
                  <input 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-emerald-500 outline-none transition-all"
                    placeholder="Optimal: 50-60 characters"
                    value={formData.meta_title}
                    onChange={e => setFormData({...formData, meta_title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Meta Description</label>
                  <textarea 
                    rows={5}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-emerald-500 outline-none resize-none"
                    placeholder="Optimal: 150-160 characters"
                    value={formData.meta_description}
                    onChange={e => setFormData({...formData, meta_description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Keywords</label>
                  <input 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-emerald-500 outline-none transition-all"
                    placeholder="keyword1, keyword2, keyword3"
                    value={formData.keywords}
                    onChange={e => setFormData({...formData, keywords: e.target.value})}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* HTML Content Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-amber-500" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Page Content (HTML)</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4 font-bold uppercase tracking-widest">Full HTML for the section below the hero area</p>
            <textarea 
              rows={12}
              className="w-full p-6 bg-gray-900 text-amber-300 font-mono text-sm border-0 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          {/* Hero Images Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="text-blue-500" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Responsive Visuals</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Desktop Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700">Desktop Image (1920x1080)</h3>
                  {formData.image && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Uploaded</span>}
                </div>
                
                {formData.image ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 group">
                    <img src={getImageUrl(formData.image)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <label className="p-3 bg-white text-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 transition-all font-bold text-xs uppercase tracking-widest">Replace</label>
                       <button type="button" onClick={() => setFormData({...formData, image: ''})} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold text-xs uppercase tracking-widest">Remove</button>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'image')} />
                  </div>
                ) : (
                  <label className="block aspect-video bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all group">
                    <div className="h-full flex flex-col items-center justify-center">
                      {isUploading === 'image' ? <Loader2 className="animate-spin text-blue-500" /> : <><Plus className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" /><span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Upload Desktop</span></>}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'image')} />
                  </label>
                )}
              </div>

              {/* Mobile Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700">Mobile Image (1080x1920)</h3>
                  {formData.mobile_image && <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Uploaded</span>}
                </div>

                {formData.mobile_image ? (
                  <div className="relative aspect-[9/16] h-[300px] mx-auto rounded-2xl overflow-hidden border border-gray-100 group">
                    <img src={getImageUrl(formData.mobile_image)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <label className="p-3 bg-white text-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 transition-all font-bold text-xs uppercase tracking-widest">Replace</label>
                       <button type="button" onClick={() => setFormData({...formData, mobile_image: ''})} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold text-xs uppercase tracking-widest">Remove</button>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'mobile_image')} />
                  </div>
                ) : (
                  <label className="block aspect-[9/16] h-[300px] mx-auto bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-all group">
                    <div className="h-full flex flex-col items-center justify-center">
                      {isUploading === 'mobile_image' ? <Loader2 className="animate-spin text-emerald-500" /> : <><Plus className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" /><span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Upload Mobile</span></>}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'mobile_image')} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandingPageEditor;
