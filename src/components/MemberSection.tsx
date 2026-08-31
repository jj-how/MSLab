import React, { useState } from 'react';
import { LabMember } from '../types';
import { Mail, ExternalLink, User } from 'lucide-react';
import { PageHeader } from './PageHeader';

interface MemberSectionProps {
  members: LabMember[];
  lang: 'ko' | 'en';
  onNavigateHome: () => void;
}

export const MemberSection: React.FC<MemberSectionProps> = ({ 
  members, 
  lang, 
  onNavigateHome 
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'alumni'>('current');

  const currentMembers = members.filter(m => m.role !== 'alumni');
  const alumniMembers = members.filter(m => m.role === 'alumni');

  return (
    <div id="members-view" className="w-full">
      {/* Dedicated Page Header */}
      <PageHeader
        category="People & Alumni"
        titleKo="연구실 구성원"
        titleEn="Lab Members & Alumni"
        descriptionKo="인공지능 혁신을 함께 만들어가는 연구원, 대학원생, 학부 연구생 및 자랑스러운 졸업생 동문입니다."
        descriptionEn="Meet our dedicated research scientists, graduate researchers, undergraduate interns, and alumni."
        lang={lang}
        onNavigateHome={onNavigateHome}
      />

      <section className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Sub-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div className="text-xs sm:text-sm font-mono text-slate-600">
              {activeTab === 'current' 
                ? `${lang === 'ko' ? '현재 재학 중인 연구원 총' : 'Total Current Researchers:'} ${currentMembers.length}${lang === 'ko' ? '명' : ''}`
                : `${lang === 'ko' ? '학계 및 산업계 진출 졸업생 총' : 'Total Proud Alumni:'} ${alumniMembers.length}${lang === 'ko' ? '명' : ''}`
              }
            </div>

            {/* Simple Tab Toggle */}
            <div className="flex rounded-sm bg-slate-100 p-1 border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-4 py-2 rounded-sm transition ${
                  activeTab === 'current'
                    ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ko' ? `재학생 (${currentMembers.length})` : `Current (${currentMembers.length})`}
              </button>
              <button
                onClick={() => setActiveTab('alumni')}
                className={`px-4 py-2 rounded-sm transition ${
                  activeTab === 'alumni'
                    ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ko' ? `졸업생 (${alumniMembers.length})` : `Alumni (${alumniMembers.length})`}
              </button>
            </div>
          </div>

        {/* Current Members Grid */}
        {activeTab === 'current' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {currentMembers.map((member) => {
              const displayName = lang === 'ko'
                ? `${member.nameKo}${member.nameEn?.trim() ? ` (${member.nameEn.trim()})` : ''}`
                : (member.nameEn?.trim() || member.nameKo);

              const roleLabel = member.customNote?.trim() || (lang === 'ko' ? member.roleTitleKo : (member.roleTitleEn || member.roleTitleKo));
              
              let yearLabel = '';
              if (member.admissionYear?.trim() && member.graduationYear?.trim()) {
                yearLabel = `(입학: ${member.admissionYear.trim()} · 졸업: ${member.graduationYear.trim()})`;
              } else if (member.admissionYear?.trim()) {
                yearLabel = `(입학연도 : ${member.admissionYear.trim()})`;
              } else if (member.graduationYear?.trim()) {
                yearLabel = `(졸업연도 : ${member.graduationYear.trim()})`;
              }

              return (
                <div
                  key={member.id}
                  className="bg-white rounded-sm border border-slate-200 hover:border-sky-300 hover:shadow-sm p-5 space-y-3 transition shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.nameKo}
                        className="w-14 h-14 rounded-sm object-cover border border-slate-200 shadow-xs shrink-0 bg-slate-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          const fallback = parent?.querySelector('.member-fallback-avatar');
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`member-fallback-avatar w-14 h-14 rounded-sm bg-gradient-to-br from-sky-50 to-[#e0f2fe] border border-sky-200/80 flex flex-col items-center justify-center text-sky-800 shadow-2xs shrink-0 select-none ${
                        member.avatarUrl ? 'hidden' : 'flex'
                      }`}
                    >
                      <User className="w-6 h-6 text-sky-700/80" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-slate-950 text-base">
                        {displayName}
                      </h4>
                      <span className="text-[11px] font-mono font-bold text-sky-800 flex flex-wrap items-center gap-1">
                        <span>{roleLabel}</span>
                        {yearLabel && <span className="text-slate-500 font-normal">{yearLabel}</span>}
                      </span>
                    </div>
                  </div>

                  {member.researchInterests && member.researchInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.researchInterests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-slate-50 text-slate-700 border border-slate-200"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {member.email?.trim() && (
                    <div className="pt-2 border-t border-slate-100">
                      <a
                        href={`mailto:${member.email.trim()}`}
                        className="text-xs font-mono text-slate-500 hover:text-sky-700 flex items-center gap-1.5 truncate"
                      >
                        <Mail className="w-3 h-3 text-sky-600 shrink-0" />
                        <span className="truncate">{member.email.trim()}</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Alumni List */
          <div className="bg-white rounded-sm border border-slate-200 shadow-xs divide-y divide-slate-100">
            {alumniMembers.map((alumnus) => {
              const displayName = lang === 'ko'
                ? `${alumnus.nameKo}${alumnus.nameEn?.trim() ? ` (${alumnus.nameEn.trim()})` : ''}`
                : (alumnus.nameEn?.trim() || alumnus.nameKo);

              const note = alumnus.customNote?.trim() || (lang === 'ko' ? alumnus.roleTitleKo?.trim() : alumnus.roleTitleEn?.trim());
              
              let degreeAndYear = '';
              if (note) {
                if (alumnus.graduationYear?.trim()) {
                  degreeAndYear = `${note}(${alumnus.graduationYear.trim()})`;
                } else if (alumnus.admissionYear?.trim()) {
                  degreeAndYear = `${note}(입학연도 : ${alumnus.admissionYear.trim()})`;
                } else {
                  degreeAndYear = note;
                }
              } else {
                if (alumnus.graduationYear?.trim()) {
                  degreeAndYear = `(졸업연도 : ${alumnus.graduationYear.trim()})`;
                } else if (alumnus.admissionYear?.trim()) {
                  degreeAndYear = `(입학연도 : ${alumnus.admissionYear.trim()})`;
                }
              }

              return (
                <div key={alumnus.id} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-serif font-bold text-slate-900 text-sm">
                      {displayName}
                    </span>
                    
                    {degreeAndYear && (
                      <span className="text-slate-600 font-mono font-medium text-xs">
                        {degreeAndYear}
                      </span>
                    )}

                    {/* 연구분야를 석사졸업(연도) 바로 뒤에 표시 */}
                    {alumnus.researchInterests && alumnus.researchInterests.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        {alumnus.researchInterests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {alumnus.email?.trim() && (
                      <a
                        href={`mailto:${alumnus.email.trim()}`}
                        className="text-slate-400 hover:text-sky-700 transition p-1"
                        title={alumnus.email.trim()}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {alumnus.currentAffiliation && (
                      <span className="font-mono text-sky-900 bg-[#e0f2fe] px-2.5 py-1 rounded-sm border border-[#b7e0fa] font-medium">
                        {alumnus.currentAffiliation}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  </div>
);
};
