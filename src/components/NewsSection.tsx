import React, { useState, useMemo } from 'react';
import { NewsItem, SeminarSchedule, GalleryItem } from '../types';
import { Bell, Calendar, Camera } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { sortNewsByDate } from '../utils/sorters';

interface NewsSectionProps {
  news: NewsItem[];
  seminars: SeminarSchedule[];
  gallery: GalleryItem[];
  lang: 'ko' | 'en';
  onNavigateHome: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ 
  news, 
  seminars, 
  gallery, 
  lang, 
  onNavigateHome 
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'seminar' | 'gallery'>('news');
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const sortedNews = useMemo(() => sortNewsByDate(news), [news]);

  return (
    <div id="news-view" className="w-full">
      {/* Dedicated Page Header */}
      <PageHeader
        category="Announcements & Events"
        titleKo="소식 및 세미나"
        titleEn="News & Seminars"
        descriptionKo="연구실 공지사항, 최신 논문 채택 소식, 주간 정기 세미나 일정 및 갤러리입니다."
        descriptionEn="Latest lab announcements, paper acceptances, seminar schedules, and lab gallery."
        lang={lang}
        onNavigateHome={onNavigateHome}
      />

      <section className="py-20 sm:py-28 bg-slate-50/60 text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sub-bar Tab Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div className="text-xs sm:text-sm font-mono text-slate-600">
              {activeTab === 'news' && `${lang === 'ko' ? '총' : 'Total'} ${news.length}${lang === 'ko' ? '개의 공지 및 소식' : ' Lab News'}`}
              {activeTab === 'seminar' && `${lang === 'ko' ? '총' : 'Total'} ${seminars.length}${lang === 'ko' ? '개의 세미나 일정' : ' Scheduled Seminars'}`}
              {activeTab === 'gallery' && `${lang === 'ko' ? '총' : 'Total'} ${gallery.length}${lang === 'ko' ? '장의 사진' : ' Gallery Photos'}`}
            </div>

            <div className="flex rounded-sm bg-slate-100 p-1 border border-slate-200 text-xs font-mono">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 rounded-sm transition ${
                  activeTab === 'news'
                    ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ko' ? `연구실 소식 (${news.length})` : `News (${news.length})`}
              </button>
              <button
                onClick={() => setActiveTab('seminar')}
                className={`px-4 py-2 rounded-sm transition ${
                  activeTab === 'seminar'
                    ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ko' ? `세미나 (${seminars.length})` : `Seminars (${seminars.length})`}
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-sm transition ${
                  activeTab === 'gallery'
                    ? 'bg-[#b7e0fa] text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ko' ? `갤러리 (${gallery.length})` : `Gallery (${gallery.length})`}
              </button>
            </div>
          </div>

        {/* Tab 1: News */}
        {activeTab === 'news' && (
          <div className="bg-white rounded-sm border border-slate-200 shadow-xs divide-y divide-slate-100">
            {sortedNews.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 hover:bg-slate-50/60 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-sky-800">{item.date}</span>
                    <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {lang === 'ko' ? item.titleKo : item.titleEn}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Seminars */}
        {activeTab === 'seminar' && (
          <div className="bg-white rounded-sm border border-slate-200 shadow-xs divide-y divide-slate-100">
            {seminars.map((sem) => (
              <div key={sem.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sky-800 font-bold">{sem.date}</span>
                    <span className="text-slate-500 font-mono">({sem.location})</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {lang === 'ko' ? sem.titleKo : sem.titleEn}
                  </h4>
                </div>
                <div className="font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-sm border border-slate-200">
                  Presenter: <span className="text-slate-900 font-medium">{sem.speaker}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Gallery */}
        {activeTab === 'gallery' && (
          selectedGallery ? (
            <div>
              <button
                onClick={() => setSelectedGallery(null)}
                className="mb-6 text-sm font-semibold text-sky-800 hover:underline"
              >
                ← {lang === 'ko' ? '갤러리 목록으로' : 'Back to Gallery'}
              </button>

              <div className="mb-8">
                <span className="font-mono text-xs font-semibold text-sky-800">
                  {selectedGallery.date}
                </span>
                <h2 className="text-2xl font-bold mt-2">
                  {lang === 'ko' ? selectedGallery.titleKo : selectedGallery.titleEn}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(selectedGallery.images || [selectedGallery.imageUrl]).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedGallery.titleKo} ${index + 1}`}
                    className="w-full aspect-[4/3] object-cover rounded-sm border border-slate-200"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedGallery(item)}
                  className="text-left bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden group hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.titleKo}
                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="p-3">
                    <span className="font-mono text-[10px] font-semibold text-sky-800">
                      {item.date}
                    </span>
                    <h5 className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                      {lang === 'ko' ? item.titleKo : item.titleEn}
                    </h5>
                  </div>
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  </div>
);
};
