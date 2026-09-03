import React, { useState, useEffect } from 'react';
import { LabInfo } from '../types';
import { 
  Menu, X, Globe, Settings, Sparkles, 
  GraduationCap, BookOpen, Users, Bell, Mail, MapPin, Layers
} from 'lucide-react';

interface NavbarProps {
  lab: LabInfo;
  lang: 'ko' | 'en';
  setLang: (lang: 'ko' | 'en') => void;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  lab, 
  lang, 
  setLang, 
  activePage, 
  onNavigate, 
  onOpenAdmin 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', labelKo: '홈', labelEn: 'Home', icon: Sparkles },
    { id: 'professor', labelKo: '교수소개', labelEn: 'PI', icon: GraduationCap },
    { id: 'research', labelKo: '연구분야', labelEn: 'Research', icon: Layers },
    { id: 'publications', labelKo: '논문실적', labelEn: 'Publications', icon: BookOpen },
    { id: 'members', labelKo: '구성원', labelEn: 'Members', icon: Users },
    { id: 'news', labelKo: '소식', labelEn: 'News', icon: Bell },
    { id: 'recruitment', labelKo: '모집안내', labelEn: 'Join Us', icon: Mail, highlight: true },
    { id: 'contact', labelKo: '연락처', labelEn: 'Contact', icon: MapPin },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3' 
          : 'bg-white/85 backdrop-blur-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Lab Branding */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
        >
          {lab.logoUrl ? (
            <img
              src={lab.logoUrl}
              alt={lab.shortName}
              className="w-8 h-8 rounded-sm object-contain border border-[#8ed0fa] bg-white p-0.5 shadow-xs group-hover:border-sky-400 transition-all duration-200"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-9 h-9 rounded-sm bg-[#b7e0fa] flex items-center justify-center text-slate-900 font-serif font-bold text-sm shadow-xs group-hover:bg-[#9ed3f7] transition-all duration-200">
              {lab.shortName.slice(0, 3)}
            </div>
          )}
          <span className="font-serif text-slate-900 font-bold text-lg sm:text-xl tracking-tight group-hover:text-sky-700 transition-colors">
            {lab.shortName}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs uppercase tracking-wider font-medium">
          {navLinks.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleLinkClick(item.id)}
                className={`px-3 py-1.5 rounded-sm transition-all duration-150 flex items-center gap-1.5 ${
                  item.highlight
                    ? isActive 
                      ? 'bg-sky-600 text-white font-bold shadow-xs border border-sky-700 ml-2 px-3.5'
                      : 'bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-bold shadow-xs border border-[#8ed0fa] ml-2 px-3.5'
                    : isActive
                    ? 'bg-[#e0f2fe] text-sky-900 font-bold border border-[#b7e0fa] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{lang === 'ko' ? item.labelKo : item.labelEn}</span>
                {item.highlight && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-600"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Utilities: Lang switch + Mobile menu trigger */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-mono font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-[#b7e0fa] transition"
            title="한국어 / English 전환"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>{lang === 'ko' ? 'EN' : 'KO'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-sm transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 mt-2 shadow-lg">
          <div className="pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                setLang(lang === 'ko' ? 'en' : 'ko');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>Language: {lang === 'ko' ? 'English' : '한국어'}</span>
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium flex items-center justify-between transition ${
                    item.highlight
                      ? isActive
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-[#b7e0fa] text-slate-900 font-bold'
                      : isActive
                      ? 'bg-[#e0f2fe] text-sky-900 font-bold border-l-3 border-sky-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700' : 'text-slate-500'}`} />
                    <span>{lang === 'ko' ? item.labelKo : item.labelEn}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white text-sky-900 font-bold uppercase font-mono border border-[#b7e0fa]">
                      Open
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
