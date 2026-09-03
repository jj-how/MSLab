import React, { useMemo } from 'react';
import { LabInfo, NewsItem, ResearchTheme, Publication } from '../types';
import { 
  ArrowRight, FileText, 
  Sparkles, Users, Layers, ExternalLink, GraduationCap,
  Bell, Mail, MapPin, ChevronRight, BookOpen, Award
} from 'lucide-react';
import { sortPublicationsByYear } from '../utils/sorters';

interface HeroSectionProps {
  lab: LabInfo;
  latestNews: NewsItem[];
  themes?: ResearchTheme[];
  publications?: Publication[];
  lang: 'ko' | 'en';
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  lab, 
  latestNews, 
  themes = [], 
  publications = [], 
  lang, 
  onNavigate 
}) => {
  const topNews = latestNews.find(n => n.isImportant) || latestNews[0];
  const sortedRecentPublications = useMemo(() => sortPublicationsByYear(publications), [publications]);

  const portalCards = [
    {
      id: 'professor',
      titleKo: '지도교수 소개',
      titleEn: 'Principal Investigator',
      descKo: '약력, 학술 연구 비전, 수상 실적 및 대외 활동',
      descEn: 'Biography, research vision, awards and services',
      icon: GraduationCap,
      badge: 'PI Profile'
    },
    {
      id: 'research',
      titleKo: '연구 분야 & 과제',
      titleEn: 'Research & Projects',
      descKo: '핵심 연구 테마 및 정부/산학 수탁 연구과제 현황',
      descEn: 'Key research pillars and funded research projects',
      icon: Layers,
      badge: `${themes.length} Pillars`
    },
    {
      id: 'publications',
      titleKo: '연구 논문 실적',
      titleEn: 'Publications Database',
      descKo: '최상위 학회(Top Conf) 및 SCI 저널 논문 & BibTeX 인용',
      descEn: 'Top conference & SCI journal papers with BibTeX',
      icon: BookOpen,
      badge: `${publications.length} Papers`
    },
    {
      id: 'members',
      titleKo: '연구원 및 졸업생',
      titleEn: 'Members & Alumni',
      descKo: '박사/석사 연구원, 학부연구생 및 자랑스러운 동문',
      descEn: 'Ph.D., M.S., undergraduate interns & proud alumni',
      icon: Users,
      badge: `${lab.stats.currentMembersCount} Members`
    },
    {
      id: 'news',
      titleKo: '소식 및 세미나',
      titleEn: 'News & Seminars',
      descKo: '연구실 공지사항, 정기 세미나 일정 및 갤러리',
      descEn: 'Lab announcements, weekly seminars & lab gallery',
      icon: Bell,
      badge: 'Updated'
    },
    {
      id: 'recruitment',
      titleKo: '신입 연구원 모집',
      titleEn: 'Prospective Students',
      descKo: '대학원생 및 학부연구생 상시 모집 및 지원 혜택',
      descEn: 'Open positions, tuition support & research incentives',
      icon: Mail,
      badge: 'Active Recruiting',
      isHighlight: true
    },
    {
      id: 'contact',
      titleKo: '오시는 길 & 연락처',
      titleEn: 'Contact & Location',
      descKo: '연구실 위치, 캠퍼스 오시는 길 및 직접 문의',
      descEn: 'Lab room location, campus directions and inquiries',
      icon: MapPin,
      badge: 'Campus Map'
    }
  ];

  return (
    <div id="home-view" className="w-full">
      {/* 1. Hero Banner */}
      <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
        {/* Background Subtle Sky Glow */}
        <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-[#b7e0fa]/35 rounded-full blur-[110px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-[#e0f2fe]/40 rounded-full blur-[90px] pointer-events-none -z-0" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          {/* Latest News Banner (Compact) */}
          {topNews && (
            <div className="mb-10 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-sm bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-xs">
              <span className="px-2 py-0.5 rounded-sm bg-[#b7e0fa] text-slate-900 font-mono text-[10px] font-bold uppercase tracking-wider border border-[#9ed3f7]">
                LATEST
              </span>
              <span className="truncate max-w-xs sm:max-w-md font-medium text-slate-800">
                {lang === 'ko' ? topNews.titleKo : topNews.titleEn}
              </span>
              <button 
                onClick={() => onNavigate('news')}
                className="text-sky-700 hover:text-sky-900 font-mono text-[11px] font-semibold flex items-center gap-0.5 ml-1"
              >
                <span>{lang === 'ko' ? '더보기' : 'View'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight text-slate-950 leading-tight">
                  {lang === 'ko' ? lab.labNameKo : lab.labNameEn}
                </h1>

                <p className="text-sm sm:text-base font-mono text-slate-600">
                  <span className="font-semibold text-slate-900">{lab.shortName}</span> · {lab.labNameEn}
                </p>
              </div>

              {/* Concise Description */}
              <p className="text-slate-700 text-base sm:text-xl leading-relaxed max-w-2xl font-light">
                {lang === 'ko' ? lab.mottoKo : lab.mottoEn}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  id="hero-cta-recruitment"
                  onClick={() => onNavigate('recruitment')}
                  className="px-6 py-3 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 transition flex items-center gap-2 shadow-sm border border-[#8ed0fa]"
                >
                  <span>{lang === 'ko' ? '신입 연구원 모집 (Join Us)' : 'Join Our Lab'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id="hero-cta-publications"
                  onClick={() => onNavigate('publications')}
                  className="px-6 py-3 rounded-sm text-xs font-mono font-semibold uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 transition flex items-center gap-2 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>{lang === 'ko' ? '논문 실적' : 'Publications'}</span>
                </button>

                <button
                  id="hero-cta-professor"
                  onClick={() => onNavigate('professor')}
                  className="px-6 py-3 rounded-sm text-xs font-mono font-semibold uppercase tracking-wider bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition shadow-xs"
                >
                  <span>{lang === 'ko' ? '교수 소개' : 'PI Profile'}</span>
                </button>
              </div>
            </div>

            {/* Minimalist Stats Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-sm p-7 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono text-sky-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b7e0fa]" />
                    Lab Overview
                  </span>
                  <span className="text-xs font-mono text-slate-500">Est. {lab.establishedYear}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                    <div className="text-2xl font-serif font-bold text-slate-900">{lab.stats.publicationsCount}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">Papers</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                    <div className="text-2xl font-serif font-bold text-slate-900">{lab.stats.activeProjectsCount}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">Projects</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                    <div className="text-2xl font-serif font-bold text-slate-900">{lab.stats.currentMembersCount}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">Members</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-light text-center pt-2 border-t border-slate-100 leading-relaxed">
                  {lang === 'ko' ? `${lab.buildingKo} ${lab.roomKo}` : `${lab.buildingEn} ${lab.roomEn}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Menu Navigation Hub (주요 메뉴 바로가기 카드 그리드) */}
      <section className="py-20 sm:py-28 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-mono font-bold text-sky-800 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b7e0fa]" />
              Navigation Directory
            </p>
            <h2 className="text-2xl sm:text-4xl font-serif font-light text-slate-950">
              {lang === 'ko' ? '주요 메뉴 바로가기' : 'Lab Portals & Sections'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {portalCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => onNavigate(card.id)}
                  className={`p-7 sm:p-8 rounded-sm border transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-sm ${
                    card.isHighlight
                      ? 'bg-gradient-to-br from-white to-[#f0f9ff] border-[#b7e0fa] hover:border-sky-400 hover:ring-1 hover:ring-sky-300'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors ${
                        card.isHighlight
                          ? 'bg-[#b7e0fa] text-sky-900 group-hover:bg-sky-200'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-[#e0f2fe] group-hover:text-sky-800'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-semibold rounded-xs ${
                        card.isHighlight
                          ? 'bg-[#b7e0fa] text-sky-900 border border-sky-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {card.badge}
                      </span>
                    </div>

                    <div className="pt-1">
                      <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-sky-800 transition-colors flex items-center justify-between">
                        <span>{lang === 'ko' ? card.titleKo : card.titleEn}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-all" />
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-light mt-2 leading-relaxed">
                        {lang === 'ko' ? card.descKo : card.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-sky-700 group-hover:text-sky-900 font-medium">
                    <span>{lang === 'ko' ? '상세 페이지 보기' : 'Open Page'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Highlights Overview */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Research Areas Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-600" />
                  {lang === 'ko' ? '주요 연구 분야' : 'Core Research Themes'}
                </span>
                <button
                  onClick={() => onNavigate('research')}
                  className="text-xs font-mono text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
                >
                  <span>{lang === 'ko' ? '연구분야 전체보기' : 'View All Themes'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {themes.slice(0, 2).map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => onNavigate('research')}
                    className="p-5 sm:p-6 rounded-sm border border-slate-200 bg-slate-50/50 hover:bg-sky-50/30 hover:border-sky-300 transition cursor-pointer space-y-2"
                  >
                    <h4 className="font-serif font-bold text-slate-900 text-base mb-1">
                      {lang === 'ko' ? t.titleKo : t.titleEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 font-light leading-relaxed">
                      {lang === 'ko' ? t.descriptionKo : t.descriptionEn}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {t.keywords.slice(0, 3).map((kw, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recent Papers Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-mono font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  {lang === 'ko' ? '최근 주요 논문 실적' : 'Recent Publications'}
                </span>
                <button
                  onClick={() => onNavigate('publications')}
                  className="text-xs font-mono text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
                >
                  <span>{lang === 'ko' ? '논문 전체보기' : 'View All Papers'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {sortedRecentPublications.slice(0, 2).map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => onNavigate('publications')}
                    className="p-5 sm:p-6 rounded-sm border border-slate-200 bg-slate-50/50 hover:bg-sky-50/30 hover:border-sky-300 transition cursor-pointer space-y-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-xs text-[10px] font-mono">
                        {p.year}
                      </span>
                      <span className="px-2 py-0.5 bg-[#e0f2fe] text-sky-900 border border-[#b7e0fa] rounded-xs text-[10px] font-mono font-bold">
                        {p.venueType}
                      </span>
                      {p.award && (
                        <span className="px-2 py-0.5 bg-[#b7e0fa] text-slate-900 rounded-xs text-[10px] font-mono font-bold">
                          {p.award}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono line-clamp-1">
                      {p.venue} · {p.authors.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
