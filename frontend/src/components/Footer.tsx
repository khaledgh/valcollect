import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-secondary text-gray-400 pt-16 md:pt-20 pb-6 px-4 font-[Cairo]" dir="rtl">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Col */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <img src="/images/footer-logo.png" alt="Valcollect" className="h-10" />
            <p className="text-sm leading-[1.9] max-w-xs">
              Valcollect - مركز تدريبي متقدم لتمكين المهنيين وتطوير الكوادر البشرية بأفضل الأساليب التعليمية الحديثة.
            </p>
          </div>

          <FooterColumn title="روابط سريعة">
            <FooterLink to="/#home" label="الرئيسية" />
            <FooterLink to="/#courses" label="الدورات التدريبية" />
            <FooterLink to="/#teachers" label="مدربوننا" />
            <FooterLink to="/#about" label="حول المعهد" />
          </FooterColumn>

          <FooterColumn title="تواصل معنا">
            <ContactItem icon={<Phone size={14} />} text={<span dir="ltr">+973 1750 2723</span>} />
            <ContactItem icon={<Phone size={14} />} text={<span dir="ltr">+966 56 9654748</span>} />
            <ContactItem icon={<Mail size={14} />} text="info@at-institute.com" />
            <ContactItem icon={<MapPin size={14} />} text="البحرين - السعودية" />
            <ContactItem icon={<Clock size={14} />} text="الأحد - الخميس: 9:00 ص - 8:00 م" />
          </FooterColumn>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Valcollect. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div>
    <h4 className="text-lg font-bold text-white mb-5 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-0.5 after:bg-white">{title}</h4>
    <ul className="space-y-3">{children}</ul>
  </div>
);

const FooterLink = ({ to, label }: { to: string, label: string }) => (
  <li><Link to={to} className="text-sm hover:text-brand-primary transition-colors">{label}</Link></li>
);

const ContactItem = ({ icon, text }: { icon: React.ReactNode, text: React.ReactNode }) => (
  <div className="flex gap-3 items-center text-sm">
    <span className="text-white">{icon}</span>
    <span>{text}</span>
  </div>
);

export default Footer;
