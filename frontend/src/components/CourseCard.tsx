import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import type { Course } from '../types';

interface Props {
  course: Course;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full group border border-gray-100/50">
      {/* Thumbnail Area */}
      <div className="relative h-[150px] w-full overflow-hidden bg-gray-50">
        <img 
          src={`/${course.image}`} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-3 right-3 z-20 flex flex-col items-start gap-2">
          <div className="bg-white/95 backdrop-blur-md text-[#16c66c] px-3 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(22,198,108,0.15)] border border-white flex items-center gap-1">
            <span className="text-[15px] font-black">{course.price}</span>
            <span className="text-[10px] font-bold text-gray-500 mt-0.5">ريال</span>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-2.5 py-1 rounded-lg shadow-[0_4px_10px_rgba(16,185,129,0.3)] flex items-center gap-1.5 border border-emerald-300/30">
            <Award size={12} className="text-emerald-100" strokeWidth={2.5} />
            <span className="text-[11px] font-bold">اكسب {Math.floor(Number(course.price) / 10)} نقطة</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 pt-5 flex flex-col flex-1 text-right">
        <h4 className="text-[16px] font-black text-[#16c66c] mb-3 leading-tight relative pb-3">
          {course.title}
          <div className="absolute bottom-0 right-0 w-10 h-[2px] bg-[#16c66c] group-hover:w-full transition-all duration-500"></div>
        </h4>
        <p className="text-gray-400 text-[12px] leading-relaxed flex-1 mb-4 line-clamp-2 font-bold opacity-80">
          {course.description}
        </p>
        <Link 
          to={`/courses/${course.ID}`} 
          className="mt-auto inline-flex items-center justify-center bg-[#141b24] text-white text-[12px] font-black px-6 py-2.5 rounded-lg hover:bg-[#16c66c] transition-all duration-300 w-full md:w-max shadow-md shadow-emerald-900/10"
        >
          تفاصيل الدورة
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
