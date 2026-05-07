import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getCourses, submitContact, getInstructors } from '../api/client';
import type { Course, Instructor } from '../types';
import CourseCard from '../components/CourseCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, Users, Award, Mail, Phone, MapPin, Send, Quote, ChevronLeft, ChevronRight, X, Trophy, Globe, GraduationCap, Loader2, CheckCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  subject: z.string().min(3, 'الموضوع قصير جداً'),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
});
type ContactForm = z.infer<typeof contactSchema>;

const heroSlides = [
  { img: '/images/banners/new/first-banner.jpg', title: 'تعلّم ← اجمع نقاط ← احصل على دورات متقدمة ', subtitle: 'كل دورة تسجّل فيها تمنحك فرصة كسب نقاط', desc: 'استخدمها للالتحاق بدورات متقدمة، وطوّر مهاراتك للتقدّم في السلم الوظيفي والوصول إلى مناصب أعلى.' },
  { img: '/images/banners/new/seond-banner.png', title: 'ورش عمل وندوات تفاعلية يقودها خبراء محليون', subtitle: 'سجّل في ندوات وورش عمل حضورية', desc: 'واحصل على شهادات معتمدة لتعزيز مسيرتك المهنية وتمكين تطورك' },
];

const galleryImages = [
  'Riyadh3.jpg', 'jeddah2.jpg', 'jeddah3.jpg', 'khobar2.jpg',
  'khobar3.jpg', 'riyadh2.JPG', '5_4A9NmE2.jpeg', 'I-ftjafm2.jpeg',
];

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const coursesRef = React.useRef<HTMLDivElement>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onContactSubmit = async (data: ContactForm) => {
    setContactLoading(true);
    try {
      await submitContact(data);
      setContactSent(true);
      reset();
      setTimeout(() => setContactSent(false), 5000);
    } catch { alert('حدث خطأ. يرجى المحاولة لاحقاً.'); }
    finally { setContactLoading(false); }
  };

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes] = await Promise.all([
          getCourses(),
          getInstructors()
        ]);
        setCourses(coursesRes.data);
        setInstructors(teachersRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle hash scrolling on mount or location change
  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, location.hash]);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollCourses = useCallback((dir: number) => {
    if (coursesRef.current) {
      const container = coursesRef.current;
      const scrollAmount = window.innerWidth < 768 ? container.clientWidth * 0.8 : container.clientWidth;
      container.scrollBy({ left: -dir * scrollAmount, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="bg-white font-[Cairo]" dir="rtl">

      {/* ===== HERO CAROUSEL ===== */}
      <section className="relative h-[500px] md:h-[650px] lg:h-[700px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={slide.img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/40 to-black/20" />
          </div>
        ))}
        <div className="absolute inset-0 z-20 container mx-auto px-4 md:px-6 flex items-center text-right">
          <div className="w-full max-w-2xl animate-fade-in-right">
            <h1 className="text-white font-black text-2xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight mb-3 md:mb-4">{heroSlides[heroIdx].title}</h1>
            <div className="bg-[#16c66c]/90 border-r-[5px] border-white text-white px-4 md:px-6 py-2 md:py-2.5 mb-3 md:mb-4 rounded-sm max-w-full">
              <h2 className="font-semibold text-sm sm:text-base md:text-xl lg:text-2xl leading-snug">{heroSlides[heroIdx].subtitle}</h2>
            </div>
            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-lg">{heroSlides[heroIdx].desc}</p>
          </div>
        </div>
        {/* Dots */}
        <div className="absolute bottom-8 z-20 w-full flex justify-center gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} className={`w-3 h-3 rounded-full transition-all ${i === heroIdx ? 'bg-[#16c66c] w-8' : 'bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <SectionTitle main="نبذة" sub="عن Valcollect" />
          <div className="grid md:grid-cols-2 gap-8 items-center mt-8">
            <div className="order-2 md:order-1 text-right">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-[#16c66c]">تعلّم، اكسب، وتقدّم</h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  من خلال Valcollect، يمكنك التسجيل في دورات تعليمية معتمدة ومتنوعة، حضورية وعبر الإنترنت، مقدّمة عبر مراكز تدريب متطورة من الجيل الجديد منتشرة في مختلف أنحاء المنطقة، ومصممة بعناية لتلبية متطلبات سوق العمل الحديث وتعزيز الكفاءات المهنية.
                </p>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  يقود هذه الدورات فريق من الخبراء والمتخصصين ذوي الخبرة العملية، مع تركيز قوي على مهارات تطبيقية تمكّنك من التميز، تطوير قدراتك، والتقدم بثقة نحو مستويات أعلى في مسيرتك المهنية.
                </p>
                <p className="text-gray-900 font-bold text-base md:text-lg leading-relaxed mt-4">
                  ومع كل دورة تسجل فيها، تجمع نقاطك عبر Valcollect، لتقودك إلى دورات متقدّمة مما يساعدك على تطوير مهاراتك بشكل مستمر، ورفع مستواك المهني، والتدرّج بثقة في السلم الوظيفي نحو تحقيق مسار مهني أكثر نجاحاً وتميّزاً.
                </p>
              </div>

            </div>
            <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden shadow-lg h-[280px] md:h-[420px]">
              <img src="/images/photo_2026-04-02_13-31-03.jpg" alt="نبذة عنا" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="container mx-auto text-right">
          <SectionTitle main="لماذا" sub="تختارنا؟" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <ServiceBox icon={<BookOpen size={36} />} title="دورات عملية متخصصة" desc="نقدّم دورات عملية مصممة لتطوير مهاراتك وتعزيز خبراتك، مع محتوى حديث يركز على التطبيق العملي لمساعدتك على تأمين مستقبلك المهني." />
            <ServiceBox icon={<Users size={36} />} title="مدربون معتمدون" desc="نضم نخبة من المدربين المعتمدين من مختلف أنحاء المنطقة، يتمتعون بخبرات عملية وخلفيات متنوعة، ويقدّمان المعرفة والأدوات اللازمة لارتقاء مهاراتك ومعرفتك إلى المستوى التالي وتحقيق التميز في مجالك." />
            <ServiceBox icon={<Award size={36} />} title="شهادة معتمدة" desc="شهادة معتمدة عند إتمام دوراتنا بنجاح، تعكس المهارات والمعرفة التي اكتسبتها وتُعزّز فرصك لتحقيق التميز والتقدم في مسيرتك المهنية." />
          </div>
        </div>
      </section>

      {/* ===== COURSES CAROUSEL ===== */}
      <section id="courses" className="py-12 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10 text-right">
            <SectionTitle main="دوراتنا" sub="الأكثر طلباً" />
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scrollCourses(-1)}
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#16c66c] hover:text-[#16c66c] transition-all shadow-sm"
              >
                <ChevronRight size={22} />
              </button>
              <button
                onClick={() => scrollCourses(1)}
                className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#16c66c] hover:text-[#16c66c] transition-all shadow-sm"
              >
                <ChevronLeft size={22} />
              </button>
            </div>
          </div>
          <div
            ref={coursesRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 px-1 -mx-1 no-scrollbar pt-2"
          >
            {courses.map(course => (
              <div key={course.ID} className="w-[82%] sm:w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)] flex-shrink-0 snap-start">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {/* Mobile scroll hint */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            <button onClick={() => scrollCourses(-1)} className="w-10 h-10 rounded-full border flex items-center justify-center"><ChevronRight size={18} /></button>
            <button onClick={() => scrollCourses(1)} className="w-10 h-10 rounded-full border flex items-center justify-center"><ChevronLeft size={18} /></button>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-[#16c66c] via-[#141b24] to-[#16c66c] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#16c66c]/10 rounded-full blur-3xl -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#16c66c]/10 rounded-full blur-3xl -mr-48 -mb-48"></div>

        <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center relative z-10">
          <Funfact icon={<Trophy size={36} className="text-white" />} number="25" text="جائزة تميز" suffix="+" />
          <Funfact icon={<Globe size={36} className="text-white" />} number="10" text="مراكز تدريب" suffix="" />
          <Funfact icon={<GraduationCap size={36} className="text-white" />} number="20" text="عاماً من الخبرة" suffix="+" />
          <Funfact icon={<Users size={36} className="text-white" />} number="25000" text="طالب متخرج" suffix="+" />
        </div>
      </section>

      {/* ===== GALLERY WITH LIGHTBOX ===== */}
      <section id="gallery" className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="container mx-auto text-right">
          <SectionTitle main="معرض" sub="الصور" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-8">
            {galleryImages.map((img, i) => (
              <div key={i} onClick={() => setLightboxIdx(i)} className="group cursor-pointer overflow-hidden rounded-xl h-[180px] md:h-[240px] lg:h-[280px] shadow-sm relative">
                <img src={`/images/gallery/${img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="معرض الصور" />
                <div className="absolute inset-0 bg-[#16c66c]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-[#16c66c] font-black text-xl">+</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox with Navigation */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxIdx(null)}>
          <button className="absolute top-6 left-6 text-white bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors z-50" onClick={() => setLightboxIdx(null)}><X size={28} /></button>

          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-all z-50"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(prev => prev! === 0 ? galleryImages.length - 1 : prev! - 1) }}>
            <ChevronLeft size={36} />
          </button>

          <img src={`/images/gallery/${galleryImages[lightboxIdx]}`} alt="عرض الصورة" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()} />

          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-all z-50"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(prev => (prev! + 1) % galleryImages.length) }}>
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md">
            {lightboxIdx + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 md:py-24 px-4 bg-white overflow-hidden">
        <div className="container mx-auto text-right">
          <SectionTitle main="شهادات" sub="العملاء" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            <TestimonialCard name="أحمد السلطان" role="مدير مبيعات" text="تجربة رائعة مع Valcollect. الدورات عملية جداً والمدربون لديهم خبرة واقعية جعلت التعلم ممتعاً ومفيداً." />
            <TestimonialCard name="سارة خالد" role="مصممة تدريب" text="المحتوى حديث ويواكب تطلعات السوق. الشهادة المعتمدة ساعدتني كثيراً في ترقية مساري الوظيفي." />
            <TestimonialCard name="محمد العتيبي" role="رجل أعمال" text="استفدت من دورة الإدارة المالية. الأساليب المقدمة ساعدتني في تنظيم مواردي في مشروعي الخاص." />
          </div>
        </div>
      </section>

      {/* ===== TEACHERS SECTION ===== */}
      <section id="teachers" className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#16c66c]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#16c66c]/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        <div className="container mx-auto relative z-10 text-right">
          <div className="text-center mb-10">
            <SectionTitle main="نخبة" sub="من مدربينا" />
            <p className="text-gray-600 mt-5 max-w-2xl mx-auto text-base">نفتخر بوجود نخبة من الخبراء والمتخصصين الذين يقودون العملية التعليمية في المعهد بخبرة واقعية مشهود لها.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((teacher) => (
              <TeacherCard key={teacher.ID} instructor={teacher} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto text-right">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <SectionTitle main="تواصل" sub="معنا" />
              <p className="text-gray-500 mt-6 mb-8 leading-relaxed">يسعدنا سماع استفساراتكم. فريقنا متاح للإجابة على جميع أسئلتكم ومساعدتكم في اختيار المسار التعليمي الأنسب.</p>
              <div className="space-y-6">
                <ContactInfo icon={<Phone className="text-[#16c66c]" size={20} />} label="اتصل بنا" value={
                  <div className="space-y-1">
                    <div dir="ltr">+973 1750 2723</div>
                    <div dir="ltr">+966 56 9654748</div>
                  </div>
                } />
                <ContactInfo icon={<Mail className="text-[#16c66c]" size={20} />} label="البريد الإلكتروني" value="info@valcollect.com" />
                <ContactInfo icon={<MapPin className="text-[#16c66c]" size={20} />} label="البحرين" value="ضاحية السيف، شارع 3621، مجمع رقم 436، مبنى رقم 1025، مكتب رقم 50، المنامة" />
                <ContactInfo icon={<MapPin className="text-[#16c66c]" size={20} />} label="السعودية" value="5058، طريق الأمير محمد بن عبدالعزيز، حي السليمانية، الرياض، 12243-7061" />
              </div>
            </div>
            <form onSubmit={handleSubmit(onContactSubmit)} className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_rgba(22,198,108,0.08)] border border-gray-100 space-y-5">
              {contactSent && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold">
                  <CheckCircle size={18} /> تم إرسال رسالتك بنجاح!
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <input {...register('name')} type="text" placeholder="الاسم" className={`w-full bg-gray-50 border p-4 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('email')} type="email" placeholder="البريد الإلكتروني" className={`w-full bg-gray-50 border p-4 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <input {...register('subject')} type="text" placeholder="الموضوع" className={`w-full bg-gray-50 border p-4 rounded-xl focus:border-[#16c66c] outline-none transition-all ${errors.subject ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <textarea {...register('message')} rows={4} placeholder="رسالتك..." className={`w-full bg-gray-50 border p-4 rounded-xl focus:border-[#16c66c] outline-none transition-all resize-none ${errors.message ? 'border-red-400' : 'border-gray-200'}`}></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={contactLoading} className="w-full bg-gradient-to-r from-[#16c66c] to-[#141b24] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                {contactLoading ? <Loader2 size={20} className="animate-spin" /> : <><span>إرسال الرسالة</span> <Send size={18} /></>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ===== REUSABLE COMPONENTS ===== */

const SectionTitle = ({ main, sub }: { main: string, sub: string }) => (
  <div className="relative pb-3 inline-block text-right">
    <h2 className="text-xl md:text-[28px] font-black text-[#16c66c] leading-tight flex items-center gap-3">
      {main} <span className="text-[#16c66c] font-black">{sub}</span>
    </h2>
    <div className="absolute bottom-0 right-0 w-20 h-1 bg-[#16c66c] rounded-full"></div>
  </div>
);

const ServiceBox = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 group text-right">
    <div className="w-16 h-16 rounded-xl bg-emerald-50 flex justify-center items-center mb-6 text-[#16c66c] group-hover:bg-[#16c66c] group-hover:text-white transition-all">{icon}</div>
    <h4 className="text-xl font-bold mb-3 text-[#16c66c]">{title}</h4>
    <p className="text-[#666666] leading-relaxed text-sm">{desc}</p>
  </div>
);

const Funfact = ({ icon, number, suffix, text }: { icon: React.ReactNode, number: string, suffix: string, text: string }) => (
  <div className="p-3 md:p-4 flex flex-col items-center group hover:scale-105 transition-transform duration-300">
    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 md:mb-4 group-hover:bg-white/20 transition-all duration-300">
      {icon}
    </div>
    <div className="flex items-baseline gap-1" style={{ direction: 'ltr' }}>
      <h2 className="text-white text-3xl md:text-4xl font-black leading-none">{number}</h2>
      {suffix && <span className="text-[#16c66c] text-xl md:text-2xl font-black">{suffix}</span>}
    </div>
    <p className="text-white/90 text-xs md:text-sm font-semibold mt-2 tracking-wide">{text}</p>
  </div>
);

const TeacherCard = ({ instructor }: { instructor: Instructor }) => (
  <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100 text-right">
    <div className="relative w-full aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
      <img
        src={`/${instructor.image}`}
        alt={instructor.name}
        className="w-full h-full object-contains group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-5 text-center relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#16c66c] to-[#141b24] rounded-full flex items-center justify-center shadow-lg">
        <Award className="text-white" size={24} />
      </div>
      <h4 className="text-lg font-bold text-[#16c66c] mt-4 mb-2 leading-snug group-hover:text-[#16c66c] transition-colors">{instructor.name}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{instructor.speciality}</p>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, text }: { name: string, role: string, text: string }) => (
  <div className="bg-gray-50 p-8 rounded-2xl relative group hover:bg-[#16c66c] transition-all duration-500 hover:-translate-y-1 text-right">
    <Quote className="absolute top-6 left-6 text-gray-200 group-hover:text-white/10 transition-colors" size={48} />
    <p className="text-gray-600 group-hover:text-white/90 leading-relaxed relative z-10 mb-6 italic text-sm">"{text}"</p>
    <div className="flex items-center gap-3 relative z-10">
      <div className="w-11 h-11 bg-[#16c66c] rounded-full flex items-center justify-center text-white font-bold">{name[0]}</div>
      <div>
        <h5 className="font-bold text-sm text-[#16c66c] group-hover:text-white">{name}</h5>
        <span className="text-xs text-gray-400 group-hover:text-white/50">{role}</span>
      </div>
    </div>
  </div>
);

const ContactInfo = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
  <div className="flex items-start gap-4 group text-right">
    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-[#16c66c] group-hover:[&_*]:text-white transition-all">{icon}</div>
    <div><span className="block text-gray-400 text-xs mb-0.5">{label}</span><span className="block text-[#16c66c] font-bold">{value}</span></div>
  </div>
);

export default Home;
