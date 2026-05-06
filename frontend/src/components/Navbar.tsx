import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, Phone, Info, Home, Menu, X, Clock } from 'lucide-react';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: 'home', label: 'الرئيسية', icon: <Home size={16} /> },
    { to: 'courses', label: 'الدورات', icon: <BookOpen size={16} /> },
    { to: 'teachers', label: 'المدربون', icon: <Users size={16} /> },
    { to: 'about', label: 'حولنا', icon: <Info size={16} /> },
    { to: 'contact', label: 'اتصل بنا', icon: <Phone size={16} /> },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    setMobileOpen(false);
    if (pathname !== '/') {
      return;
    }

    e.preventDefault();
    const element = document.getElementById(to);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Bar with Phone Numbers */}
      <div className="bg-brand-secondary text-white py-2 px-4 font-[Cairo]" dir="rtl">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 md:gap-6 text-xs">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Phone size={14} className="shrink-0" />
            <a href="tel:+97317502723" className="hover:text-brand-primary transition-colors" dir="ltr">+973 1750 2723</a>
            <span className="text-white/40">|</span>
            <a href="tel:+966569654748" className="hover:text-brand-primary transition-colors" dir="ltr">+966 56 9654748</a>
          </div>
          <div className="flex items-center gap-1.5 text-white/80">
            <Clock size={14} className="shrink-0" />
            <span>الأحد - الخميس: 9:00 ص - 8:00 م</span>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm font-[Cairo]" dir="rtl">
        <div className="container mx-auto flex justify-between items-center px-4 h-20 md:h-[85px]">
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={(e) => handleNavClick(e, 'home')}>
            <img src="/images/logo.png" alt="Valcollect" className="h-12 md:h-10 object-contain transition-all duration-300" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 h-full">
            {navLinks.map(link => (
              <a
                key={link.to}
                href={pathname === '/' ? `#${link.to}` : `/#${link.to}`}
                onClick={(e) => handleNavClick(e, link.to)}
                className={`flex items-center h-full px-4 text-[14px] font-bold transition-all duration-300 relative border-b-[3px] gap-2 ${pathname === '/' && link.to === 'home'
                  ? 'text-brand-primary border-brand-primary'
                  : 'text-gray-600 border-transparent hover:text-brand-primary'
                  }`}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-6 animate-fade-in-up">
            {navLinks.map(link => (
              <a
                key={link.to}
                href={pathname === '/' ? `#${link.to}` : `/#${link.to}`}
                onClick={(e) => handleNavClick(e, link.to)}
                className="flex items-center gap-3 p-4 rounded-xl my-1 font-bold transition-colors text-gray-600 hover:bg-gray-50 hover:text-brand-primary"
              >
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
