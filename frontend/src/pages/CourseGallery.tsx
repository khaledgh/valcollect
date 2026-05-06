import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/client';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { Search, Filter, BookOpen } from 'lucide-react';

const CourseGallery: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCourses().then(res => { setCourses(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen font-[Cairo]" dir="rtl">
      {/* Header */}
      <section className="bg-white py-14 md:py-24 px-4 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl space-y-8 md:space-y-12">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-[#16c66c] px-5 py-1.5 rounded-full font-bold text-sm">
              المكتبة التعليمية
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#16c66c]">
              استكشف مهاراتك القادمة
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 right-4 flex items-center text-gray-400 group-focus-within:text-[#16c66c] transition-colors">
                <Search size={20} />
              </div>
              <input 
                type="text" placeholder="ابحث عن دورة..." 
                className="w-full bg-gray-50 border border-gray-200 py-4 pr-12 pl-4 rounded-2xl focus:border-[#16c66c] focus:shadow-lg focus:shadow-emerald-500/10 outline-none text-base font-bold transition-all text-right"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white border border-gray-200 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all text-gray-600">
              <Filter size={18} className="text-[#16c66c]" /> تصفية
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#16c66c] rounded-full animate-spin"></div>
              <p className="text-base font-bold text-gray-400">جاري تحميل الدورات...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(course => <CourseCard key={course.ID} course={course} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 space-y-4 bg-white rounded-2xl text-center border max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300"><BookOpen size={36} /></div>
              <h3 className="text-xl font-bold text-gray-800">لا توجد نتائج</h3>
              <p className="text-sm text-gray-500">لم يتم العثور على دورات تطابق بحثك.</p>
              <button onClick={() => setSearchTerm('')} className="text-[#16c66c] font-bold text-sm hover:underline">إعادة ضبط</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CourseGallery;
