import React, { useState, useMemo } from 'react';
import { ProfessorInfo } from '../types';
import { 
  Mail, Phone, MapPin, Award, BookOpen, 
  ExternalLink, GraduationCap, Briefcase
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { sortAwardsByYear, sortExperienceByYear, sortEducationByYear } from '../utils/sorters';

interface ProfessorSectionProps {
  professor: ProfessorInfo;
  lang: 'ko' | 'en';
  onNavigateHome: () => void;
  onNavigateRecruitment?: () => void;
}

export const ProfessorSection: React.FC<ProfessorSectionProps> = ({ 
  professor, 
  lang, 
  onNavigateHome 
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'experience' | 'awards'>('education');

  const sortedEducation = useMemo(() => sortEducationByYear(professor.education || []), [professor.education]);
  const sortedExperience = useMemo(() => sortExperienceByYear(professor.experience || []), [professor.experience]);
  const sortedAwards = useMemo(() => sortAwardsByYear(professor.awards || []), [professor.awards]);

  return (
    <div id="professor-view" className="w-full">
      {/* Dedicated Page Header */}
      <PageHeader
        category="Director / PI Profile"
        titleKo="지도교수 소개"
        titleEn="Principal Investigator"
        descriptionKo="인공지능 및 기계학습 연구를 이끄는 지도교수의 연구 비전, 주요 경력 및 학술 활동입니다."
        descriptionEn="Research vision, academic leadership, and background of the Principal Investigator."
        lang={lang}
        onNavigateHome={onNavigateHome}
      />

      <section className="py-20 sm:py-28 bg-slate-50/60 text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* PI Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Photo & Contact */}
          <div className="lg:col-span-4 bg-white p-7 sm:p-8 rounded-sm border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6">
              <img
                src={professor.avatarUrl}
                alt={professor.nameKo}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-sm object-cover border border-slate-200 shadow-xs"
              />
              <div className="text-center sm:text-left lg:text-center space-y-1.5">
                <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-950">
                  {lang === 'ko' ? professor.nameKo : professor.nameEn}
                </h3>
                <p className="text-xs font-mono font-bold text-sky-800 uppercase tracking-wider">
                  {lang === 'ko' ? professor.titleKo : professor.titleEn}
                </p>
                <p className="text-xs text-slate-500 font-light">
                  {lang === 'ko' ? professor.departmentKo : professor.departmentEn}
                </p>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700 font-light">
              <a 
                href={`mailto:${professor.email}`}
                className="flex items-center gap-2.5 hover:text-sky-700 transition"
              >
                <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{professor.email}</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{professor.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{lang === 'ko' ? professor.officeKo : professor.officeEn}</span>
              </div>
            </div>

            {/* Academic Profiles */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
              {professor.links.scholar && (
                <a
                  href={professor.links.scholar}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-sm bg-slate-50 hover:bg-[#e0f2fe] text-slate-700 hover:text-sky-900 border border-slate-200 hover:border-[#b7e0fa] text-xs font-mono flex items-center gap-1.5 transition"
                >
                  <BookOpen className="w-3 h-3 text-sky-600" /> Scholar <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              {professor.links.dblp && (
                <a
                  href={professor.links.dblp}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-sm bg-slate-50 hover:bg-[#e0f2fe] text-slate-700 hover:text-sky-900 border border-slate-200 hover:border-[#b7e0fa] text-xs font-mono flex items-center gap-1.5 transition"
                >
                  DBLP <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              {professor.links.github && (
                <a
                  href={professor.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-sm bg-slate-50 hover:bg-[#e0f2fe] text-slate-700 hover:text-sky-900 border border-slate-200 hover:border-[#b7e0fa] text-xs font-mono flex items-center gap-1.5 transition"
                >
                  GitHub <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Bio & Streamlined Timeline */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-mono text-sky-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b7e0fa]" />
                Biography
              </h4>
              <div className="text-sm text-slate-700 leading-relaxed font-light whitespace-pre-line">
                {lang === 'ko' ? professor.bioKo : professor.bioEn}
              </div>
            </div>

            {/* Tabbed Experience / Education / Awards */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
              <div className="flex gap-2 border-b border-slate-100 pb-3 mb-4">
                <button
                  onClick={() => setActiveTab('education')}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono font-medium transition ${
                    activeTab === 'education'
                      ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'ko' ? '학력' : 'Education'}
                </button>
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono font-medium transition ${
                    activeTab === 'experience'
                      ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'ko' ? `주요 경력 (${professor.experience.length})` : `Experience (${professor.experience.length})`}
                </button>
                <button
                  onClick={() => setActiveTab('awards')}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono font-medium transition ${
                    activeTab === 'awards'
                      ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'ko' ? `수상 및 서훈 (${professor.awards.length})` : `Awards (${professor.awards.length})`}
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'education' && (
                <div className="space-y-2.5">
                  {sortedEducation.map((edu, idx) => (
                    <div key={idx} className="flex items-baseline gap-3 text-xs">
                      <span className="font-mono text-sky-800 font-semibold w-24 shrink-0">{edu.year}</span>
                      <div className="text-slate-700">
                        <span className="font-semibold text-slate-900">{edu.degree}</span> · {edu.institution}
                        {edu.details && <span className="text-slate-500 text-[11px] block mt-0.5">{edu.details}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {sortedExperience.map((exp, idx) => (
                    <div key={idx} className="flex items-baseline gap-3 text-xs pb-1.5 border-b border-slate-50 last:border-0">
                      <span className="font-mono text-sky-800 font-semibold w-32 shrink-0">{exp.period}</span>
                      <div className="text-slate-700">
                        <span className="font-semibold text-slate-900">{exp.role}</span> · {exp.institution}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'awards' && (
                <div className="space-y-2.5">
                  {sortedAwards.map((award, idx) => (
                    <div key={idx} className="flex items-baseline gap-3 text-xs pb-1.5 border-b border-slate-50 last:border-0">
                      <span className="font-mono text-sky-800 font-semibold w-24 shrink-0">{award.year}</span>
                      <div className="text-slate-700">
                        <span className="font-semibold text-slate-900">{award.title}</span> · {award.organization}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
};
