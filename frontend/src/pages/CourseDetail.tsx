import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse } from '../api/client';
import type { Course } from '../types';
import { Clock, Calendar, CheckCircle, ChevronRight, Share2, Printer, GraduationCap, Trophy } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchCourse = async () => {
      try {
        const res = await getCourse(id);
        setCourse(res.data);
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 font-[Cairo]" dir="rtl">
      <div className="w-14 h-14 border-4 border-gray-200 border-t-[#16c66c] rounded-full animate-spin"></div>
      <p className="text-lg font-bold text-gray-400 text-center">جاري التحميل...</p>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-[Cairo]" dir="rtl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">لم يتم العثور على الدورة</h2>
      <Link to="/" className="text-[#16c66c] font-bold hover:underline">العودة إلى الرئيسية</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 font-[Cairo]" dir="rtl">
      {/* Header */}
      <section className="bg-[#16c66c] pt-16 md:pt-24 pb-14 md:pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-white text-2xl md:text-4xl font-black mb-6 leading-tight">{course.title}</h1>
          <div className="flex flex-wrap gap-2 justify-center items-center text-sm text-white/50 font-bold">
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronRight size={14} className="rotate-180 opacity-50" />
            <span className="text-white/30">الدورات</span>
            <ChevronRight size={14} className="rotate-180 opacity-50" />
            <span className="text-white/80">{course.title}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-10 md:mt-16 text-right">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 md:gap-12 items-start">
          {/* Main Content */}
          <div className="space-y-12">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/5 border border-gray-100">
               <img src={`/${course.image}`} alt={course.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-[#16c66c] shadow-sm uppercase tracking-wider">
                  Valcollect
               </div>
            </div>
            
            {/* Overview Section */}
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-[#16c66c] mb-6 pb-4 border-b-2 border-gray-100 relative after:content-[''] after:absolute after:bottom-[-2px] after:right-0 after:w-24 after:h-[3px] after:bg-[#16c66c]">
                نظرة عامة
              </h3>
              <p className="text-gray-600 text-[16px] md:text-[17px] leading-[2.1] text-justify font-medium">
                {course.overview || course.description}
              </p>
            </div>

            {/* Syllabus Section */}
            {course.syllabus && (
               <div className="bg-[#f8faff] p-8 md:p-10 rounded-3xl border border-blue-100/50 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-[#16c66c] flex items-center justify-center text-white"><CheckCircle size={20}/></div>
                     <h3 className="text-2xl font-black text-[#16c66c]">محتوى الدورة</h3>
                  </div>
                  <ul className="syllabus-list grid sm:grid-cols-2 gap-y-5 gap-x-12" 
                      dangerouslySetInnerHTML={{ 
                        __html: course.syllabus.replace(/<li>/g, '<li class="flex items-start gap-3 text-gray-700 text-[15px] font-bold"><span class="w-2 h-2 rounded-full bg-[#16c66c] mt-2 shrink-0 shadow-[0_0_8px_#16c66c]"></span>') 
                      }} />
               </div>
            )}

            {/* Benefits Section */}
            {course.benefits && (
               <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 overflow-hidden group">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl group-hover:bg-emerald-300/30 transition-all duration-700"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-[#16c66c] mb-5 flex items-center gap-3">
                       <span className="w-1.5 h-8 bg-[#16c66c] rounded-full inline-block"></span>
                       فوائد الدورة
                    </h3>
                    <p className="text-gray-600 text-[16px] leading-[2.1] text-justify italic font-bold">
                       "{course.benefits}"
                    </p>
                  </div>
               </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-28 bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col h-max">
            <div className="bg-gradient-to-br from-[#16c66c] to-[#141b24] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
              <p className="text-white/60 text-xs mb-2 font-black uppercase tracking-[2px]">رسوم الالتحاق</p>
              <div className="text-white font-black text-5xl leading-none flex items-center justify-center gap-2">
                 <span>{course.price}</span>
                 <span className="text-lg text-white/60 font-black uppercase">ريال</span>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <ul className="space-y-4">
                <SidebarRow icon={<CheckCircle size={18} className="text-[#16c66c]"/>} label="رمز الدورة" value={course.course_code || 'N/A'} />
                <SidebarRow icon={<Clock size={18} className="text-[#16c66c]"/>} label="المدة" value={course.duration} />
                {course.session_duration && <SidebarRow icon={<Calendar size={18} className="text-[#16c66c]"/>} label="مدة الجلسة" value={course.session_duration} />}
                <SidebarRow icon={<GraduationCap size={18} className="text-[#16c66c]"/>} label="الشهادة" value="معتمدة دولياً" />
                <SidebarRow icon={<Trophy size={18} className="text-emerald-500"/>} label="نقاط المكتسبة" value={`${Math.floor(Number(course.price) / 10)} نقطة`} />
              </ul>
              
              <Link to={`/checkout/${course.ID}`} className="block w-full bg-gradient-to-br from-[#16c66c] to-[#141b24] text-white py-4 rounded-2xl font-black text-center shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 active:scale-[0.98] transition-all">
                اشترك الآن
              </Link>
              
              <div className="flex items-center justify-center gap-8 border-t border-gray-100 pt-6">
                <button className="flex items-center gap-2 text-gray-400 text-xs font-black hover:text-[#16c66c] transition-colors"><Share2 size={16}/> مشاركة</button>
                <button className="flex items-center gap-2 text-gray-400 text-xs font-black hover:text-[#16c66c] transition-colors"><Printer size={16}/> طباعة</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <li className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-100 last:border-0">
    <div className="flex items-center gap-2 text-gray-500 text-[14px] font-bold">{icon} {label}</div>
    <div className="text-gray-800 font-black text-[14px]">{value}</div>
  </li>
);

export default CourseDetail;
