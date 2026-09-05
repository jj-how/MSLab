import React, { useState, useEffect } from 'react';
import { LabFullData, Publication } from './types';
import { getInitialLabDataSync, persistLabData, loadFromIndexedDB } from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProfessorSection } from './components/ProfessorSection';
import { ResearchSection } from './components/ResearchSection';
import { PublicationSection } from './components/PublicationSection';
import { MemberSection } from './components/MemberSection';
import { NewsSection } from './components/NewsSection';
import { RecruitmentSection } from './components/RecruitmentSection';
import { ContactSection } from './components/ContactSection';
import { BibtexModal } from './components/BibtexModal';
import { AdminEditorModal } from './components/AdminEditorModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Footer } from './components/Footer';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [labData, setLabData] = useState<LabFullData>(() => getInitialLabDataSync());

  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedBibtexPub, setSelectedBibtexPub] = useState<Publication | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Background check for IndexedDB backup if localStorage was empty on cold start
  useEffect(() => {
    loadFromIndexedDB().then((idbData) => {
      if (idbData && (!localStorage.getItem('jnu_msa_stat_lab_data_v3'))) {
        setLabData(idbData);
      }
    }).catch(() => {});
  }, []);

  // URL Hash (#admin) & Secret Shortcut (Ctrl+Shift+A) listener
  useEffect(() => {
    const handleCheckHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setIsAuthModalOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A or Cmd + Shift + A triggers Admin Login
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAuthModalOpen(true);
      }
    };

    handleCheckHash();
    window.addEventListener('hashchange', handleCheckHash);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleCheckHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Save data resiliently (localStorage + IndexedDB)
  const handleSaveData = (newData: LabFullData) => {
    setLabData(newData);
    persistLabData(newData);
  };

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-slate-900 font-sans selection:bg-[#b7e0fa] selection:text-slate-900">
      {/* Top Navigation Bar with active page tab indicator */}
      <Navbar
        lab={labData.lab}
        lang={lang}
        setLang={setLang}
        activePage={currentPage}
        onNavigate={handleNavigate}
      />

      <main className="w-full flex-grow pt-16">
        {/* Render only the active page requested by user */}
        {currentPage === 'home' && (
          <HeroSection
            lab={labData.lab}
            latestNews={labData.news}
            themes={labData.themes}
            publications={labData.publications}
            members={labData.members}
            lang={lang}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'professor' && (
          <ProfessorSection
            professor={labData.professor}
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateRecruitment={() => handleNavigate('recruitment')}
          />
        )}

        {currentPage === 'research' && (
          <ResearchSection
            themes={labData.themes}
            projects={labData.projects}
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'publications' && (
          <PublicationSection
            publications={labData.publications}
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
            onOpenBibtex={(pub) => setSelectedBibtexPub(pub)}
          />
        )}

        {currentPage === 'members' && (
          <MemberSection
            members={labData.members}
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'news' && (
          <NewsSection
            news={labData.news}
            seminars={labData.seminars}
            gallery={labData.gallery}
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'recruitment' && (
          <RecruitmentSection
            recruitment={labData.recruitment}
            labEmail={labData.lab.contactEmail}
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactSection
            lab={labData.lab}
            lang={lang}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Consistent Footer across all pages */}
      <Footer
        lab={labData.lab}
        lang={lang}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAuthModalOpen(true)}
      />

      {/* BibTeX / Citation Modal */}
      {selectedBibtexPub && (
        <BibtexModal
          publication={selectedBibtexPub}
          onClose={() => setSelectedBibtexPub(null)}
        />
      )}

      {/* Admin Password Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsAdminOpen(true);
        }}
        lang={lang}
      />

      {/* Admin CMS Editor Modal */}
      {isAdminOpen && (
        <AdminEditorModal
          data={labData}
          onSave={handleSaveData}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}
      <Analytics />
    </div>
  );
}
