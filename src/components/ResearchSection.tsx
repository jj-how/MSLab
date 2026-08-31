import React, { useState, useMemo } from 'react';
import { ResearchTheme, ResearchProject } from '../types';
import { 
  Brain, Eye, Cpu, ShieldCheck, Layers, 
  Clock, CheckCircle2
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { sortProjectsByYear } from '../utils/sorters';

interface ResearchSectionProps {
  themes: ResearchTheme[];
  projects: ResearchProject[];
  lang: 'ko' | 'en';
  onNavigateHome: () => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ 
  themes, 
  projects, 
  lang, 
  onNavigateHome 
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string | 'all'>('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'ongoing' | 'completed'>('all');

  const getThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Eye': return <Eye className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const filteredProjects = useMemo(() => {
    const list = projects.filter(p => {
      const matchesTheme = selectedThemeId === 'all' || p.relatedThemeId === selectedThemeId;
      const matchesStatus = projectStatusFilter === 'all' || p.status === projectStatusFilter;
      return matchesTheme && matchesStatus;
    });
    return sortProjectsByYear(list);
  }, [projects, selectedThemeId, projectStatusFilter]);

  return (
    <div id="research-view" className="w-full">
      {/* Page Header */}
      <PageHeader
        category="Research Pillars & Grants"
        titleKo="연구 분야 및 과제"
        titleEn="Research Areas & Projects"
        descriptionKo="인공지능 핵심 기초 이론부터 멀티모달, 신뢰성 인공지능, 그리고 실제 산업/국가 수탁 연구과제 현황입니다."
        descriptionEn="Exploration of core AI theory, multimodal systems, trustworthy AI, and active research projects."
        lang={lang}
        onNavigateHome={onNavigateHome}
      />

      <section className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 4 Research Theme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20 sm:mb-24">
          {themes.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedThemeId(isSelected ? 'all' : theme.id)}
                className={`p-7 sm:p-8 rounded-sm border transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
                  isSelected
                    ? 'bg-[#f0f9ff] border-sky-400 ring-2 ring-[#b7e0fa]'
                    : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-sm bg-[#e0f2fe] text-sky-800 border border-[#b7e0fa]">
                      {getThemeIcon(theme.iconName)}
                    </div>
                    <span className="text-[10px] font-mono text-sky-800 font-bold uppercase tracking-wider">
                      {isSelected ? (lang === 'ko' ? '선택됨 (필터 해제)' : 'Selected') : theme.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-950">
                    {lang === 'ko' ? theme.titleKo : theme.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light line-clamp-3">
                    {lang === 'ko' ? theme.descriptionKo : theme.descriptionEn}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-5 mt-5 border-t border-slate-100">
                  {theme.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-sm text-[11px] font-mono bg-slate-50 text-slate-700 border border-slate-200"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Funded Projects List */}
        <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-950">
                {lang === 'ko' ? '연구 과제' : 'Funded Projects'}
              </h3>
              <p className="text-xs text-slate-500 font-light">
                {lang === 'ko' ? '정부 및 산업체 연구 지원 과제' : 'Active and completed funded grants'}
              </p>
            </div>

            <div className="flex rounded-sm bg-slate-100 p-1 border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setProjectStatusFilter('all')}
                className={`px-3 py-1 rounded-sm transition ${
                  projectStatusFilter === 'all' ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setProjectStatusFilter('ongoing')}
                className={`px-3 py-1 rounded-sm transition ${
                  projectStatusFilter === 'ongoing' ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                수행 중
              </button>
              <button
                onClick={() => setProjectStatusFilter('completed')}
                className={`px-3 py-1 rounded-sm transition ${
                  projectStatusFilter === 'completed' ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                완료
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 pt-2">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="py-4 space-y-1.5 hover:bg-slate-50/50 px-2 rounded-sm transition">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold uppercase ${
                      proj.status === 'ongoing' 
                        ? 'bg-[#e0f2fe] text-sky-900 border border-[#b7e0fa]' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {proj.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                    <span className="font-mono text-slate-700 font-medium text-[11px]">{proj.fundingAgency}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{proj.period}</span>
                </div>

                <h4 className="text-sm font-semibold text-slate-900">
                  {lang === 'ko' ? proj.titleKo : proj.titleEn}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);
};
