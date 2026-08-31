import React, { useState } from 'react';
import { LabInfo } from '../types';
import { MapPin, Mail, Phone, Building, Send, Check } from 'lucide-react';
import { PageHeader } from './PageHeader';

interface ContactSectionProps {
  lab: LabInfo;
  lang: 'ko' | 'en';
  onNavigateHome: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lab, lang, onNavigateHome }) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;
    
    const mailSubject = encodeURIComponent(`[홈페이지 문의] ${senderName}님의 문의`);
    const mailBody = encodeURIComponent(`보낸 사람: ${senderName} (${senderEmail})\n\n내용:\n${message}`);
    window.open(`mailto:${lab.contactEmail}?subject=${mailSubject}&body=${mailBody}`, '_blank');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div id="contact-view" className="w-full">
      {/* Dedicated Page Header */}
      <PageHeader
        category="Location & Directions"
        titleKo="오시는 길 및 연락처"
        titleEn="Contact & Location"
        descriptionKo="전남대학교 데이터 사이언스 & 인텔리전트 시스템 연구실 위치 안내 및 방문, 산학협력 문의 창구입니다."
        descriptionEn="Find our laboratory location at Chonnam National University and get in touch with us."
        lang={lang}
        onNavigateHome={onNavigateHome}
      />

      <section className="py-20 sm:py-28 bg-slate-50/60 text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Location & Info */}
          <div className="lg:col-span-6 bg-white rounded-sm border border-slate-200 shadow-xs p-7 sm:p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold text-slate-950 flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-600" />
              {lang === 'ko' ? lab.labNameKo : lab.labNameEn}
            </h3>

            <div className="space-y-3.5 text-xs text-slate-700 font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <div className="text-slate-900 font-medium leading-relaxed">
                  {lang === 'ko' ? lab.addressKo : lab.addressEn}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                <a href={`mailto:${lab.contactEmail}`} className="text-sky-700 hover:text-sky-900 font-mono font-medium">
                  {lab.contactEmail}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-mono text-slate-700">{lab.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Right: Clean Inquiry Form */}
          <div className="lg:col-span-6 bg-white rounded-sm border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-950 flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600" />
              {lang === 'ko' ? '직접 문의하기' : 'Quick Message'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={lang === 'ko' ? '성함' : 'Your Name'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder={lang === 'ko' ? '이메일 주소' : 'Email Address'}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'ko' ? '문의 내용을 입력해 주세요...' : 'Your message...'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                {sentSuccess ? (
                  <span className="text-xs text-sky-700 flex items-center gap-1 font-mono font-medium">
                    <Check className="w-3.5 h-3.5 text-sky-600" /> 전송 프로그램 열림
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm text-xs font-mono font-bold uppercase tracking-wider bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 flex items-center gap-1.5 transition shadow-xs border border-[#8ed0fa]"
                >
                  <Send className="w-3 h-3" />
                  <span>{lang === 'ko' ? '문의 메일 발송' : 'Send'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
);
};
