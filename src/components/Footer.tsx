import React from 'react';
import { LabInfo } from '../types';
import { ChevronUp, Lock } from 'lucide-react';

interface FooterProps {
  lab: LabInfo;
  lang: 'ko' | 'en';
  onNavigate?: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lab, lang, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 text-slate-500 text-xs border-t border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} {lab.shortName} · {lang === 'ko' ? lab.universityKo : lab.universityEn}. All rights reserved.
          </span>
          {onOpenAdmin && (
            <button
              id="footer-admin-btn"
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-slate-700 transition flex items-center gap-1 opacity-60 hover:opacity-100"
              title={lang === 'ko' ? '관리자 모드 (비밀번호 인증)' : 'Admin Mode (Authentication Required)'}
            >
              <Lock className="w-3 h-3" />
              <span className="text-[10px]">Admin</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition font-mono text-xs shadow-2xs"
          >
            <span>Back to Top</span>
            <ChevronUp className="w-3.5 h-3.5 text-sky-600" />
          </button>
        </div>
      </div>
    </footer>
  );
};

