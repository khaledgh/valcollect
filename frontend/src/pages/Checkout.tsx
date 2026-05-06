import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse } from '../api/client';
import type { Course } from '../types';
import { ShoppingCart, CreditCard, User, Mail, Phone, MapPin, Calendar, Clock, CheckCircle, ChevronRight, Loader2, AlertCircle, Trophy } from 'lucide-react';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: 'السعودية',
    paymentMethod: 'bank_transfer',
  });

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    const fetchCourse = async () => {
      try {
        const res = await getCourse(id);
        setCourse(res.data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    setTimeout(() => {
      alert('تم استلام طلبك بنجاح! سيتواصل معك فريقنا قريباً لإتمام عملية الدفع.');
      setProcessing(false);
      navigate('/');
    }, 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 font-[Cairo]" dir="rtl">
      <div className="w-14 h-14 border-4 border-gray-200 border-t-[#16c66c] rounded-full animate-spin"></div>
      <p className="text-lg font-bold text-gray-400 text-center">جاري التحميل...</p>
    </div>
  );

  if (!course) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-[Cairo]" dir="rtl">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#16c66c] to-[#141b24] pt-16 md:pt-20 pb-12 md:pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/50 font-bold mb-6">
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ChevronRight size={14} className="rotate-180 opacity-50" />
            <Link to={`/courses/${course.ID}`} className="hover:text-white transition-colors">{course.title}</Link>
            <ChevronRight size={14} className="rotate-180 opacity-50" />
            <span className="text-white">الدفع</span>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-black flex items-center gap-3">
            <ShoppingCart size={32} />
            إتمام عملية الشراء
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8 md:mt-12 text-right">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#16c66c] to-[#141b24] px-6 py-4">
                <h2 className="text-white text-xl font-black flex items-center gap-2">
                  <User size={22} />
                  بيانات التواصل
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكامل"
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#16c66c]/20 focus:border-[#16c66c] outline-none transition-all"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">البريد الإلكتروني *</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        required
                        placeholder="example@email.com"
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 pr-12 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#16c66c]/20 focus:border-[#16c66c] outline-none transition-all"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">رقم الهاتف *</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        required
                        placeholder="+966 XX XXX XXXX"
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 pr-12 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#16c66c]/20 focus:border-[#16c66c] outline-none transition-all"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm">المدينة *</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        required
                        placeholder="الرياض، جدة، الدمام..."
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 pr-12 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#16c66c]/20 focus:border-[#16c66c] outline-none transition-all"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">الدولة *</label>
                  <select
                    required
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#16c66c]/20 focus:border-[#16c66c] outline-none transition-all"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="السعودية">السعودية</option>
                    <option value="البحرين">البحرين</option>
                    <option value="الإمارات">الإمارات</option>
                    <option value="الكويت">الكويت</option>
                    <option value="قطر">قطر</option>
                    <option value="عمان">عمان</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#16c66c] to-[#141b24] px-6 py-4">
                <h2 className="text-white text-xl font-black flex items-center gap-2">
                  <CreditCard size={22} />
                  طريقة الدفع
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <label className="flex items-start gap-4 p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#16c66c] transition-all bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="mt-1 w-5 h-5 text-[#16c66c] focus:ring-[#16c66c]"
                  />
                  <div className="flex-1">
                    <div className="font-black text-gray-800 mb-1">تحويل بنكي</div>
                    <p className="text-xs text-gray-500 font-semibold">سيتم إرسال تفاصيل الحساب البنكي عبر البريد الإلكتروني</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#16c66c] transition-all bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                    className="mt-1 w-5 h-5 text-[#16c66c] focus:ring-[#16c66c]"
                  />
                  <div className="flex-1">
                    <div className="font-black text-gray-800 mb-1">الدفع النقدي</div>
                    <p className="text-xs text-gray-500 font-semibold">الدفع عند استلام الشهادة أو في مركز التدريب</p>
                  </div>
                </label>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-blue-800 font-bold leading-relaxed">
                    بعد إتمام الطلب، سيتواصل معك أحد مستشارينا خلال 24 ساعة لتأكيد التفاصيل وإرشادك بخطوات الدفع.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-[#16c66c] to-[#141b24] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 hover:shadow-emerald-500/50 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <CheckCircle size={24} />
                  إتمام الطلب
                </>
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden text-right">
              <div className="bg-gradient-to-br from-[#16c66c] to-[#141b24] px-6 py-4">
                <h2 className="text-white text-xl font-black">ملخص الطلب</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex gap-4">
                  <img 
                    src={`/${course.image}`} 
                    alt={course.title} 
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-black text-gray-800 text-base leading-snug mb-2">{course.title}</h3>
                    <p className="text-xs text-gray-500 font-semibold">رمز الدورة: {course.course_code || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="text-[#16c66c]" size={18} />
                    <span className="text-gray-600 font-semibold">المدة:</span>
                    <span className="font-black text-gray-800">{course.duration}</span>
                  </div>
                  {course.session_duration && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="text-[#16c66c]" size={18} />
                      <span className="text-gray-600 font-semibold">مدة الجلسة:</span>
                      <span className="font-black text-gray-800">{course.session_duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="text-[#16c66c]" size={18} />
                    <span className="text-gray-600 font-semibold">الشهادة:</span>
                    <span className="font-black text-gray-800">معتمدة دولياً</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bold">السعر الأساسي</span>
                    <span className="font-black text-gray-800">{course.price} ريال</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bold">الضريبة</span>
                    <span className="font-black text-gray-800">0 ريال</span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-black text-lg">الإجمالي</span>
                    <div className="text-left">
                      <div className="text-3xl font-black text-[#16c66c]">{course.price}</div>
                      <div className="text-sm text-gray-500 font-bold">ريال سعودي</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600 shrink-0" size={20} />
                    <p className="text-xs text-green-800 font-bold">
                      شهادة معتمدة دولياً عند إتمام الدورة
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="text-emerald-600 shrink-0" size={20} />
                    <p className="text-xs text-emerald-800 font-bold">
                      ستحصل على {Math.floor(Number(course.price) / 10)} نقطة عند الاشتراك
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
