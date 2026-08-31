import React, { useState } from 'react';
import { RecruitmentInfo } from '../types';
import { 
  DollarSign, Server, Plane, Users, 
  Mail, Send, Copy, Check, ArrowRight
} from 'lucide-react';
import { PageHeader } from './PageHeader';

interface RecruitmentSectionProps {
  recruitment: RecruitmentInfo;
  labEmail: string;
  lang: 'ko' | 'en';
  onNavigateHome: () => void;
}

export const RecruitmentSection: React.FC<RecruitmentSectionProps> = ({ 
  recruitment, 
  labEmail, 
  lang, 
  onNavigateHome 
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contactEmail = recruitment.contactEmail || labEmail;
  const sampleEmailText = `[연구실 진학 문의] 지원자 성명_지원 희망 과정

안녕하세요, 김민수 교수님.
교수님 연구실의 최신 연구 성과에 큰 관심을 가지고 있으며, 석사/박사/인턴 과정으로 진학하고자 문의드립니다.

- 지원 희망 과정: 석박통합과정 / 석사과정 / 학부연구생
- 관심 연구 분야: 멀티모달 AI, 초거대 언어모델
- 첨부 서류: 이력서(CV) 및 성적증명서

감사합니다.`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(sampleEmailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMail = () => {
    const subject = encodeURIComponent('[연구실 진학 문의] 지원자 성명');
    const body = encodeURIComponent(sampleEmailText);
    window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div id="recruitment-view" className="w-full">
      {/* Dedicated Page Header */}
      <PageHeader
        category="Opportunities & Admissions"
        titleKo="신입 연구원 모집"
        titleEn="Prospective Students"
        descriptionKo="인공지능 핵심 및 응용 기술을 함께 연구할 석사, 박사, 석박통합과정 대학원생과 학부 연구생을 상시 모집합니다."
        descriptionEn="We are actively recruiting passionate M.S., Ph.D., and undergraduate student researchers."
        lang={lang}
        onNavigateHome={onNavigateHome}
      />

      <section className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 4 Benefits Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-20">
          {recruitment.benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-sm border border-slate-200 shadow-xs p-6 space-y-3 hover:border-sky-300 hover:shadow-sm transition"
            >
              <div className="w-10 h-10 rounded-sm bg-[#e0f2fe] text-sky-800 border border-[#b7e0fa] flex items-center justify-center">
                {idx === 0 && <DollarSign className="w-5 h-5" />}
                {idx === 1 && <Server className="w-5 h-5" />}
                {idx === 2 && <Plane className="w-5 h-5" />}
                {idx === 3 && <Users className="w-5 h-5" />}
              </div>
              <h4 className="text-base font-serif font-bold text-slate-950">
                {lang === 'ko' ? benefit.titleKo : benefit.titleEn}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                {lang === 'ko' ? benefit.descKo : benefit.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* Application Process & Quick Contact Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50 p-6 sm:p-8 rounded-sm border border-slate-200">
          {/* Left 3 steps */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-serif font-bold text-slate-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              {lang === 'ko' ? '지원 절차 안내' : 'Application Steps'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white rounded-sm border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-mono text-sky-800 font-bold">STEP 01</span>
                <h5 className="text-xs font-semibold text-slate-900">이메일 문의</h5>
                <p className="text-[11px] text-slate-500 font-light">CV 및 성적표 송부</p>
              </div>

              <div className="p-3.5 bg-white rounded-sm border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-mono text-sky-800 font-bold">STEP 02</span>
                <h5 className="text-xs font-semibold text-slate-900">개별 면담</h5>
                <p className="text-[11px] text-slate-500 font-light">연구 관심사 논의</p>
              </div>

              <div className="p-3.5 bg-white rounded-sm border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-mono text-sky-800 font-bold">STEP 03</span>
                <h5 className="text-xs font-semibold text-slate-900">정규 전형 지원</h5>
                <p className="text-[11px] text-slate-500 font-light">대학원 입학 지원</p>
              </div>
            </div>
          </div>

          {/* Right Direct Action */}
          <div className="lg:col-span-5 bg-white p-5 rounded-sm border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-900 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600" /> {contactEmail}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-light">
              연구실 진학에 관심 있는 분은 CV와 함께 이메일로 편하게 연락주세요.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                id="copy-inquiry-email-btn"
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-sm text-xs font-mono bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-sky-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                <span>{copiedEmail ? '양식 복사됨' : '문의 양식 복사'}</span>
              </button>

              <button
                id="send-inquiry-mailto-btn"
                onClick={handleSendMail}
                className="px-4 py-1.5 rounded-sm text-xs font-mono font-bold bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 flex items-center gap-1.5 transition shadow-xs border border-[#8ed0fa]"
              >
                <Send className="w-3 h-3" />
                <span>메일 보내기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
};
