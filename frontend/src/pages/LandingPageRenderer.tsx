import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getLandingPageBySlug, submitLead } from '../api/client';
import type { LandingPage } from '../types';
import { Loader2, CheckCircle, AlertCircle, MapPin, Phone, Mail, Send } from 'lucide-react';

const leadSchema = z.object({
  first_name: z.string().min(2, 'ط§ظ„ط§ط³ظ… ظ…ط·ظ„ظˆط¨'),
  last_name: z.string().min(2, 'ط§ط³ظ… ط§ظ„ط¹ط§ط¦ظ„ط© ظ…ط·ظ„ظˆط¨'),
  email: z.string().email('ط¨ط±ظٹط¯ ط¥ظ„ظƒطھط±ظˆظ†ظٹ ط؛ظٹط± طµط­ظٹط­'),
  phone: z.string().min(8, 'ط±ظ‚ظ… ط§ظ„ط¬ظˆط§ظ„ ظ…ط·ظ„ظˆط¨'),
  country: z.string().min(2, 'ط§ظ„ط¯ظˆظ„ط© ظ…ط·ظ„ظˆط¨ط©'),
  city: z.string().min(2, 'ط§ظ„ظ…ط¯ظٹظ†ط© ظ…ط·ظ„ظˆط¨ط©'),
});

type LeadForm = z.infer<typeof leadSchema>;

const LandingPageRenderer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  });

  useEffect(() => {
    if (slug) {
      getLandingPageBySlug(slug)
        .then(res => setPage(res.data))
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const onSubmit = async (data: LeadForm) => {
    setSubmitLoading(true);
    try {
      await submitLead({
        ...data,
        landing_page_id: page?.ID,
        source: new URLSearchParams(window.location.search).get('source') || 'Direct',
      });
      setSubmitted(true);
      reset();
    } catch (err) {
      alert('ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط¥ط±ط³ط§ظ„. ظٹط±ط¬ظ‰ ط§ظ„ظ…ط­ط§ظˆظ„ط© ظ…ط±ط© ط£ط®ط±ظ‰.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#16c66c]" size={40} />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">طµظپط­ط© ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط©</h1>
        <p className="text-gray-600">ط¹ط°ط±ط§ظ‹طŒ ط§ظ„طµظپط­ط© ط§ظ„طھظٹ طھط¨ط­ط« ط¹ظ†ظ‡ط§ ط؛ظٹط± ظ…طھظˆظپط±ط© ط­ط§ظ„ظٹط§ظ‹.</p>
        <a href="/" className="mt-6 text-[#16c66c] font-semibold hover:underline">ط§ظ„ط¹ظˆط¯ط© ظ„ظ„ط±ط¦ظٹط³ظٹط©</a>
      </div>
    );
  }

  // Handle responsive image logic
  const heroImage = (window.innerWidth <= 768 && page.mobile_image) 
    ? (page.mobile_image.startsWith('http') ? page.mobile_image : `http://localhost:8080${page.mobile_image}`)
    : (page.image?.startsWith('http') ? page.image : `http://localhost:8080${page.image}`);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        <meta name="description" content={page.meta_description || page.description} />
        {page.keywords && <meta name="keywords" content={page.keywords} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={page.meta_title || page.title} />
        <meta property="og:description" content={page.meta_description || page.description} />
        {page.og_image && <meta property="og:image" content={page.og_image.startsWith('http') ? page.og_image : `http://localhost:8080${page.og_image}`} />}
        
        {/* Twitter */}
        <meta name="twitter:title" content={page.meta_title || page.title} />
        <meta name="twitter:description" content={page.meta_description || page.description} />
        {page.og_image && <meta name="twitter:image" content={page.og_image.startsWith('http') ? page.og_image : `http://localhost:8080${page.og_image}`} />}
      </Helmet>

      {/* Modern Split Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Side: Modern Form */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-[0_20px_50px_rgba(139,0,255,0.12)] border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#16c66c] to-[#141b24] p-8 text-white text-center">
                  <h2 className="text-3xl font-bold mb-2">ط³ط¬ظ„ ط§ظ„ط¢ظ†</h2>
                  <p className="opacity-90">ط§ظ…ظ„ط£ ط§ظ„ط¨ظٹط§ظ†ط§طھ ظ„ظ†ظ‚ظˆظ… ط¨ط§ظ„طھظˆط§طµظ„ ظ…ط¹ظƒ ظپظٹ ط£ظ‚ط±ط¨ ظˆظ‚طھ</p>
                </div>

                <div className="p-8">
                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">طھظ… ط§ظ„ط¥ط±ط³ط§ظ„ ط¨ظ†ط¬ط§ط­!</h3>
                      <p className="text-gray-600">ط´ظƒط±ط§ظ‹ ظ„ط§ظ‡طھظ…ط§ظ…ظƒطŒ ط³ظٹظ‚ظˆظ… ظپط±ظٹظ‚ظ†ط§ ط¨ط§ظ„طھظˆط§طµظ„ ظ…ط¹ظƒ ظ‚ط±ظٹط¨ط§ظ‹.</p>
                      <button 
                        onClick={() => setSubmitted(false)}
                        className="mt-8 text-[#16c66c] font-semibold hover:underline"
                      >
                        ط¥ط±ط³ط§ظ„ ط·ظ„ط¨ ط¢ط®ط±
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 leading-none">ط§ظ„ط§ط³ظ… ط§ظ„ط£ظˆظ„</label>
                          <input {...register('first_name')} className={`w-full bg-gray-50 border p-3 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.first_name ? 'border-red-400' : 'border-gray-200'}`} />
                          {errors.first_name && <span className="text-red-500 text-xs">{errors.first_name.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 leading-none">ط§ط³ظ… ط§ظ„ط¹ط§ط¦ظ„ط©</label>
                          <input {...register('last_name')} className={`w-full bg-gray-50 border p-3 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.last_name ? 'border-red-400' : 'border-gray-200'}`} />
                          {errors.last_name && <span className="text-red-500 text-xs">{errors.last_name.message}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 leading-none">ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ</label>
                        <input {...register('email')} type="email" placeholder="example@email.com" className={`w-full bg-gray-50 border p-3 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 leading-none">ط±ظ‚ظ… ط§ظ„ط¬ظˆط§ظ„</label>
                        <input {...register('phone')} placeholder="+966 5XX XXX XXXX" className={`w-full bg-gray-50 border p-3 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} />
                        {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 leading-none">ط§ظ„ط¯ظˆظ„ط©</label>
                          <input {...register('country')} className={`w-full bg-gray-50 border p-3 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.country ? 'border-red-400' : 'border-gray-200'}`} />
                          {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 leading-none">ط§ظ„ظ…ط¯ظٹظ†ط©</label>
                          <input {...register('city')} className={`w-full bg-gray-50 border p-3 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.city ? 'border-red-400' : 'border-gray-200'}`} />
                          {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={submitLoading}
                        className="w-full bg-gradient-to-r from-[#16c66c] to-[#141b24] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                      >
                        {submitLoading ? <Loader2 size={24} className="animate-spin" /> : <><span>سجل الآن</span> <Send size={20} /></>}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Hero Image and Content Preview */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative group">
                {page.image ? (
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/10 border-4 border-white">
                    <img 
                      src={heroImage} 
                      alt={page.image_alt || page.title}
                      className="w-full h-auto object-cover transform scale-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-100 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-400">ط§ظ„ط±ط¬ط§ط، ط¥ط¶ط§ظپط© طµظˆط±ط© ط§ظ„طµظپط­ط©</p>
                  </div>
                )}
                
                {/* Decorative Elements */}
                <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-60 animate-pulse" />
                <div className="absolute -z-10 -bottom-10 -left-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse delay-700" />
              </div>

              <div className="mt-12 text-right">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {page.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  {page.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Content Section */}
      {page.content && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div 
              className="prose prose-lg prose-emerald max-w-none rtl"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>
      )}

      {/* Modern Footer for Landing Page */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="h-12" />
              <span className="text-xl font-bold text-gray-900">Valcollect</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-gray-600">
              <div className="flex items-center gap-2"><Phone size={18} className="text-[#16c66c]" /> <span>+973 1750 2723</span></div>
              <div className="flex items-center gap-2"><Mail size={18} className="text-[#16c66c]" /> <span>info@valcollect.com</span></div>
              <div className="flex items-center gap-2"><MapPin size={18} className="text-[#16c66c]" /> <span>البحرين / السعودية</span></div>
            </div>
            
            <p className="text-sm text-gray-400 font-sans leading-none" style={{ direction: 'ltr' }}>
              &copy; {new Date().getFullYear()} Valcollect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageRenderer;
