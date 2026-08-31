import React, { useState, useMemo } from 'react';
import { Publication } from '../types';
import { 
  Search, FileText, Code, 
  ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { sortPublicationsByYear } from '../utils/sorters';

interface PublicationSectionProps {
  publications: Publication[];
  lang: 'ko' | 'en';
  onNavigateHome: () => void;
  onOpenBibtex: (pub: Publication) => void;
}

export const PublicationSection: React.FC<PublicationSectionProps> = ({ 
  publications, 
  lang, 
  onNavigateHome,
  onOpenBibtex 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPublications = useMemo(() => {
    const list = publications.filter(pub => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        pub.title.toLowerCase().includes(q) ||
        pub.authors.some(a => a.toLowerCase().includes(q)) ||
        pub.venue.toLowerCase().includes(q)
      );

      let matchesCategory = true;
      if (selectedCategory === 'top-conference') {
        matchesCategory = pub.venueType === 'Top Conference';
      } else if (selectedCategory === 'sci-journal') {
        matchesCategory = pub.venueType === 'SCI/SCIE Journal';
      }

      return matchesSearch && matchesCategory;
    });
    return sortPublicationsByYear(list);
  }, [publications, searchQuery, selectedCategory]);

  return (
    <div id="publications-view" className="w-full">
      {/* Dedicated Page Header */}
      <PageHeader
        category="Research Papers & Citations"
        titleKo="논문 실적"
        titleEn="Publications Database"
        descriptionKo="인공지능 분야 세계 최우수 학회(NeurIPS, ICML, CVPR, ICLR 등) 및 주요 SCI 저널에 게재된 학술 논문 목록입니다."
        descriptionEn="Peer-reviewed publications in top AI conferences and prestigious international journals."
        lang={lang}
        onNavigateHome={onNavigateHome}
      />

      <section className="py-20 sm:py-28 bg-slate-50/60 text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-12">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="publication-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ko' ? '논문 제목, 저자, 학회명 검색...' : 'Search papers...'}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-sm text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 shadow-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto font-mono text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-sm transition ${
                selectedCategory === 'all'
                  ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              All ({publications.length})
            </button>
            <button
              onClick={() => setSelectedCategory('top-conference')}
              className={`px-3 py-1.5 rounded-sm transition ${
                selectedCategory === 'top-conference'
                  ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              Conference
            </button>
            <button
              onClick={() => setSelectedCategory('sci-journal')}
              className={`px-3 py-1.5 rounded-sm transition ${
                selectedCategory === 'sci-journal'
                  ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              Journal
            </button>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-4">
          {filteredPublications.map((pub) => {
            const isExpanded = !!expandedAbstracts[pub.id];
            return (
              <div
                key={pub.id}
                className="bg-white hover:bg-slate-50/70 rounded-sm border border-slate-200 shadow-xs p-5 transition space-y-2.5"
              >
                {/* Header: Venue + BibTeX */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-sky-800 font-bold">
                      {pub.venue} ({pub.year})
                    </span>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {pub.venueType}
                    </span>
                    {pub.award && (
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-[#b7e0fa] text-slate-900 border border-[#9ed3f7]">
                        {pub.award}
                      </span>
                    )}
                  </div>

                  <button
                    id={`bibtex-btn-${pub.id}`}
                    onClick={() => onOpenBibtex(pub)}
                    className="px-2 py-0.5 rounded-sm text-xs font-mono bg-slate-50 hover:bg-[#e0f2fe] text-slate-700 hover:text-sky-900 border border-slate-200 hover:border-[#b7e0fa] flex items-center gap-1 transition shrink-0"
                  >
                    <Code className="w-3 h-3 text-sky-600" />
                    <span>BibTeX</span>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-serif font-bold text-slate-950 leading-snug">
                  {pub.title}
                </h3>

                {/* Authors */}
                <div className="text-xs text-slate-600 font-light">
                  {pub.authors.map((author, aIdx) => {
                    const isLabMember = author.includes('Kim') || author.includes('김민수') || author.includes('Lee') || author.includes('Park') || author.includes('박지훈') || author.includes('이서연');
                    return (
                      <span key={aIdx}>
                        <span className={isLabMember ? 'text-sky-900 font-semibold underline decoration-[#b7e0fa]' : 'text-slate-600'}>
                          {author}
                        </span>
                        {aIdx < pub.authors.length - 1 && ', '}
                      </span>
                    );
                  })}
                </div>

                {/* Abstract Toggle */}
                {pub.abstract && (
                  <div className="pt-2 border-t border-slate-100 text-xs font-mono">
                    <button
                      onClick={() => toggleAbstract(pub.id)}
                      className="px-2.5 py-1 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1 transition text-xs"
                    >
                      <span>초록 보기 (Abstract)</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                    </button>
                  </div>
                )}

                {isExpanded && pub.abstract && (
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 text-xs text-slate-700 leading-relaxed font-light mt-2">
                    {pub.abstract}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);
};
