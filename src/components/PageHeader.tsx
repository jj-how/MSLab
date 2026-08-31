import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  category: string;
  titleKo: string;
  titleEn: string;
  descriptionKo?: string;
  descriptionEn?: string;
  lang: 'ko' | 'en';
  onNavigateHome?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  titleKo,
  titleEn,
  descriptionKo,
  descriptionEn,
  lang,
  onNavigateHome
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80 pt-32 sm:pt-36 pb-14 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {onNavigateHome && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-5">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 hover:text-sky-700 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{lang === 'ko' ? '홈' : 'Home'}</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-sky-900 font-semibold">{lang === 'ko' ? titleKo : titleEn}</span>
          </div>
        )}

        {/* Header Title & Description */}
        <div className="space-y-2">
          <p className="text-xs font-mono font-bold text-sky-800 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b7e0fa]" />
            {category}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-slate-950 tracking-tight">
            {lang === 'ko' ? titleKo : titleEn}
          </h1>
          {(descriptionKo || descriptionEn) && (
            <p className="text-sm sm:text-base text-slate-600 font-light pt-1 max-w-3xl leading-relaxed">
              {lang === 'ko' ? descriptionKo : descriptionEn}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
