import React, { useState, useEffect, useRef } from 'react';
import { LabFullData, Publication, LabMember, NewsItem, ResearchTheme, ResearchProject } from '../types';
import { 
  X, Save, Download, Upload, RotateCcw, 
  Plus, Trash2, Edit3, Settings, BookOpen, 
  Users, Bell, Info, Check, Sparkles, Search,
  AlertTriangle, CheckCircle2, FolderGit2,
  Layers, Camera, Image as ImageIcon,
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown,
  ArrowUpDown, ListOrdered, ArrowDownAZ, ArrowUpAZ, Calendar, GraduationCap,
  Lock, Shield, KeyRound, Eye, EyeOff, ShieldCheck, User,
  Briefcase, Award
} from 'lucide-react';
import { initialLabData } from '../data/initialLabData';
import { getStoredAdminPin, setStoredAdminPin, DEFAULT_ADMIN_PIN } from './AdminAuthModal';
import { compressImageFile } from '../utils/imageCompressor';
import { 
  sortPublicationsByYear, 
  sortProjectsByYear, 
  sortNewsByDate, 
  sortAwardsByYear, 
  sortExperienceByYear, 
  sortEducationByYear 
} from '../utils/sorters';

interface AdminEditorModalProps {
  data: LabFullData;
  onSave: (newData: LabFullData) => void;
  onClose: () => void;
}

interface ConfirmState {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

export const AdminEditorModal: React.FC<AdminEditorModalProps> = ({ data, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'professor' | 'themes' | 'projects' | 'publications' | 'members' | 'news' | 'json' | 'security'>('basic');
  const [formData, setFormData] = useState<LabFullData>(JSON.parse(JSON.stringify(data)));
  
  // Custom Toast State (No iframe-blocked alerts!)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Custom Confirmation Modal State (No iframe-blocked confirm()!)
  const [confirmModal, setConfirmModal] = useState<ConfirmState | null>(null);

  // Security / Password State
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);

  // Search queries in admin tabs
  const [pubSearch, setPubSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  // Editing existing publication state
  const [editingPubId, setEditingPubId] = useState<string | null>(null);
  const [editPubForm, setEditPubForm] = useState<Publication | null>(null);

  // New Publication Quick State
  const [newPub, setNewPub] = useState<Partial<Publication>>({
    title: '',
    authors: ['김민수*'],
    venue: '',
    venueType: 'SCI/SCIE Journal',
    category: 'journal',
    year: new Date().getFullYear(),
    month: '',
    pages: '',
    doi: '',
    abstract: '',
    pdfUrl: '',
    codeUrl: '',
    award: '',
    bibtex: '',
    tags: [],
    isHighlighted: false
  });
  const [pubAuthorInput, setPubAuthorInput] = useState('');
  const [pubTagInput, setPubTagInput] = useState('');

  // Professor Experience Management State
  const [newExp, setNewExp] = useState<{ period: string; role: string; institution: string }>({
    period: '',
    role: '',
    institution: ''
  });
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [editExpForm, setEditExpForm] = useState<{ period: string; role: string; institution: string } | null>(null);

  // Professor Awards Management State
  const [newAward, setNewAward] = useState<{ year: string; title: string; organization: string }>({
    year: '',
    title: '',
    organization: ''
  });
  const [editingAwardIndex, setEditingAwardIndex] = useState<number | null>(null);
  const [editAwardForm, setEditAwardForm] = useState<{ year: string; title: string; organization: string } | null>(null);

  // Editing existing member state
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editMemberForm, setEditMemberForm] = useState<LabMember | null>(null);

  // New Member Quick State
  const [newMember, setNewMember] = useState<Partial<LabMember>>({
    nameKo: '',
    nameEn: '',
    role: 'ms',
    roleTitleKo: '석사과정',
    roleTitleEn: 'M.S. Student',
    admissionYear: '',
    graduationYear: '',
    customNote: '',
    currentAffiliation: '',
    email: '',
    researchInterests: [],
    avatarUrl: ''
  });
  const [memberInterestInput, setMemberInterestInput] = useState('');

  // Editing existing news state
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editNewsForm, setEditNewsForm] = useState<NewsItem | null>(null);

  // New News Quick State
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    titleKo: '',
    titleEn: '',
    category: 'paper',
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    contentKo: '',
    contentEn: '',
    isImportant: false
  });

  // Research Theme State
  const [newTheme, setNewTheme] = useState<Partial<ResearchTheme>>({
    titleKo: '',
    titleEn: '',
    iconName: 'Activity',
    descriptionKo: '',
    descriptionEn: '',
    keywords: [],
    sampleTopics: []
  });
  const [themeKeywordInput, setThemeKeywordInput] = useState('');

  // Project State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectForm, setEditProjectForm] = useState<ResearchProject | null>(null);
  const [newProject, setNewProject] = useState<Partial<ResearchProject>>({
    titleKo: '',
    titleEn: '',
    fundingAgency: '한국연구재단 (NRF)',
    agencyType: 'government',
    period: '2025 - 2028',
    role: '연구책임자 (PI)',
    status: 'ongoing',
    budget: '',
    keywords: [],
    descriptionKo: ''
  });

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 3000);
  };

  const handleSaveAll = () => {
    let currentData = { ...formData };
    if (editingPubId && editPubForm) {
      if (editPubForm.title?.trim() && editPubForm.venue?.trim()) {
        const cleanYear = Number(editPubForm.year) || new Date().getFullYear();
        const updatedPub: Publication = {
          ...editPubForm,
          title: editPubForm.title.trim(),
          venue: editPubForm.venue.trim(),
          year: cleanYear,
          abstract: (editPubForm.abstract || '').trim(),
          award: (editPubForm.award || '').trim()
        };
        currentData.publications = currentData.publications.map(p => p.id === updatedPub.id ? updatedPub : p);
      }
    }
    if (editingProjectId && editProjectForm) {
      if (editProjectForm.titleKo?.trim()) {
        const updatedProj: ResearchProject = {
          ...editProjectForm,
          titleKo: editProjectForm.titleKo.trim()
        };
        currentData.projects = currentData.projects.map(p => p.id === updatedProj.id ? updatedProj : p);
      }
    }
    if (editingMemberId && editMemberForm) {
      if (editMemberForm.nameKo?.trim()) {
        currentData.members = currentData.members.map(m => m.id === editMemberForm.id ? editMemberForm : m);
      }
    }
    if (editingNewsId && editNewsForm) {
      if (editNewsForm.titleKo?.trim()) {
        currentData.news = currentData.news.map(n => n.id === editNewsForm.id ? editNewsForm : n);
      }
    }

    // Auto sort all collections by year/date descending
    currentData.publications = sortPublicationsByYear(currentData.publications);
    currentData.projects = sortProjectsByYear(currentData.projects);
    currentData.news = sortNewsByDate(currentData.news);
    if (currentData.professor) {
      currentData.professor = {
        ...currentData.professor,
        awards: sortAwardsByYear(currentData.professor.awards || []),
        experience: sortExperienceByYear(currentData.professor.experience || []),
        education: sortEducationByYear(currentData.professor.education || [])
      };
    }

    setFormData(currentData);
    onSave(currentData);
    showToast('모든 변경사항이 연도별로 자동 정렬되어 즉시 저장되었습니다!', 'success');
  };

  const handleSafeClose = () => {
    let currentData = { ...formData };
    if (editingPubId && editPubForm) {
      if (editPubForm.title?.trim() && editPubForm.venue?.trim()) {
        const cleanYear = Number(editPubForm.year) || new Date().getFullYear();
        const updatedPub: Publication = {
          ...editPubForm,
          title: editPubForm.title.trim(),
          venue: editPubForm.venue.trim(),
          year: cleanYear,
          abstract: (editPubForm.abstract || '').trim(),
          award: (editPubForm.award || '').trim()
        };
        currentData.publications = currentData.publications.map(p => p.id === updatedPub.id ? updatedPub : p);
      }
    }
    if (editingProjectId && editProjectForm) {
      if (editProjectForm.titleKo?.trim()) {
        const updatedProj: ResearchProject = {
          ...editProjectForm,
          titleKo: editProjectForm.titleKo.trim()
        };
        currentData.projects = currentData.projects.map(p => p.id === updatedProj.id ? updatedProj : p);
      }
    }
    if (editingMemberId && editMemberForm) {
      if (editMemberForm.nameKo?.trim()) {
        currentData.members = currentData.members.map(m => m.id === editMemberForm.id ? editMemberForm : m);
      }
    }
    if (editingNewsId && editNewsForm) {
      if (editNewsForm.titleKo?.trim()) {
        currentData.news = currentData.news.map(n => n.id === editNewsForm.id ? editNewsForm : n);
      }
    }
    onSave(currentData);
    onClose();
  };

  // Auto sync formData to parent & localStorage on changes
  useEffect(() => {
    onSave(formData);
  }, [formData]);

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jnu-lab-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('연구실 데이터 백업 JSON 파일이 다운로드되었습니다.', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.lab && parsed.professor && parsed.publications) {
          setFormData(parsed);
          onSave(parsed);
          showToast('JSON 데이터를 성공적으로 불러와 사이트에 적용했습니다!', 'success');
        } else {
          showToast('올바른 연구실 데이터 JSON 형식이 아닙니다.', 'error');
        }
      } catch (err) {
        showToast('JSON 파싱 중 오류가 발생했습니다.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    setConfirmModal({
      title: '기본 데이터 복원 확인',
      message: '김민수 교수님 연구실 기본 데이터(27편의 학술 논문 및 실적, 구성원 정보)로 복원하시겠습니까? 현재 수정한 내용이 초기화됩니다.',
      confirmText: '초기화 실행',
      isDestructive: true,
      onConfirm: () => {
        setFormData(initialLabData);
        onSave(initialLabData);
        setEditingPubId(null);
        setEditingMemberId(null);
        setEditingNewsId(null);
        setConfirmModal(null);
        showToast('기본 데이터로 성공적으로 복원되었습니다.', 'success');
      }
    });
  };

  // ================= PUBLICATIONS =================
  const handleAddPublication = () => {
    if (!newPub.title?.trim() || !newPub.venue?.trim()) {
      showToast('논문 제목과 발표 학회/저널명을 입력해주세요.', 'error');
      return;
    }
    const authors = pubAuthorInput.trim() ? pubAuthorInput.split(',').map(a => a.trim()).filter(Boolean) : ['김민수*'];
    const tags = pubTagInput.trim() ? pubTagInput.split(',').map(t => t.trim()).filter(Boolean) : ['통계분석'];
    const cleanAbstract = (newPub.abstract || '').trim();
    const cleanYear = Number(newPub.year) || new Date().getFullYear();

    const created: Publication = {
      id: `pub-${Date.now()}`,
      title: newPub.title.trim(),
      authors: authors,
      venue: newPub.venue.trim(),
      venueType: newPub.venueType || 'SCI/SCIE Journal',
      category: newPub.category || 'journal',
      year: cleanYear,
      month: newPub.month || '',
      pages: '',
      doi: '',
      pdfUrl: '',
      codeUrl: '',
      award: (newPub.award || '').trim(),
      isHighlighted: !!newPub.isHighlighted,
      abstract: cleanAbstract,
      bibtex: `@article{pub${Date.now()},\n  title={${newPub.title.trim()}},\n  author={${authors.join(' and ')}},\n  journal={${newPub.venue.trim()}},\n  year={${cleanYear}}\n}`,
      tags: tags
    };

    const updatedPublications = sortPublicationsByYear([created, ...formData.publications]);
    const updatedFormData = {
      ...formData,
      publications: updatedPublications,
      lab: {
        ...formData.lab,
        stats: {
          ...formData.lab.stats,
          publicationsCount: updatedPublications.length
        }
      }
    };

    setFormData(updatedFormData);
    onSave(updatedFormData); // Auto-persist

    setNewPub({
      title: '',
      authors: ['김민수*'],
      venue: '',
      venueType: 'SCI/SCIE Journal',
      category: 'journal',
      year: new Date().getFullYear(),
      month: '',
      pages: '',
      doi: '',
      pdfUrl: '',
      codeUrl: '',
      award: '',
      abstract: '',
      bibtex: '',
      tags: [],
      isHighlighted: false
    });
    setPubAuthorInput('');
    setPubTagInput('');
    showToast('새 논문이 등록되어 저장되었습니다!', 'success');
  };

  const handleStartEditPub = (pub: Publication) => {
    setEditingPubId(pub.id);
    setEditPubForm(JSON.parse(JSON.stringify(pub)));
  };

  const handleSaveEditPub = () => {
    if (!editPubForm) return;
    if (!editPubForm.title?.trim() || !editPubForm.venue?.trim()) {
      showToast('논문 제목과 발표 학회/저널명을 입력해주세요.', 'error');
      return;
    }
    const cleanAbstract = (editPubForm.abstract || '').trim();
    const cleanYear = Number(editPubForm.year) || new Date().getFullYear();

    const updatedPub: Publication = {
      ...editPubForm,
      title: editPubForm.title.trim(),
      venue: editPubForm.venue.trim(),
      pages: '',
      doi: '',
      pdfUrl: '',
      codeUrl: '',
      abstract: cleanAbstract,
      year: cleanYear,
      award: (editPubForm.award || '').trim(),
      bibtex: `@article{pub${editPubForm.id.replace(/[^a-zA-Z0-9]/g, '')},\n  title={${editPubForm.title.trim()}},\n  author={${editPubForm.authors.join(' and ')}},\n  journal={${editPubForm.venue.trim()}},\n  year={${cleanYear}}\n}`
    };

    const updatedPubList = sortPublicationsByYear(
      formData.publications.map(p => p.id === updatedPub.id ? updatedPub : p)
    );
    const updatedFormData = {
      ...formData,
      publications: updatedPubList
    };
    setFormData(updatedFormData);
    onSave(updatedFormData); // Auto-persist
    setEditingPubId(null);
    setEditPubForm(null);
    showToast('논문 수정 내용이 반영되었습니다.', 'success');
  };

  const handleDeletePublication = (id: string, title: string) => {
    setConfirmModal({
      title: '논문 실적 삭제 확인',
      message: `"${title}" 논문을 실적 목록에서 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      isDestructive: true,
      onConfirm: () => {
        const updatedPubs = formData.publications.filter(p => p.id !== id);
        const updatedFormData = {
          ...formData,
          publications: updatedPubs,
          lab: {
            ...formData.lab,
            stats: {
              ...formData.lab.stats,
              publicationsCount: Math.max(0, updatedPubs.length)
            }
          }
        };
        setFormData(updatedFormData);
        onSave(updatedFormData); // Auto-persist
        if (editingPubId === id) {
          setEditingPubId(null);
          setEditPubForm(null);
        }
        setConfirmModal(null);
        showToast('논문이 삭제되었습니다.', 'success');
      }
    });
  };

  // ================= PROFESSOR EXPERIENCE =================
  const handleAddExperience = () => {
    if (!newExp.role.trim() || !newExp.institution.trim()) {
      showToast('직함/역할 및 소속 기관명을 입력해주세요.', 'error');
      return;
    }
    const updatedExp = [
      {
        period: newExp.period.trim() || '기간 미지정',
        role: newExp.role.trim(),
        institution: newExp.institution.trim()
      },
      ...(formData.professor.experience || [])
    ];
    const updated = {
      ...formData,
      professor: {
        ...formData.professor,
        experience: updatedExp
      }
    };
    setFormData(updated);
    onSave(updated);
    setNewExp({ period: '', role: '', institution: '' });
    showToast('새 주요 경력이 추가되었습니다.', 'success');
  };

  const handleSaveEditExperience = () => {
    if (editingExpIndex === null || !editExpForm) return;
    const currentList = [...(formData.professor.experience || [])];
    currentList[editingExpIndex] = {
      period: editExpForm.period.trim() || '기간 미지정',
      role: editExpForm.role.trim(),
      institution: editExpForm.institution.trim()
    };
    const updated = {
      ...formData,
      professor: {
        ...formData.professor,
        experience: currentList
      }
    };
    setFormData(updated);
    onSave(updated);
    setEditingExpIndex(null);
    setEditExpForm(null);
    showToast('경력 정보가 수정되었습니다.', 'success');
  };

  const handleDeleteExperience = (index: number) => {
    const item = formData.professor.experience[index];
    setConfirmModal({
      title: '경력 항목 삭제',
      message: `"${item?.role} (${item?.institution})" 경력을 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      isDestructive: true,
      onConfirm: () => {
        const currentList = formData.professor.experience.filter((_, idx) => idx !== index);
        const updated = {
          ...formData,
          professor: {
            ...formData.professor,
            experience: currentList
          }
        };
        setFormData(updated);
        onSave(updated);
        if (editingExpIndex === index) {
          setEditingExpIndex(null);
          setEditExpForm(null);
        }
        setConfirmModal(null);
        showToast('경력 항목이 삭제되었습니다.', 'success');
      }
    });
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    const list = [...(formData.professor.experience || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const updated = {
      ...formData,
      professor: {
        ...formData.professor,
        experience: list
      }
    };
    setFormData(updated);
    onSave(updated);
  };

  // ================= PROFESSOR AWARDS =================
  const handleAddAward = () => {
    if (!newAward.title.trim() || !newAward.organization.trim()) {
      showToast('수상 및 표창명과 수여기관을 입력해주세요.', 'error');
      return;
    }
    const updatedAwards = [
      {
        year: newAward.year.trim() || '연도 미지정',
        title: newAward.title.trim(),
        organization: newAward.organization.trim()
      },
      ...(formData.professor.awards || [])
    ];
    const updated = {
      ...formData,
      professor: {
        ...formData.professor,
        awards: updatedAwards
      }
    };
    setFormData(updated);
    onSave(updated);
    setNewAward({ year: '', title: '', organization: '' });
    showToast('새 수상 및 서훈 내역이 추가되었습니다.', 'success');
  };

  const handleSaveEditAward = () => {
    if (editingAwardIndex === null || !editAwardForm) return;
    const currentList = [...(formData.professor.awards || [])];
    currentList[editingAwardIndex] = {
      year: editAwardForm.year.trim() || '연도 미지정',
      title: editAwardForm.title.trim(),
      organization: editAwardForm.organization.trim()
    };
    const updated = {
      ...formData,
      professor: {
        ...formData.professor,
        awards: currentList
      }
    };
    setFormData(updated);
    onSave(updated);
    setEditingAwardIndex(null);
    setEditAwardForm(null);
    showToast('수상 내역이 수정되었습니다.', 'success');
  };

  const handleDeleteAward = (index: number) => {
    const item = formData.professor.awards[index];
    setConfirmModal({
      title: '수상 내역 삭제',
      message: `"${item?.title}" 수상 내역을 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      isDestructive: true,
      onConfirm: () => {
        const currentList = formData.professor.awards.filter((_, idx) => idx !== index);
        const updated = {
          ...formData,
          professor: {
            ...formData.professor,
            awards: currentList
          }
        };
        setFormData(updated);
        onSave(updated);
        if (editingAwardIndex === index) {
          setEditingAwardIndex(null);
          setEditAwardForm(null);
        }
        setConfirmModal(null);
        showToast('수상 내역이 삭제되었습니다.', 'success');
      }
    });
  };

  const handleMoveAward = (index: number, direction: 'up' | 'down') => {
    const list = [...(formData.professor.awards || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const updated = {
      ...formData,
      professor: {
        ...formData.professor,
        awards: list
      }
    };
    setFormData(updated);
    onSave(updated);
  };

  // ================= MEMBERS =================
  const handleAddMember = () => {
    if (!newMember.nameKo?.trim()) {
      showToast('구성원의 한글 이름을 입력해주세요.', 'error');
      return;
    }
    const interests = memberInterestInput.trim() ? memberInterestInput.split(',').map(i => i.trim()).filter(Boolean) : [];
    const created: LabMember = {
      id: `mem-${Date.now()}`,
      nameKo: newMember.nameKo.trim(),
      nameEn: newMember.nameEn?.trim() || undefined,
      role: newMember.role || 'ms',
      roleTitleKo: newMember.roleTitleKo || '석사과정',
      roleTitleEn: newMember.roleTitleEn || 'M.S. Student',
      admissionYear: newMember.admissionYear?.trim() || undefined,
      graduationYear: newMember.graduationYear?.trim() || undefined,
      customNote: newMember.customNote?.trim() || undefined,
      email: newMember.email?.trim() || undefined,
      researchInterests: interests,
      avatarUrl: newMember.avatarUrl?.trim() || '',
      currentAffiliation: newMember.currentAffiliation?.trim() || undefined
    };

    const updatedFormData = {
      ...formData,
      members: [...formData.members, created]
    };
    setFormData(updatedFormData);
    onSave(updatedFormData); // Auto-persist

    setNewMember({
      nameKo: '',
      nameEn: '',
      role: 'ms',
      roleTitleKo: '석사과정',
      roleTitleEn: 'M.S. Student',
      admissionYear: '',
      graduationYear: '',
      customNote: '',
      currentAffiliation: '',
      email: '',
      researchInterests: [],
      avatarUrl: ''
    });
    setMemberInterestInput('');
    showToast('연구실 구성원이 추가되었습니다!', 'success');
  };

  const handleStartEditMember = (mem: LabMember) => {
    setEditingMemberId(mem.id);
    setEditMemberForm(JSON.parse(JSON.stringify(mem)));
  };

  const handleSaveEditMember = () => {
    if (!editMemberForm) return;
    const cleanMem: LabMember = {
      ...editMemberForm,
      nameKo: editMemberForm.nameKo.trim(),
      nameEn: editMemberForm.nameEn?.trim() || undefined,
      admissionYear: editMemberForm.admissionYear?.trim() || undefined,
      graduationYear: editMemberForm.graduationYear?.trim() || undefined,
      customNote: editMemberForm.customNote?.trim() || undefined,
      email: editMemberForm.email?.trim() || undefined,
      currentAffiliation: editMemberForm.currentAffiliation?.trim() || undefined
    };
    const updatedFormData = {
      ...formData,
      members: formData.members.map(m => m.id === cleanMem.id ? cleanMem : m)
    };
    setFormData(updatedFormData);
    onSave(updatedFormData); // Auto-persist
    setEditingMemberId(null);
    setEditMemberForm(null);
    showToast('구성원 정보가 수정되었습니다.', 'success');
  };

  const handleDeleteMember = (id: string, name: string) => {
    setConfirmModal({
      title: '구성원 삭제 확인',
      message: `"${name}" 구성원을 연구실 멤버 목록에서 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      isDestructive: true,
      onConfirm: () => {
        const updatedMembers = formData.members.filter(m => m.id !== id);
        const updatedFormData = {
          ...formData,
          members: updatedMembers
        };
        setFormData(updatedFormData);
        onSave(updatedFormData); // Auto-persist
        if (editingMemberId === id) {
          setEditingMemberId(null);
          setEditMemberForm(null);
        }
        setConfirmModal(null);
        showToast(`"${name}" 구성원이 삭제되었습니다.`, 'success');
      }
    });
  };

  // ================= NEWS =================
  const handleAddNews = () => {
    if (!newNews.titleKo?.trim()) {
      showToast('소식 제목을 입력해주세요.', 'error');
      return;
    }
    const created: NewsItem = {
      id: `news-${Date.now()}`,
      titleKo: newNews.titleKo || '',
      titleEn: newNews.titleEn || newNews.titleKo || '',
      category: newNews.category || 'paper',
      date: newNews.date || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      contentKo: newNews.contentKo || '',
      contentEn: newNews.contentEn || newNews.contentKo || '',
      isImportant: !!newNews.isImportant
    };

    const updatedNewsList = sortNewsByDate([created, ...formData.news]);
    const updatedFormData = {
      ...formData,
      news: updatedNewsList
    };
    setFormData(updatedFormData);
    onSave(updatedFormData); // Auto-persist

    setNewNews({
      titleKo: '',
      titleEn: '',
      category: 'paper',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      contentKo: '',
      contentEn: '',
      isImportant: false
    });
    showToast('새 소식이 등록되었습니다!', 'success');
  };

  const handleStartEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setEditNewsForm(JSON.parse(JSON.stringify(item)));
  };

  const handleSaveEditNews = () => {
    if (!editNewsForm) return;
    const updatedNewsList = sortNewsByDate(
      formData.news.map(n => n.id === editNewsForm.id ? editNewsForm : n)
    );
    const updatedFormData = {
      ...formData,
      news: updatedNewsList
    };
    setFormData(updatedFormData);
    onSave(updatedFormData); // Auto-persist
    setEditingNewsId(null);
    setEditNewsForm(null);
    showToast('소식 수정이 완료되었습니다.', 'success');
  };

  const handleDeleteNews = (id: string, title: string) => {
    setConfirmModal({
      title: '소식 삭제 확인',
      message: `"${title}" 소식을 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      isDestructive: true,
      onConfirm: () => {
        const updatedNews = formData.news.filter(n => n.id !== id);
        const updatedFormData = {
          ...formData,
          news: updatedNews
        };
        setFormData(updatedFormData);
        onSave(updatedFormData); // Auto-persist
        if (editingNewsId === id) {
          setEditingNewsId(null);
          setEditNewsForm(null);
        }
        setConfirmModal(null);
        showToast('소식이 삭제되었습니다.', 'success');
      }
    });
  };

  // ================= THEMES =================
  const handleAddTheme = () => {
    if (!newTheme.titleKo?.trim()) {
      showToast('연구 주제 제목을 입력해주세요.', 'error');
      return;
    }
    const kw = themeKeywordInput.trim() ? themeKeywordInput.split(',').map(k => k.trim()).filter(Boolean) : ['통계분석', '의료AI'];
    const created: ResearchTheme = {
      id: `theme-${Date.now()}`,
      titleKo: newTheme.titleKo || '',
      titleEn: newTheme.titleEn || newTheme.titleKo || '',
      iconName: newTheme.iconName || 'Activity',
      descriptionKo: newTheme.descriptionKo || '',
      descriptionEn: newTheme.descriptionEn || '',
      keywords: kw,
      sampleTopics: []
    };
    const updatedFormData = {
      ...formData,
      themes: [...formData.themes, created]
    };
    setFormData(updatedFormData);
    onSave(updatedFormData);
    setNewTheme({
      titleKo: '',
      titleEn: '',
      iconName: 'Activity',
      descriptionKo: '',
      descriptionEn: '',
      keywords: [],
      sampleTopics: []
    });
    setThemeKeywordInput('');
    showToast('새 연구 주제가 추가되었습니다.', 'success');
  };

  const handleDeleteTheme = (id: string, title: string) => {
    setConfirmModal({
      title: '연구 주제 삭제 확인',
      message: `"${title}" 연구 주제를 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      isDestructive: true,
      onConfirm: () => {
        const updatedThemes = formData.themes.filter(t => t.id !== id);
        const updatedFormData = { ...formData, themes: updatedThemes };
        setFormData(updatedFormData);
        onSave(updatedFormData);
        setConfirmModal(null);
        showToast('연구 주제가 삭제되었습니다.', 'success');
      }
    });
  };

  // ================= PROJECTS =================
  const handleAddProject = () => {
    if (!newProject.titleKo?.trim()) {
      showToast('연구 과제명을 입력해주세요.', 'error');
      return;
    }
    const created: ResearchProject = {
      id: `proj-${Date.now()}`,
      titleKo: newProject.titleKo || '',
      titleEn: newProject.titleEn || newProject.titleKo || '',
      fundingAgency: newProject.fundingAgency || '한국연구재단 (NRF)',
      agencyType: newProject.agencyType || 'government',
      period: newProject.period || '2025 - 2028',
      role: newProject.role || '연구책임자 (PI)',
      status: newProject.status || 'ongoing',
      budget: newProject.budget || '',
      keywords: ['통계분석', '의료AI'],
      descriptionKo: newProject.descriptionKo || ''
    };
    const updatedProjects = sortProjectsByYear([...formData.projects, created]);
    const updatedFormData = {
      ...formData,
      projects: updatedProjects
    };
    setFormData(updatedFormData);
    onSave(updatedFormData);
    setNewProject({
      titleKo: '',
      titleEn: '',
      fundingAgency: '한국연구재단 (NRF)',
      agencyType: 'government',
      period: '2025 - 2028',
      role: '연구책임자 (PI)',
      status: 'ongoing',
      budget: '',
      keywords: [],
      descriptionKo: ''
    });
    showToast('새 연구 과제가 추가되었습니다.', 'success');
  };

  const handleStartEditProject = (proj: ResearchProject) => {
    setEditingProjectId(proj.id);
    setEditProjectForm(JSON.parse(JSON.stringify(proj)));
  };

  const handleSaveEditProject = () => {
    if (!editProjectForm) return;
    if (!editProjectForm.titleKo?.trim()) {
      showToast('과제명을 입력해주세요.', 'error');
      return;
    }
    const updatedProjects = sortProjectsByYear(
      formData.projects.map(p => p.id === editProjectForm.id ? editProjectForm : p)
    );
    const updatedFormData = { ...formData, projects: updatedProjects };
    setFormData(updatedFormData);
    onSave(updatedFormData);
    setEditingProjectId(null);
    setEditProjectForm(null);
    showToast('연구 과제 정보가 수정되었습니다.', 'success');
  };

  const handleDeleteProject = (id: string, title: string) => {
    setConfirmModal({
      title: '연구 과제 삭제 확인',
      message: `"${title}" 과제를 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      isDestructive: true,
      onConfirm: () => {
        const updatedProjects = formData.projects.filter(p => p.id !== id);
        const updatedFormData = { ...formData, projects: updatedProjects };
        setFormData(updatedFormData);
        onSave(updatedFormData);
        if (editingProjectId === id) {
          setEditingProjectId(null);
          setEditProjectForm(null);
        }
        setConfirmModal(null);
        showToast('연구 과제가 삭제되었습니다.', 'success');
      }
    });
  };

  // ================= REORDERING & SORTING LOGIC =================
  const moveItemInArray = <T extends { id: string }>(
    list: T[],
    id: string,
    direction: 'up' | 'down' | 'top' | 'bottom'
  ): T[] => {
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return list;
    const result = [...list];
    const item = result[index];

    if (direction === 'up') {
      if (index === 0) return list;
      result.splice(index, 1);
      result.splice(index - 1, 0, item);
    } else if (direction === 'down') {
      if (index === list.length - 1) return list;
      result.splice(index, 1);
      result.splice(index + 1, 0, item);
    } else if (direction === 'top') {
      if (index === 0) return list;
      result.splice(index, 1);
      result.unshift(item);
    } else if (direction === 'bottom') {
      if (index === list.length - 1) return list;
      result.splice(index, 1);
      result.push(item);
    }
    return result;
  };

  const handleMovePublication = (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => {
    const updatedPubs = moveItemInArray(formData.publications, id, dir);
    const updated = { ...formData, publications: updatedPubs };
    setFormData(updated);
    onSave(updated);
    showToast('논문 표시 순서가 변경되었습니다.', 'success');
  };

  const handleSortPublications = (mode: 'year-desc' | 'year-asc' | 'title-asc') => {
    const sorted = [...formData.publications].sort((a, b) => {
      if (mode === 'year-desc') {
        if (b.year !== a.year) return b.year - a.year;
        return a.title.localeCompare(b.title);
      } else if (mode === 'year-asc') {
        if (a.year !== b.year) return a.year - b.year;
        return a.title.localeCompare(b.title);
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    const updated = { ...formData, publications: sorted };
    setFormData(updated);
    onSave(updated);
    const labels = {
      'year-desc': '최신 연도순(Newest first)',
      'year-asc': '과거 연도순(Oldest first)',
      'title-asc': '논문 제목 가나다/ABC순'
    };
    showToast(`논문이 ${labels[mode]}으로 정렬되어 저장되었습니다.`, 'success');
  };

  const handleMoveMember = (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => {
    const updatedMembers = moveItemInArray(formData.members, id, dir);
    const updated = { ...formData, members: updatedMembers };
    setFormData(updated);
    onSave(updated);
    showToast('구성원 표시 순서가 변경되었습니다.', 'success');
  };

  const handleSortMembers = (mode: 'role-hierarchy' | 'admission-desc' | 'name-asc') => {
    const roleRank: Record<string, number> = {
      'postdoc': 1,
      'phd': 2,
      'integrated': 3,
      'ms': 4,
      'intern': 5,
      'alumni': 6
    };
    const sorted = [...formData.members].sort((a, b) => {
      if (mode === 'role-hierarchy') {
        const rankA = roleRank[a.role] || 99;
        const rankB = roleRank[b.role] || 99;
        if (rankA !== rankB) return rankA - rankB;
        return (parseInt(b.admissionYear) || 0) - (parseInt(a.admissionYear) || 0);
      } else if (mode === 'admission-desc') {
        const yearA = parseInt(a.admissionYear) || 0;
        const yearB = parseInt(b.admissionYear) || 0;
        if (yearB !== yearA) return yearB - yearA;
        return a.nameKo.localeCompare(b.nameKo);
      } else {
        return a.nameKo.localeCompare(b.nameKo);
      }
    });
    const updated = { ...formData, members: sorted };
    setFormData(updated);
    onSave(updated);
    const labels = {
      'role-hierarchy': '직급/학위 순서(박사→석박→석사→학부)',
      'admission-desc': '최신 입학년도순',
      'name-asc': '이름 가나다순'
    };
    showToast(`구성원이 ${labels[mode]}으로 정렬되어 저장되었습니다.`, 'success');
  };

  const handleMoveNews = (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => {
    const updatedNews = moveItemInArray(formData.news, id, dir);
    const updated = { ...formData, news: updatedNews };
    setFormData(updated);
    onSave(updated);
    showToast('소식 표시 순서가 변경되었습니다.', 'success');
  };

  const handleSortNews = (mode: 'date-desc' | 'date-asc') => {
    const sorted = [...formData.news].sort((a, b) => {
      const dateA = a.date.replace(/[^0-9]/g, '');
      const dateB = b.date.replace(/[^0-9]/g, '');
      return mode === 'date-desc' ? dateB.localeCompare(dateA) : dateA.localeCompare(dateB);
    });
    const updated = { ...formData, news: sorted };
    setFormData(updated);
    onSave(updated);
    showToast(`소식이 ${mode === 'date-desc' ? '최신 날짜순' : '과거 날짜순'}으로 정렬되어 저장되었습니다.`, 'success');
  };

  const handleMoveTheme = (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => {
    const updatedThemes = moveItemInArray(formData.themes, id, dir);
    const updated = { ...formData, themes: updatedThemes };
    setFormData(updated);
    onSave(updated);
    showToast('연구 주제 순서가 변경되었습니다.', 'success');
  };

  const handleMoveProject = (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => {
    const updatedProjects = moveItemInArray(formData.projects, id, dir);
    const updated = { ...formData, projects: updatedProjects };
    setFormData(updated);
    onSave(updated);
    showToast('연구 과제 순서가 변경되었습니다.', 'success');
  };

  const handleSortProjects = (mode: 'ongoing-first') => {
    const sorted = [...formData.projects].sort((a, b) => {
      if (mode === 'ongoing-first') {
        if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
        if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
        return b.period.localeCompare(a.period);
      }
      return 0;
    });
    const updated = { ...formData, projects: sorted };
    setFormData(updated);
    onSave(updated);
    showToast('수행중인 과제가 우선 배치되도록 정렬되었습니다.', 'success');
  };

  // ================= SECURITY & PIN LOGIC =================
  const handleChangeAdminPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentSaved = getStoredAdminPin();
    if (currentPinInput !== currentSaved) {
      showToast('현재 비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    if (!newPinInput.trim()) {
      showToast('새 비밀번호를 입력해주세요.', 'error');
      return;
    }
    if (newPinInput.trim().length < 4) {
      showToast('비밀번호는 최소 4자리 이상이어야 합니다.', 'error');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      showToast('새 비밀번호와 확인 입력이 일치하지 않습니다.', 'error');
      return;
    }
    setStoredAdminPin(newPinInput.trim());
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    showToast('관리자 비밀번호가 성공적으로 변경되었습니다!', 'success');
  };

  const handleResetAdminPin = () => {
    setConfirmModal({
      title: '관리자 비밀번호 초기화',
      message: `관리자 비밀번호를 기본 번호(${DEFAULT_ADMIN_PIN})로 초기화하시겠습니까?`,
      confirmText: '초기화하기',
      isDestructive: false,
      onConfirm: () => {
        setStoredAdminPin(DEFAULT_ADMIN_PIN);
        setCurrentPinInput('');
        setNewPinInput('');
        setConfirmPinInput('');
        setConfirmModal(null);
        showToast(`관리자 비밀번호가 기본값(${DEFAULT_ADMIN_PIN})으로 재설정되었습니다.`, 'success');
      }
    });
  };

  // Filtered publications for admin view
  const filteredPubs = formData.publications.filter(p => {
    if (!pubSearch) return true;
    const q = pubSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q) ||
      p.authors.some(a => a.toLowerCase().includes(q));
  });

  // Filtered members for admin view
  const filteredMembers = formData.members.filter(m => {
    if (!memberSearch) return true;
    const q = memberSearch.toLowerCase();
    return m.nameKo.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.roleTitleKo.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q));
  });

  return (
    <div id="admin-cms-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-5xl max-h-[94vh] rounded-sm border border-slate-300 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Custom Toast Banner */}
        {toast && (
          <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-sm shadow-lg flex items-center gap-2 text-xs font-mono font-bold animate-fadeIn border ${
            toast.type === 'success' 
              ? 'bg-[#e0f2fe] text-sky-950 border-[#8ed0fa]' 
              : toast.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-slate-100 text-slate-900 border-slate-300'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{toast.text}</span>
          </div>
        )}

        {/* Custom Confirmation Dialog Overlay */}
        {confirmModal && (
          <div className="absolute inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white max-w-md w-full p-6 rounded-sm border border-slate-300 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-sm bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-950 text-base">{confirmModal.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{confirmModal.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 rounded-sm text-xs font-mono text-slate-600 hover:bg-slate-100 transition border border-slate-200"
                >
                  {confirmModal.cancelText || '취소'}
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 rounded-sm text-xs font-mono font-bold transition shadow-xs ${
                    confirmModal.isDestructive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 border border-[#8ed0fa]'
                  }`}
                >
                  {confirmModal.confirmText || '확인'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-[#b7e0fa] flex items-center justify-center border border-[#9ed3f7]">
              <Settings className="w-4 h-4 text-sky-900" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-950 flex items-center gap-2">
                연구실 관리자 CMS (Lab Content Manager)
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                관리자: {formData.professor.email || 'kimms@chonnam.ac.kr'} · 실시간 수정 & 로컬 저장 지원
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="admin-save-all-btn"
              onClick={handleSaveAll}
              className="px-3.5 py-1.5 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold text-xs rounded-sm transition flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>전체 저장 (Save All)</span>
            </button>
            <button
              id="admin-close-top-btn"
              onClick={handleSafeClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-sm transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 px-6 pt-2.5 border-b border-slate-200 bg-slate-50 text-xs font-mono shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'basic' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" /> 기본 정보
          </button>
          <button
            onClick={() => setActiveTab('professor')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'professor' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 교수 프로필 & 약력
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'themes' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> 연구 주제 ({formData.themes.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'projects' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" /> 수행 과제 ({formData.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('publications')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'publications' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> 논문·실적 ({formData.publications.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'members' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> 구성원 관리 ({formData.members.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'news' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> 소식/공지 ({formData.news.length})
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'json' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> 데이터 백업 / 복원
          </button>
          <button
            id="admin-security-tab-btn"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-t-sm transition flex items-center gap-1.5 ${
              activeTab === 'security' ? 'bg-white text-sky-900 font-bold border-t-2 border-sky-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 보안·비밀번호 설정
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">

          {/* 1. Basic Lab Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Lab Logo Image Management Box */}
              <div className="p-4 sm:p-5 bg-white rounded-sm border-2 border-sky-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-900 font-mono text-xs font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-700" />
                    <span>홈페이지 상단 연구실 로고 이미지 설정 (Header Logo Image)</span>
                  </h4>
                  {formData.lab.logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...formData,
                          lab: { ...formData.lab, logoUrl: '' }
                        };
                        setFormData(updated);
                        onSave(updated);
                        showToast('기본 텍스트 배지로 복원되었습니다.', 'success');
                      }}
                      className="text-[11px] font-mono text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" /> 로고 제거 (기본 배지 복원)
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-1">
                  {/* Logo Preview (Live Header Preview) */}
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 font-medium">상단 네비게이션 미리보기</span>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm flex items-center gap-2.5 shadow-2xs">
                      {formData.lab.logoUrl ? (
                        <img
                          src={formData.lab.logoUrl}
                          alt="Logo Preview"
                          className="w-9 h-9 rounded-sm object-contain border border-[#8ed0fa] bg-white p-0.5 shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '';
                          }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-sm bg-[#b7e0fa] border border-[#8ed0fa] flex items-center justify-center text-slate-900 font-serif font-bold text-sm shadow-xs">
                          {formData.lab.shortName.slice(0, 3)}
                        </div>
                      )}
                      <span className="font-serif text-slate-900 font-bold text-base tracking-tight">
                        {formData.lab.shortName}
                      </span>
                    </div>
                  </div>

                  {/* Logo Control Inputs */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label
                        htmlFor="lab-logo-upload"
                        className="px-3.5 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold text-xs rounded-sm transition cursor-pointer flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>컴퓨터에서 로고 파일 선택 (Upload Logo)</span>
                      </label>
                      <input
                        id="lab-logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith('image/')) {
                            showToast('이미지 파일(PNG, JPG, SVG, WebP 등)만 업로드할 수 있습니다.', 'error');
                            return;
                          }
                          try {
                            const res = await compressImageFile(file, 600, 0.85);
                            const updated = {
                              ...formData,
                              lab: { ...formData.lab, logoUrl: res }
                            };
                            setFormData(updated);
                            onSave(updated);
                            showToast('연구실 로고 이미지가 최적화되어 즉시 적용되었습니다!', 'success');
                          } catch (err) {
                            showToast('이미지 변환 중 오류가 발생했습니다.', 'error');
                          }
                        }}
                      />
                      <span className="text-[11px] text-slate-500 font-mono">투명 배경의 PNG / SVG 권장</span>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono text-[10px] mb-1">
                        또는 이미지 웹 링크 (URL) 직접 입력:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/lab-logo.png"
                          value={formData.lab.logoUrl || ''}
                          onChange={(e) => {
                            const updated = {
                              ...formData,
                              lab: { ...formData.lab, logoUrl: e.target.value }
                            };
                            setFormData(updated);
                            onSave(updated);
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-sm text-slate-900 text-xs font-mono focus:border-sky-400 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 이름 (국문)</label>
                  <input
                    type="text"
                    value={formData.lab.labNameKo}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, labNameKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 이름 (영문)</label>
                  <input
                    type="text"
                    value={formData.lab.labNameEn}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, labNameEn: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 약칭 (Short Name)</label>
                  <input
                    type="text"
                    value={formData.lab.shortName}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, shortName: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">소속 대학교 / 학과 (국문)</label>
                  <input
                    type="text"
                    value={formData.lab.departmentKo}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, departmentKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 대표 이메일</label>
                  <input
                    type="email"
                    value={formData.lab.contactEmail}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, contactEmail: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 전화번호</label>
                  <input
                    type="text"
                    value={formData.lab.contactPhone}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, contactPhone: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 모토 / 슬로건</label>
                  <input
                    type="text"
                    value={formData.lab.mottoKo}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, mottoKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 상세 소개글</label>
                  <textarea
                    rows={3}
                    value={formData.lab.descriptionKo}
                    onChange={(e) => {
                      const updated = { ...formData, lab: { ...formData.lab, descriptionKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 resize-none focus:border-sky-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Professor Tab */}
          {activeTab === 'professor' && (
            <div className="space-y-5">
              {/* Professor Photo Management Box */}
              <div className="p-4 sm:p-5 bg-white rounded-sm border-2 border-sky-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-900 font-mono text-xs font-bold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-sky-700" />
                    지도교수 프로필 사진 변경 및 관리 (Professor Photo)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const defaultUrl = initialLabData.professor.avatarUrl;
                      const updated = {
                        ...formData,
                        professor: { ...formData.professor, avatarUrl: defaultUrl }
                      };
                      setFormData(updated);
                      onSave(updated);
                      showToast('기본 프로필 사진으로 복원되었습니다.', 'success');
                    }}
                    className="text-[11px] font-mono text-slate-500 hover:text-sky-700 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3" /> 기본 사진으로 복원
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-1">
                  {/* Photo Preview */}
                  <div className="relative group shrink-0">
                    <img
                      src={formData.professor.avatarUrl || initialLabData.professor.avatarUrl}
                      alt={formData.professor.nameKo}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-sm object-cover border-2 border-slate-200 shadow-xs bg-slate-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = initialLabData.professor.avatarUrl;
                      }}
                    />
                    <label 
                      htmlFor="prof-avatar-upload"
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition rounded-sm text-[11px] font-mono text-center p-1"
                    >
                      <Camera className="w-4 h-4 mb-1 text-sky-200" />
                      클릭하여 사진 변경
                    </label>
                  </div>

                  {/* Photo Control Inputs */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label
                        htmlFor="prof-avatar-upload"
                        className="px-3.5 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold text-xs rounded-sm transition cursor-pointer flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>컴퓨터에서 사진 파일 선택 (Upload File)</span>
                      </label>
                      <input
                        id="prof-avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith('image/')) {
                            showToast('이미지 파일(JPG, PNG, WebP 등)만 업로드할 수 있습니다.', 'error');
                            return;
                          }
                          try {
                            const res = await compressImageFile(file, 600, 0.85);
                            const updated = {
                              ...formData,
                              professor: { ...formData.professor, avatarUrl: res }
                            };
                            setFormData(updated);
                            onSave(updated);
                            showToast('교수님 프로필 사진이 최적화되어 저장되었습니다!', 'success');
                          } catch (err) {
                            showToast('이미지 변환 중 오류가 발생했습니다.', 'error');
                          }
                        }}
                      />
                      <span className="text-[11px] text-slate-500 font-mono">JPG, PNG, WebP 지원</span>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-mono text-[10px] mb-1">
                        또는 이미지 웹 링크 (URL) 직접 입력:
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com/professor-photo.jpg"
                        value={formData.professor.avatarUrl || ''}
                        onChange={(e) => {
                          const updated = {
                            ...formData,
                            professor: { ...formData.professor, avatarUrl: e.target.value }
                          };
                          setFormData(updated);
                          onSave(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 font-mono text-xs focus:border-sky-400 outline-none"
                      />
                    </div>

                    {/* Presets */}
                    <div>
                      <span className="block text-[10px] text-slate-500 font-mono mb-1">추천 학술 프로필 샘플:</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { label: '기본 프로필 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
                          { label: '학술 프로필 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
                          { label: '학술 프로필 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
                          { label: '학술 프로필 4', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const updated = {
                                ...formData,
                                professor: { ...formData.professor, avatarUrl: preset.url }
                              };
                              setFormData(updated);
                              onSave(updated);
                              showToast(`"${preset.label}" 사진이 적용되었습니다.`, 'success');
                            }}
                            className={`px-2 py-0.5 text-[10px] font-mono rounded-xs border transition ${
                              formData.professor.avatarUrl === preset.url
                                ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-sm text-sky-900">
                <span className="font-bold block mb-1">💡 교수 약력 및 소개글 줄바꿈(Line breaks) 안내:</span>
                약력(Biography) 및 인사말 입력창에서 <strong>Enter(줄바꿈)</strong>를 입력하시면 사이트 화면에서도 문단과 줄바꿈이 그대로 표시됩니다.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">교수님 성함 (국문)</label>
                  <input
                    type="text"
                    value={formData.professor.nameKo}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, nameKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">교수님 성함 (영문)</label>
                  <input
                    type="text"
                    value={formData.professor.nameEn}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, nameEn: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">직함 (Title)</label>
                  <input
                    type="text"
                    value={formData.professor.titleKo}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, titleKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">이메일 (Email)</label>
                  <input
                    type="email"
                    value={formData.professor.email}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, email: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 위치 (Office)</label>
                  <input
                    type="text"
                    value={formData.professor.officeKo}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, officeKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">연구실 전화 (Phone)</label>
                  <input
                    type="text"
                    value={formData.professor.phone}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, phone: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">
                    교수 약력 (Biography - 줄바꿈 지원)
                  </label>
                  <textarea
                    rows={8}
                    value={formData.professor.bioKo}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, bioKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    placeholder="교수님의 상세 약력 및 연구 분야를 줄바꿈하여 작성해주세요..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 leading-relaxed focus:border-sky-400 outline-none font-sans"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-mono text-[11px] mb-1">
                    학생들에게 전하는 메시지 (Message)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.professor.messageKo}
                    onChange={(e) => {
                      const updated = { ...formData, professor: { ...formData.professor, messageKo: e.target.value } };
                      setFormData(updated);
                      onSave(updated);
                    }}
                    placeholder="학생 및 연구원들에게 전하는 메시지를 작성해주세요..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 leading-relaxed focus:border-sky-400 outline-none font-sans"
                  />
                </div>
              </div>

              {/* Professor Key Experience (주요 경력) Management */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-slate-950 flex items-center gap-1.5 text-base">
                    <Briefcase className="w-4 h-4 text-sky-600" /> 교수 주요 경력 관리 (Experience & Career)
                  </h4>
                  <span className="text-xs font-mono text-slate-500">
                    총 {formData.professor.experience?.length || 0}건
                  </span>
                </div>

                {/* Edit Experience Inline Form */}
                {editingExpIndex !== null && editExpForm && (
                  <div className="p-4 bg-sky-50/80 rounded-sm border-2 border-sky-300 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-950 flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5 text-sky-700" /> 경력 항목 수정 중
                      </span>
                      <button
                        type="button"
                        onClick={() => { setEditingExpIndex(null); setEditExpForm(null); }}
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        취소
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">활동 기간 (Period)</label>
                        <input
                          type="text"
                          value={editExpForm.period}
                          onChange={(e) => setEditExpForm({ ...editExpForm, period: e.target.value })}
                          placeholder="예: 2020.03 - 현재"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">직함 / 역할 (Role)</label>
                        <input
                          type="text"
                          value={editExpForm.role}
                          onChange={(e) => setEditExpForm({ ...editExpForm, role: e.target.value })}
                          placeholder="예: 학과장, 교수, 센터장"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">소속 기관 / 조직 (Institution)</label>
                        <input
                          type="text"
                          value={editExpForm.institution}
                          onChange={(e) => setEditExpForm({ ...editExpForm, institution: e.target.value })}
                          placeholder="예: 전남대학교 통계학과"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveEditExperience}
                        className="px-3.5 py-1.5 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 text-xs font-mono font-bold rounded-sm border border-[#8ed0fa] shadow-2xs"
                      >
                        경력 수정 완료
                      </button>
                    </div>
                  </div>
                )}

                {/* Add New Experience Form */}
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-200 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-sky-600" /> 새 경력 항목 추가
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-mono text-[11px] mb-0.5">활동 기간 (Period)</label>
                      <input
                        type="text"
                        value={newExp.period}
                        onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                        placeholder="예: 2020.03 - 현재"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-mono text-[11px] mb-0.5">직함 / 역할 (Role)</label>
                      <input
                        type="text"
                        value={newExp.role}
                        onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                        placeholder="예: 학과장, 부회장, 센터장"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-mono text-[11px] mb-0.5">소속 기관 / 조직 (Institution)</label>
                      <input
                        type="text"
                        value={newExp.institution}
                        onChange={(e) => setNewExp({ ...newExp, institution: e.target.value })}
                        placeholder="예: 전남대학교 통계학과"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-sky-400 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="px-3.5 py-1.5 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 text-xs font-mono font-bold rounded-sm border border-[#8ed0fa] shadow-2xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> 경력 추가
                  </button>
                </div>

                {/* Experience List */}
                <div className="divide-y divide-slate-100 bg-white rounded-sm border border-slate-200 max-h-72 overflow-y-auto">
                  {(formData.professor.experience || []).map((exp, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === (formData.professor.experience?.length || 1) - 1;
                    return (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          {/* Order Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1 py-0.5 rounded-sm border border-slate-200">
                            <span className="text-[10px] font-mono text-slate-500 w-4 text-center">#{idx + 1}</span>
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleMoveExperience(idx, 'up')}
                                className={`p-0.5 rounded-xs transition ${isFirst ? 'text-slate-200' : 'text-slate-600 hover:text-sky-700'}`}
                                title="위로 이동"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleMoveExperience(idx, 'down')}
                                className={`p-0.5 rounded-xs transition ${isLast ? 'text-slate-200' : 'text-slate-600 hover:text-sky-700'}`}
                                title="아래로 이동"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-slate-900 text-xs">{exp.role}</span>
                              <span className="px-1.5 py-0.2 bg-sky-50 text-sky-800 border border-sky-200 rounded-xs text-[10px] font-mono font-medium">
                                {exp.period}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 font-mono block mt-0.5">{exp.institution}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setEditingExpIndex(idx); setEditExpForm({ ...exp }); }}
                            className="px-2 py-1 text-xs font-mono bg-sky-50 hover:bg-[#b7e0fa] text-sky-900 border border-sky-200 rounded-sm transition flex items-center gap-1 font-semibold"
                            title="수정"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>수정</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {(!formData.professor.experience || formData.professor.experience.length === 0) && (
                    <div className="p-4 text-center text-xs text-slate-400 font-mono">
                      등록된 주요 경력이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* Professor Awards (수상 및 서훈) Management */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-slate-950 flex items-center gap-1.5 text-base">
                    <Award className="w-4 h-4 text-sky-600" /> 교수 수상 및 서훈 관리 (Awards & Honors)
                  </h4>
                  <span className="text-xs font-mono text-slate-500">
                    총 {formData.professor.awards?.length || 0}건
                  </span>
                </div>

                {/* Edit Award Inline Form */}
                {editingAwardIndex !== null && editAwardForm && (
                  <div className="p-4 bg-sky-50/80 rounded-sm border-2 border-sky-300 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-950 flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5 text-sky-700" /> 수상 내역 수정 중
                      </span>
                      <button
                        type="button"
                        onClick={() => { setEditingAwardIndex(null); setEditAwardForm(null); }}
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        취소
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">수상 연도 / 일자 (Year)</label>
                        <input
                          type="text"
                          value={editAwardForm.year}
                          onChange={(e) => setEditAwardForm({ ...editAwardForm, year: e.target.value })}
                          placeholder="예: 2024.01.26"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">수상 및 표창명 (Title)</label>
                        <input
                          type="text"
                          value={editAwardForm.title}
                          onChange={(e) => setEditAwardForm({ ...editAwardForm, title: e.target.value })}
                          placeholder="예: 학술상 (Best Academic Award)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">수여 기관 (Organization)</label>
                        <input
                          type="text"
                          value={editAwardForm.organization}
                          onChange={(e) => setEditAwardForm({ ...editAwardForm, organization: e.target.value })}
                          placeholder="예: 한국자료분석학회"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveEditAward}
                        className="px-3.5 py-1.5 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 text-xs font-mono font-bold rounded-sm border border-[#8ed0fa] shadow-2xs"
                      >
                        수상 내역 수정 완료
                      </button>
                    </div>
                  </div>
                )}

                {/* Add New Award Form */}
                <div className="p-4 bg-slate-50 rounded-sm border border-slate-200 space-y-3">
                  <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-sky-600" /> 새 수상 내역 추가
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-mono text-[11px] mb-0.5">수상 연도 / 일자 (Year)</label>
                      <input
                        type="text"
                        value={newAward.year}
                        onChange={(e) => setNewAward({ ...newAward, year: e.target.value })}
                        placeholder="예: 2024.01.26"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-mono text-[11px] mb-0.5">수상 및 표창명 (Title)</label>
                      <input
                        type="text"
                        value={newAward.title}
                        onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                        placeholder="예: 학술상 (Best Academic Award)"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-mono text-[11px] mb-0.5">수여 기관 (Organization)</label>
                      <input
                        type="text"
                        value={newAward.organization}
                        onChange={(e) => setNewAward({ ...newAward, organization: e.target.value })}
                        placeholder="예: 한국자료분석학회"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 focus:border-sky-400 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAward}
                    className="px-3.5 py-1.5 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 text-xs font-mono font-bold rounded-sm border border-[#8ed0fa] shadow-2xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> 수상 내역 추가
                  </button>
                </div>

                {/* Awards List */}
                <div className="divide-y divide-slate-100 bg-white rounded-sm border border-slate-200 max-h-72 overflow-y-auto">
                  {(formData.professor.awards || []).map((award, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === (formData.professor.awards?.length || 1) - 1;
                    return (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          {/* Order Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1 py-0.5 rounded-sm border border-slate-200">
                            <span className="text-[10px] font-mono text-slate-500 w-4 text-center">#{idx + 1}</span>
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleMoveAward(idx, 'up')}
                                className={`p-0.5 rounded-xs transition ${isFirst ? 'text-slate-200' : 'text-slate-600 hover:text-sky-700'}`}
                                title="위로 이동"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleMoveAward(idx, 'down')}
                                className={`p-0.5 rounded-xs transition ${isLast ? 'text-slate-200' : 'text-slate-600 hover:text-sky-700'}`}
                                title="아래로 이동"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-slate-900 text-xs">{award.title}</span>
                              <span className="px-1.5 py-0.2 bg-[#b7e0fa] text-slate-900 rounded-xs text-[10px] font-mono font-bold">
                                {award.year}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600 font-mono block mt-0.5">{award.organization}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => { setEditingAwardIndex(idx); setEditAwardForm({ ...award }); }}
                            className="px-2 py-1 text-xs font-mono bg-sky-50 hover:bg-[#b7e0fa] text-sky-900 border border-sky-200 rounded-sm transition flex items-center gap-1 font-semibold"
                            title="수정"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>수정</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAward(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {(!formData.professor.awards || formData.professor.awards.length === 0) && (
                    <div className="p-4 text-center text-xs text-slate-400 font-mono">
                      등록된 수상 내역이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. Research Themes Tab */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Add Theme Form */}
              <div className="p-5 bg-slate-50 rounded-sm border border-slate-200 space-y-3">
                <h4 className="font-serif font-bold text-slate-950 flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4 text-sky-600" /> 새 연구 주제 추가하기 (Add Research Theme)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">주제명 (국문)</label>
                    <input
                      type="text"
                      placeholder="예: 의료 바이오 AI & 임상 통계"
                      value={newTheme.titleKo}
                      onChange={(e) => setNewTheme({ ...newTheme, titleKo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">주제명 (영문)</label>
                    <input
                      type="text"
                      placeholder="Medical Bio AI & Clinical Statistics"
                      value={newTheme.titleEn}
                      onChange={(e) => setNewTheme({ ...newTheme, titleEn: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">핵심 키워드 (쉼표 구분)</label>
                    <input
                      type="text"
                      placeholder="생체신호, 딥러닝, 생존분석"
                      value={themeKeywordInput}
                      onChange={(e) => setThemeKeywordInput(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">연구 주제 상세 설명</label>
                    <textarea
                      rows={2}
                      placeholder="이 연구 주제에서 다루는 주요 모델 및 연구 목적을 작성하세요..."
                      value={newTheme.descriptionKo}
                      onChange={(e) => setNewTheme({ ...newTheme, descriptionKo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTheme}
                  className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm transition flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                >
                  <Plus className="w-4 h-4" /> 연구 주제 추가
                </button>
              </div>

              {/* Theme List */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-mono text-xs text-sky-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-sky-600" />
                    등록된 연구 주제 순서 ({formData.themes.length}개)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    💡 화살표(▲/▼)로 홈페이지 화면에 노출될 순서를 조정할 수 있습니다.
                  </span>
                </div>

                <div className="divide-y divide-slate-100 bg-white rounded-sm border border-slate-200">
                  {formData.themes.map((theme, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === formData.themes.length - 1;
                    return (
                      <div key={theme.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          {/* Order Badges & Move Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1.5 py-1 rounded-sm border border-slate-200">
                            <span className="text-[10px] font-mono font-bold text-slate-600 w-5 text-center">
                              #{idx + 1}
                            </span>
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleMoveTheme(theme.id, 'up')}
                                className={`p-1 rounded-xs transition ${
                                  isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 위로 이동"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleMoveTheme(theme.id, 'down')}
                                className={`p-1 rounded-xs transition ${
                                  isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 아래로 이동"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-serif font-bold text-slate-900">{theme.titleKo}</span>
                              <span className="text-[11px] text-slate-500 font-mono">({theme.titleEn})</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{theme.descriptionKo}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTheme(theme.id, theme.titleKo)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition shrink-0"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. Funded Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Existing Project Edit Form / Box */}
              {editingProjectId && editProjectForm && (
                <div className="p-5 bg-sky-50/70 rounded-sm border-2 border-sky-300 space-y-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sky-950 flex items-center gap-1.5 text-sm">
                      <Edit3 className="w-4 h-4 text-sky-700" /> 연구 과제 내용 수정 중 (Editing Project)
                    </h4>
                    <button
                      type="button"
                      onClick={() => { setEditingProjectId(null); setEditProjectForm(null); }}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-sm"
                    >
                      취소 (Cancel)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">과제명 (국문)</label>
                      <input
                        type="text"
                        value={editProjectForm.titleKo}
                        onChange={(e) => setEditProjectForm({ ...editProjectForm, titleKo: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">지원 기관 (국문)</label>
                      <input
                        type="text"
                        value={editProjectForm.fundingAgency}
                        onChange={(e) => setEditProjectForm({ ...editProjectForm, fundingAgency: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">수행 기간 (Period)</label>
                      <input
                        type="text"
                        value={editProjectForm.period}
                        onChange={(e) => setEditProjectForm({ ...editProjectForm, period: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">역할</label>
                      <select
                        value={editProjectForm.role}
                        onChange={(e) => setEditProjectForm({ ...editProjectForm, role: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      >
                        <option value="연구책임자 (PI)">연구책임자 (PI)</option>
                        <option value="공동연구원 (Co-PI)">공동연구원 (Co-PI)</option>
                        <option value="참여기관">참여기관</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">진행 상태</label>
                      <select
                        value={editProjectForm.status}
                        onChange={(e) => setEditProjectForm({ ...editProjectForm, status: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      >
                        <option value="ongoing">수행중 (Ongoing)</option>
                        <option value="completed">완료 (Completed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setEditingProjectId(null); setEditProjectForm(null); }}
                      className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-sm hover:bg-slate-100 font-mono"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEditProject}
                      className="px-4 py-1.5 text-xs font-bold text-slate-900 bg-[#b7e0fa] hover:bg-[#9ed3f7] rounded-sm transition font-mono border border-[#8ed0fa] shadow-xs flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" /> 과제 수정 완료
                    </button>
                  </div>
                </div>
              )}

              {/* Add Project Form */}
              <div className="p-5 bg-slate-50 rounded-sm border border-slate-200 space-y-3">
                <h4 className="font-serif font-bold text-slate-950 flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4 text-sky-600" /> 새 연구 과제 추가하기 (Add Project)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">과제명 (국문)</label>
                    <input
                      type="text"
                      placeholder="예: 생체신호 기반 지능형 질환 예측 모델 개발"
                      value={newProject.titleKo}
                      onChange={(e) => setNewProject({ ...newProject, titleKo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">지원 기관 (국문)</label>
                    <input
                      type="text"
                      placeholder="한국연구재단 (NRF), 과학기술정보통신부"
                      value={newProject.fundingAgency}
                      onChange={(e) => setNewProject({ ...newProject, fundingAgency: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">수행 기간 (Period)</label>
                    <input
                      type="text"
                      placeholder="2025.03 - 2028.02"
                      value={newProject.period}
                      onChange={(e) => setNewProject({ ...newProject, period: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">역할</label>
                    <select
                      value={newProject.role}
                      onChange={(e) => setNewProject({ ...newProject, role: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    >
                      <option value="연구책임자 (PI)">연구책임자 (PI)</option>
                      <option value="공동연구원 (Co-PI)">공동연구원 (Co-PI)</option>
                      <option value="참여기관">참여기관</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">진행 상태</label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 outline-none"
                    >
                      <option value="ongoing">수행중 (Ongoing)</option>
                      <option value="completed">완료 (Completed)</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddProject}
                  className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm transition flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                >
                  <Plus className="w-4 h-4" /> 연구 과제 추가
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-mono text-xs text-sky-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-sky-600" />
                    등록된 연구 과제 순서 ({formData.projects.length}개)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSortProjects('ongoing-first')}
                      className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 rounded-sm transition flex items-center gap-1 shadow-2xs"
                      title="수행중 과제를 상단에 우선 배치"
                    >
                      <ArrowUpDown className="w-3 h-3 text-sky-600" />
                      <span>수행중 과제 우선 정렬</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 bg-white rounded-sm border border-slate-200">
                  {formData.projects.map((proj, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === formData.projects.length - 1;
                    return (
                      <div key={proj.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          {/* Order Badges & Move Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1.5 py-1 rounded-sm border border-slate-200">
                            <span className="text-[10px] font-mono font-bold text-slate-600 w-5 text-center">
                              #{idx + 1}
                            </span>
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleMoveProject(proj.id, 'up')}
                                className={`p-1 rounded-xs transition ${
                                  isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 위로 이동"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleMoveProject(proj.id, 'down')}
                                className={`p-1 rounded-xs transition ${
                                  isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 아래로 이동"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-xs ${
                                proj.status === 'ongoing' ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {proj.status === 'ongoing' ? '수행중' : '완료'}
                              </span>
                              <span className="font-serif font-bold text-slate-900">{proj.titleKo}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono">{proj.fundingAgency} · {proj.period} · {proj.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditProject(proj)}
                            className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-sm transition"
                            title="수정 (Edit)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.titleKo)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition"
                            title="삭제 (Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. Publications Tab */}
          {activeTab === 'publications' && (
            <div className="space-y-6">
              {/* Existing Publication Edit Modal / Box */}
              {editingPubId && editPubForm && (
                <div className="p-5 bg-sky-50/70 rounded-sm border-2 border-sky-300 space-y-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sky-950 flex items-center gap-1.5 text-sm">
                      <Edit3 className="w-4 h-4 text-sky-700" /> 논문 내용 수정 중 (Editing Publication)
                    </h4>
                    <button
                      onClick={() => { setEditingPubId(null); setEditPubForm(null); }}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-sm font-mono"
                    >
                      취소 (Cancel)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">논문 제목 (Title) *</label>
                      <input
                        type="text"
                        value={editPubForm.title}
                        onChange={(e) => setEditPubForm({ ...editPubForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">저자 목록 (쉼표로 구분)</label>
                      <input
                        type="text"
                        value={editPubForm.authors.join(', ')}
                        onChange={(e) => setEditPubForm({
                          ...editPubForm,
                          authors: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                        })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">발표 학회/저널 (Venue) *</label>
                      <input
                        type="text"
                        value={editPubForm.venue}
                        onChange={(e) => setEditPubForm({ ...editPubForm, venue: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">구분 (Venue Type)</label>
                      <select
                        value={editPubForm.venueType}
                        onChange={(e) => setEditPubForm({ ...editPubForm, venueType: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      >
                        <option value="SCI/SCIE Journal">SCI/SCIE Journal</option>
                        <option value="Domestic Journal">Domestic Journal (국내학술지/KCI)</option>
                        <option value="Top Conference">Top Conference</option>
                        <option value="International Conference">International Conference</option>
                        <option value="Patent">Patent (특허)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">발표 연도 (Year)</label>
                      <input
                        type="number"
                        value={editPubForm.year}
                        onChange={(e) => setEditPubForm({ ...editPubForm, year: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">수상 / 특전 / 비고 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: 최우수 논문상 / Featured Paper"
                        value={editPubForm.award || ''}
                        onChange={(e) => setEditPubForm({ ...editPubForm, award: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">초록 (Abstract - 선택)</label>
                      <textarea
                        rows={3}
                        placeholder="논문의 국문/영문 초록(요약)을 입력하세요..."
                        value={editPubForm.abstract || ''}
                        onChange={(e) => setEditPubForm({ ...editPubForm, abstract: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none font-sans text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSaveEditPub}
                      className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm transition flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                    >
                      <Check className="w-4 h-4 text-sky-900" />
                      <span>수정 내용 반영하기 (Save Changes)</span>
                    </button>
                    <button
                      onClick={() => { setEditingPubId(null); setEditPubForm(null); }}
                      className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-sm hover:bg-slate-100 font-mono"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {/* Add New Publication Card */}
              <div className="p-5 bg-slate-50 rounded-sm border border-slate-200 space-y-4">
                <h4 className="font-serif font-bold text-slate-950 flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4 text-sky-600" /> 새 논문/실적 추가하기 (Add Publication)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">논문 제목 (Title) *</label>
                    <input
                      type="text"
                      placeholder="논문 제목을 입력하세요..."
                      value={newPub.title}
                      onChange={(e) => setNewPub({ ...newPub, title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">저자 목록 (쉼표로 구분)</label>
                    <input
                      type="text"
                      placeholder="김민수* (교신저자), 홍길동"
                      value={pubAuthorInput}
                      onChange={(e) => setPubAuthorInput(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">발표 학회/저널 (Venue) *</label>
                    <input
                      type="text"
                      placeholder="예: Scientific Reports / Journal of KCI"
                      value={newPub.venue}
                      onChange={(e) => setNewPub({ ...newPub, venue: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">구분 (Venue Type)</label>
                    <select
                      value={newPub.venueType}
                      onChange={(e) => setNewPub({ ...newPub, venueType: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                    >
                      <option value="SCI/SCIE Journal">SCI/SCIE Journal</option>
                      <option value="Domestic Journal">Domestic Journal (국내학술지/KCI)</option>
                      <option value="Top Conference">Top Conference</option>
                      <option value="International Conference">International Conference</option>
                      <option value="Patent">Patent (특허)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">발표 연도 (Year)</label>
                    <input
                      type="number"
                      value={newPub.year}
                      onChange={(e) => setNewPub({ ...newPub, year: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">수상 / 특전 / 비고 (선택)</label>
                    <input
                      type="text"
                      placeholder="예: 최우수논문상 / Featured Paper"
                      value={newPub.award || ''}
                      onChange={(e) => setNewPub({ ...newPub, award: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">초록 (Abstract - 선택)</label>
                    <textarea
                      rows={3}
                      placeholder="논문의 국문/영문 초록(요약)을 입력하세요..."
                      value={newPub.abstract || ''}
                      onChange={(e) => setNewPub({ ...newPub, abstract: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-sm text-slate-900 focus:border-sky-500 outline-none font-sans text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddPublication}
                  className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm transition flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                >
                  <Plus className="w-4 h-4" /> 새 논문 추가하기
                </button>
              </div>

              {/* Current Publications List with Search, Quick Sort & Order Controls */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  <div>
                    <span className="font-mono text-xs text-sky-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-sky-600" />
                      등록된 논문 목록 및 표시 순서 ({formData.publications.length}편)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      💡 목록의 화살표(▲/▼)로 위치를 바꾸거나, 상단 정렬 버튼으로 한번에 정렬할 수 있습니다.
                    </span>
                  </div>
                  
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="논문 제목, 학회, 저자 검색..."
                      value={pubSearch}
                      onChange={(e) => setPubSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:border-sky-400 outline-none"
                    />
                  </div>
                </div>

                {/* Quick Sort Bar */}
                <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" />
                    자동 일괄 정렬:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSortPublications('year-desc')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                    title="최신 연도부터 과거 연도순으로 정렬"
                  >
                    <Calendar className="w-3 h-3 text-sky-600" />
                    <span>최신 연도순 (2026→2020)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortPublications('year-asc')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                    title="과거 연도부터 최신 연도순으로 정렬"
                  >
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>과거 연도순 (2020→2026)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortPublications('title-asc')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                    title="논문 제목 가나다/ABC순으로 정렬"
                  >
                    <ArrowDownAZ className="w-3 h-3 text-sky-600" />
                    <span>제목 가나다/ABC순</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 bg-white rounded-sm border border-slate-200 max-h-96 overflow-y-auto">
                  {filteredPubs.map((pub) => {
                    const realIndex = formData.publications.findIndex(p => p.id === pub.id);
                    const isFirst = realIndex === 0;
                    const isLast = realIndex === formData.publications.length - 1;

                    return (
                      <div key={pub.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                        {/* Order Controller */}
                        <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1.5 py-1 rounded-sm border border-slate-200">
                          <span className="text-[10px] font-mono font-bold text-slate-600 w-6 text-center">
                            #{realIndex + 1}
                          </span>
                          <div className="flex items-center">
                            <button
                              type="button"
                              disabled={isFirst}
                              onClick={() => handleMovePublication(pub.id, 'up')}
                              className={`p-1 rounded-xs transition ${
                                isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                              }`}
                              title="한 칸 위로 이동"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={isLast}
                              onClick={() => handleMovePublication(pub.id, 'down')}
                              className={`p-1 rounded-xs transition ${
                                isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                              }`}
                              title="한 칸 아래로 이동"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={isFirst}
                              onClick={() => handleMovePublication(pub.id, 'top')}
                              className={`p-1 rounded-xs transition hidden sm:block ${
                                isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:text-sky-700 hover:bg-sky-100'
                              }`}
                              title="맨 위로 이동"
                            >
                              <ChevronsUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={isLast}
                              onClick={() => handleMovePublication(pub.id, 'bottom')}
                              className={`p-1 rounded-xs transition hidden sm:block ${
                                isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-500 hover:text-sky-700 hover:bg-sky-100'
                              }`}
                              title="맨 아래로 이동"
                            >
                              <ChevronsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="truncate flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-xs text-[10px] font-mono">
                              {pub.year}
                            </span>
                            <span className="px-1.5 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-xs text-[10px] font-mono font-bold">
                              {pub.venueType}
                            </span>
                            {pub.award && (
                              <span className="px-1.5 py-0.5 bg-[#b7e0fa] text-slate-900 rounded-xs text-[10px] font-mono font-bold">
                                {pub.award}
                              </span>
                            )}
                          </div>
                          <span className="font-serif font-bold text-slate-900 truncate block text-xs">{pub.title}</span>
                          <span className="text-[11px] text-slate-500 font-mono block truncate">
                            {pub.venue} {pub.pages ? `· ${pub.pages}` : ''} · {pub.authors.join(', ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditPub(pub)}
                            className="px-2.5 py-1 text-xs font-mono bg-sky-50 hover:bg-[#b7e0fa] text-sky-900 border border-sky-200 rounded-sm transition flex items-center gap-1 font-semibold"
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>수정</span>
                          </button>
                          <button
                            onClick={() => handleDeletePublication(pub.id, pub.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 6. Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              {/* Editing Member Box */}
              {editingMemberId && editMemberForm && (
                <div className="p-5 bg-sky-50/70 rounded-sm border-2 border-sky-300 space-y-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sky-950 flex items-center gap-1.5 text-sm">
                      <Edit3 className="w-4 h-4 text-sky-700" /> 구성원 정보 수정 중
                    </h4>
                    <button
                      onClick={() => { setEditingMemberId(null); setEditMemberForm(null); }}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                    >
                      취소
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">이름 (국문) *</label>
                      <input
                        type="text"
                        value={editMemberForm.nameKo}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, nameKo: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">이름 (영문 - 미입력 시 괄호 미표시)</label>
                      <input
                        type="text"
                        placeholder="Gil-Dong Hong (선택)"
                        value={editMemberForm.nameEn || ''}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, nameEn: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">과정 구분 (Role)</label>
                      <select
                        value={editMemberForm.role}
                        onChange={(e) => {
                          const r = e.target.value as any;
                          let titleKo = '석사과정';
                          let titleEn = 'M.S. Student';
                          if (r === 'phd') { titleKo = '박사과정'; titleEn = 'Ph.D. Candidate'; }
                          if (r === 'integrated') { titleKo = '석박통합과정'; titleEn = 'Integrated Ph.D.'; }
                          if (r === 'postdoc') { titleKo = '박사후연구원'; titleEn = 'Postdoc'; }
                          if (r === 'intern') { titleKo = '학부연구생'; titleEn = 'Undergrad Intern'; }
                          if (r === 'alumni') { titleKo = '석사 졸업'; titleEn = 'M.S. Graduate'; }
                          setEditMemberForm({ ...editMemberForm, role: r, roleTitleKo: titleKo, roleTitleEn: titleEn });
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      >
                        <option value="phd">박사과정 (Ph.D.)</option>
                        <option value="integrated">석박통합과정 (Integrated)</option>
                        <option value="ms">석사과정 (M.S.)</option>
                        <option value="postdoc">박사후연구원 (Postdoc)</option>
                        <option value="intern">학부연구생 (Intern)</option>
                        <option value="alumni">졸업생 (Alumni)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">기타사항 / 세부학위 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: 석사과정 졸업, 박사과정 졸업, 석박사졸업"
                        value={editMemberForm.customNote || ''}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, customNote: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">입학 연도 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: 2019"
                        value={editMemberForm.admissionYear || ''}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, admissionYear: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">졸업 연도 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: 2024"
                        value={editMemberForm.graduationYear || ''}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, graduationYear: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">이메일 (미입력 시 홈페이지 미표시)</label>
                      <input
                        type="email"
                        placeholder="user@jnu.ac.kr (선택)"
                        value={editMemberForm.email || ''}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">현 소속 / 직장 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: 삼성바이오로직스 연구원"
                        value={editMemberForm.currentAffiliation || ''}
                        onChange={(e) => setEditMemberForm({ ...editMemberForm, currentAffiliation: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">연구 분야 (쉼표 구분)</label>
                      <input
                        type="text"
                        value={editMemberForm.researchInterests.join(', ')}
                        onChange={(e) => setEditMemberForm({
                          ...editMemberForm,
                          researchInterests: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                        })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3 pt-1 border-t border-sky-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {editMemberForm.avatarUrl ? (
                        <div className="relative group shrink-0">
                          <img
                            src={editMemberForm.avatarUrl}
                            alt=""
                            className="w-12 h-12 rounded-sm object-cover border border-slate-300 bg-slate-100 shadow-2xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-sky-50 to-[#e0f2fe] border border-sky-200 flex flex-col items-center justify-center text-sky-700 shrink-0 shadow-2xs">
                          <User className="w-6 h-6 text-sky-700/80" />
                          <span className="text-[8px] font-mono text-sky-800">기본아이콘</span>
                        </div>
                      )}
                      <div className="flex-1 w-full space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            htmlFor={`edit-mem-avatar-${editMemberForm.id}`}
                            className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-mono rounded-sm cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <Upload className="w-3 h-3 text-sky-600" />
                            <span>{editMemberForm.avatarUrl ? '사진 변경' : '사진 파일 업로드'}</span>
                          </label>
                          <input
                            id={`edit-mem-avatar-${editMemberForm.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const res = await compressImageFile(file, 400, 0.8);
                                setEditMemberForm({ ...editMemberForm, avatarUrl: res });
                              } catch {
                                showToast('이미지 변환 중 오류가 발생했습니다.', 'error');
                              }
                            }}
                          />

                          {editMemberForm.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => setEditMemberForm({ ...editMemberForm, avatarUrl: '' })}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono rounded-sm border border-rose-200 transition flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>사진 제거 (기본 아이콘 사용)</span>
                            </button>
                          )}

                          <span className="text-[10px] text-slate-500 font-mono">또는 URL 직접 입력:</span>
                        </div>
                        <input
                          type="text"
                          placeholder="프로필 사진 없을 시 비워두세요 (https://...)"
                          value={editMemberForm.avatarUrl || ''}
                          onChange={(e) => setEditMemberForm({ ...editMemberForm, avatarUrl: e.target.value })}
                          className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-sm text-xs text-slate-900 font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSaveEditMember}
                      className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm shadow-xs border border-[#8ed0fa]"
                    >
                      구성원 정보 저장
                    </button>
                  </div>
                </div>
              )}

              {/* Add Member Card */}
              <div className="p-5 bg-slate-50 rounded-sm border border-slate-200 space-y-3">
                <h4 className="font-serif font-bold text-slate-950 flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4 text-sky-600" /> 새 연구원/졸업생 등록 (Add Member)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">이름 (국문) *</label>
                    <input
                      type="text"
                      placeholder="홍길동"
                      value={newMember.nameKo}
                      onChange={(e) => setNewMember({ ...newMember, nameKo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">이름 (영문 - 미입력 시 괄호 미표시)</label>
                    <input
                      type="text"
                      placeholder="Gil-Dong Hong (선택)"
                      value={newMember.nameEn}
                      onChange={(e) => setNewMember({ ...newMember, nameEn: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">과정 구분 (Role)</label>
                    <select
                      value={newMember.role}
                      onChange={(e) => {
                        const r = e.target.value as any;
                        let titleKo = '석사과정';
                        let titleEn = 'M.S. Student';
                        if (r === 'phd') { titleKo = '박사과정'; titleEn = 'Ph.D. Candidate'; }
                        if (r === 'integrated') { titleKo = '석박통합과정'; titleEn = 'Integrated Ph.D.'; }
                        if (r === 'postdoc') { titleKo = '박사후연구원'; titleEn = 'Postdoc'; }
                        if (r === 'intern') { titleKo = '학부연구생'; titleEn = 'Undergrad Intern'; }
                        if (r === 'alumni') { titleKo = '석사 졸업'; titleEn = 'M.S. Graduate'; }
                        setNewMember({ ...newMember, role: r, roleTitleKo: titleKo, roleTitleEn: titleEn });
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    >
                      <option value="phd">박사과정 (Ph.D.)</option>
                      <option value="integrated">석박통합과정 (Integrated)</option>
                      <option value="ms">석사과정 (M.S.)</option>
                      <option value="postdoc">박사후연구원 (Postdoc)</option>
                      <option value="intern">학부연구생 (Intern)</option>
                      <option value="alumni">졸업생 (Alumni)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">기타사항 / 세부학위 (선택)</label>
                    <input
                      type="text"
                      placeholder="예: 석사과정 졸업, 박사과정 졸업, 석박사졸업"
                      value={newMember.customNote || ''}
                      onChange={(e) => setNewMember({ ...newMember, customNote: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">입학 연도 (선택)</label>
                    <input
                      type="text"
                      placeholder="예: 2019"
                      value={newMember.admissionYear || ''}
                      onChange={(e) => setNewMember({ ...newMember, admissionYear: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">졸업 연도 (선택)</label>
                    <input
                      type="text"
                      placeholder="예: 2024"
                      value={newMember.graduationYear || ''}
                      onChange={(e) => setNewMember({ ...newMember, graduationYear: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">이메일 (미입력 시 홈페이지 미표시)</label>
                    <input
                      type="email"
                      placeholder="user@jnu.ac.kr (선택)"
                      value={newMember.email || ''}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">현 소속 / 직장 (선택)</label>
                    <input
                      type="text"
                      placeholder="예: 삼성바이오로직스 (선택)"
                      value={newMember.currentAffiliation || ''}
                      onChange={(e) => setNewMember({ ...newMember, currentAffiliation: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">관심 연구 분야 (쉼표 구분)</label>
                    <input
                      type="text"
                      placeholder="통계분석, 시계열, 딥러닝"
                      value={memberInterestInput}
                      onChange={(e) => setMemberInterestInput(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-1 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {newMember.avatarUrl ? (
                      <div className="relative group shrink-0">
                        <img
                          src={newMember.avatarUrl}
                          alt=""
                          className="w-11 h-11 rounded-sm object-cover border border-slate-300 bg-slate-100 shadow-2xs"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-sm bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-500 shrink-0 shadow-2xs">
                        <User className="w-5 h-5 text-slate-500" />
                        <span className="text-[7px] font-mono text-slate-500">기본아이콘</span>
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <label
                          htmlFor="new-member-avatar-upload"
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono rounded-sm cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <Upload className="w-3 h-3 text-sky-600" />
                          <span>{newMember.avatarUrl ? '사진 변경' : '프로필 사진 업로드'}</span>
                        </label>
                        <input
                          id="new-member-avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const res = await compressImageFile(file, 400, 0.8);
                              setNewMember({ ...newMember, avatarUrl: res });
                            } catch {
                              showToast('이미지 변환 중 오류가 발생했습니다.', 'error');
                            }
                          }}
                        />

                        {newMember.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setNewMember({ ...newMember, avatarUrl: '' })}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono rounded-sm border border-rose-200 transition flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>사진 제거</span>
                          </button>
                        )}

                        <span className="text-[10px] text-slate-500 font-mono">
                          (선택사항 · 미등록 시 기본 아이콘 자동 표시)
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="사진 미등록 시 공란으로 두세요 (URL: https://...)"
                        value={newMember.avatarUrl || ''}
                        onChange={(e) => setNewMember({ ...newMember, avatarUrl: e.target.value })}
                        className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm transition flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                >
                  <Plus className="w-4 h-4" /> 구성원 추가 완료
                </button>
              </div>

              {/* Current Members list with Quick Sort & Order Controls */}
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  <div>
                    <span className="font-mono text-xs text-sky-900 font-bold block uppercase tracking-wider flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-sky-600" />
                      등록된 구성원 목록 및 표시 순서 ({formData.members.length}명)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      💡 화살표(▲/▼)로 위치를 바꾸거나, 상단 직급/입학년도/가나다순 버튼으로 일괄 정렬할 수 있습니다.
                    </span>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="이름, 학위, 이메일 검색..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1 bg-white border border-slate-200 rounded-sm text-xs text-slate-900 placeholder-slate-400 focus:border-sky-400 outline-none"
                    />
                  </div>
                </div>

                {/* Quick Sort Bar */}
                <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-sm">
                  <span className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" />
                    자동 일괄 정렬:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSortMembers('role-hierarchy')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                    title="박사후연구원 -> 박사 -> 석박 -> 석사 -> 학부 순으로 정렬"
                  >
                    <GraduationCap className="w-3 h-3 text-sky-600" />
                    <span>직급/학위 순서</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortMembers('admission-desc')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                    title="최신 입학년도부터 정렬"
                  >
                    <Calendar className="w-3 h-3 text-sky-600" />
                    <span>최신 입학년도순</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortMembers('name-asc')}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                    title="이름 가나다순으로 정렬"
                  >
                    <ArrowDownAZ className="w-3 h-3 text-sky-600" />
                    <span>이름 가나다순</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 bg-white rounded-sm border border-slate-200 max-h-80 overflow-y-auto">
                  {filteredMembers.map((mem) => {
                    const realIndex = formData.members.findIndex(m => m.id === mem.id);
                    const isFirst = realIndex === 0;
                    const isLast = realIndex === formData.members.length - 1;

                    return (
                      <div key={mem.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          {/* Order Badges & Move Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1.5 py-1 rounded-sm border border-slate-200">
                            <span className="text-[10px] font-mono font-bold text-slate-600 w-5 text-center">
                              #{realIndex + 1}
                            </span>
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleMoveMember(mem.id, 'up')}
                                className={`p-1 rounded-xs transition ${
                                  isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 위로 이동"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleMoveMember(mem.id, 'down')}
                                className={`p-1 rounded-xs transition ${
                                  isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 아래로 이동"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {mem.avatarUrl ? (
                            <img src={mem.avatarUrl} alt="" className="w-8 h-8 rounded-sm object-cover border border-slate-200 shadow-xs shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                          ) : (
                            <div className="w-8 h-8 rounded-sm bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 shadow-2xs">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-slate-900">
                                {mem.nameKo}{mem.nameEn?.trim() ? ` (${mem.nameEn.trim()})` : ''}
                              </span>
                              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-xs text-[10px] font-mono">
                                {mem.customNote?.trim() ? `${mem.customNote.trim()} · ` : ''}{mem.roleTitleKo}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono block">
                              {mem.email?.trim() ? `${mem.email.trim()} · ` : ''}
                              {mem.admissionYear?.trim() ? `입학: ${mem.admissionYear.trim()}년 ` : ''}
                              {mem.graduationYear?.trim() ? `졸업: ${mem.graduationYear.trim()}년 ` : ''}
                              {mem.currentAffiliation?.trim() ? `· ${mem.currentAffiliation.trim()} ` : ''}
                              {mem.researchInterests && mem.researchInterests.length > 0 ? `· 연구: ${mem.researchInterests.join(', ')}` : ''}
                              {!mem.email?.trim() && !mem.admissionYear?.trim() && !mem.graduationYear?.trim() && !mem.currentAffiliation?.trim() && (!mem.researchInterests || mem.researchInterests.length === 0) && '추가 정보 없음'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditMember(mem)}
                            className="px-2.5 py-1 text-xs font-mono bg-sky-50 hover:bg-[#b7e0fa] text-sky-900 border border-sky-200 rounded-sm transition flex items-center gap-1 font-semibold"
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>수정</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMember(mem.id, mem.nameKo)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 7. News Tab */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              {editingNewsId && editNewsForm && (
                <div className="p-5 bg-sky-50/70 rounded-sm border-2 border-sky-300 space-y-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sky-950 flex items-center gap-1.5 text-sm">
                      <Edit3 className="w-4 h-4 text-sky-700" /> 소식 수정 중
                    </h4>
                    <button onClick={() => { setEditingNewsId(null); setEditNewsForm(null); }} className="text-xs text-slate-500">
                      취소
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">소식 제목 (국문)</label>
                      <input
                        type="text"
                        value={editNewsForm.titleKo}
                        onChange={(e) => setEditNewsForm({ ...editNewsForm, titleKo: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">날짜 (YYYY.MM.DD)</label>
                      <input
                        type="text"
                        value={editNewsForm.date}
                        onChange={(e) => setEditNewsForm({ ...editNewsForm, date: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">카테고리</label>
                      <select
                        value={editNewsForm.category}
                        onChange={(e) => setEditNewsForm({ ...editNewsForm, category: e.target.value as any })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      >
                        <option value="paper">논문 게재 (Paper)</option>
                        <option value="grant">과제 수주 (Grant)</option>
                        <option value="award">학술 수상 (Award)</option>
                        <option value="general">일반 소식 (Notice)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-0.5">상세 내용 (줄바꿈 지원)</label>
                      <textarea
                        rows={3}
                        value={editNewsForm.contentKo}
                        onChange={(e) => setEditNewsForm({ ...editNewsForm, contentKo: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-sm text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveEditNews}
                    className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm shadow-xs border border-[#8ed0fa]"
                  >
                    소식 수정 완료
                  </button>
                </div>
              )}

              <div className="p-5 bg-slate-50 rounded-sm border border-slate-200 space-y-3">
                <h4 className="font-serif font-bold text-slate-950 flex items-center gap-1.5 text-sm">
                  <Plus className="w-4 h-4 text-sky-600" /> 새 소식 / 공지 등록
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">소식 제목 (국문)</label>
                    <input
                      type="text"
                      placeholder="예: [논문 게재] Scientific Reports지에 논문 게재"
                      value={newNews.titleKo}
                      onChange={(e) => setNewNews({ ...newNews, titleKo: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">카테고리</label>
                    <select
                      value={newNews.category}
                      onChange={(e) => setNewNews({ ...newNews, category: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    >
                      <option value="paper">논문 게재 (Paper)</option>
                      <option value="grant">과제 수주 (Grant)</option>
                      <option value="award">학술 수상 (Award)</option>
                      <option value="seminar">세미나 (Seminar)</option>
                      <option value="general">일반 공지 (Notice)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">작성 날짜 (YYYY.MM.DD)</label>
                    <input
                      type="text"
                      value={newNews.date}
                      onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 focus:border-sky-400 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-mono text-[11px] mb-0.5">상세 내용 (Content)</label>
                    <textarea
                      rows={3}
                      value={newNews.contentKo}
                      onChange={(e) => setNewNews({ ...newNews, contentKo: e.target.value })}
                      placeholder="소식의 상세 내용을 작성해주세요..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-slate-900 resize-none focus:border-sky-400 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddNews}
                  className="px-4 py-2 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm transition flex items-center gap-1.5 shadow-xs border border-[#8ed0fa]"
                >
                  <Plus className="w-4 h-4" /> 소식 추가 완료
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs text-sky-900 font-bold block uppercase tracking-wider flex items-center gap-1.5">
                      <ListOrdered className="w-4 h-4 text-sky-600" />
                      등록된 소식 목록 및 표시 순서 ({formData.news.length}개)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      💡 화살표(▲/▼)로 위치를 바꾸거나, 날짜순 자동 정렬을 사용할 수 있습니다.
                    </span>
                  </div>

                  {/* Quick Sort Bar */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSortNews('date-desc')}
                      className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                      title="최신 날짜부터 정렬"
                    >
                      <Calendar className="w-3 h-3 text-sky-600" />
                      <span>최신 날짜순</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSortNews('date-asc')}
                      className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200 rounded-sm transition shadow-2xs flex items-center gap-1"
                      title="과거 날짜부터 정렬"
                    >
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>과거 날짜순</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 bg-white rounded-sm border border-slate-200 max-h-80 overflow-y-auto">
                  {formData.news.map((item, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === formData.news.length - 1;

                    return (
                      <div key={item.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                          {/* Order Badges & Move Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1.5 py-1 rounded-sm border border-slate-200">
                            <span className="text-[10px] font-mono font-bold text-slate-600 w-5 text-center">
                              #{idx + 1}
                            </span>
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => handleMoveNews(item.id, 'up')}
                                className={`p-1 rounded-xs transition ${
                                  isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 위로 이동"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => handleMoveNews(item.id, 'down')}
                                className={`p-1 rounded-xs transition ${
                                  isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:text-sky-700 hover:bg-sky-100'
                                }`}
                                title="한 칸 아래로 이동"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="font-serif font-bold text-slate-900 block">{item.titleKo}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{item.date} · [{item.category}]</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEditNews(item)}
                            className="px-2 py-1 text-xs font-mono bg-sky-50 hover:bg-[#b7e0fa] text-sky-900 border border-sky-200 rounded-sm transition flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>수정</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id, item.titleKo)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 8. JSON Backup / Import Tab */}
          {activeTab === 'json' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-sm border border-slate-200 space-y-4">
                <h4 className="text-base font-serif font-bold text-slate-950">데이터 백업 및 복원 (Backup & Restore)</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  김민수 교수님 연구실 웹사이트의 모든 정보(교수 프로필, 27편 논문 및 특허/저서, 연구주제, 연구원, 소식)를 JSON 파일로 다운로드하여 영구 백업하거나 다른 기기로 안전하게 복원할 수 있습니다.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const codeOutput = `import { LabFullData } from '../types';\n\nexport const initialLabData: LabFullData = ${JSON.stringify(formData, null, 2)};\n`;
                      navigator.clipboard.writeText(codeOutput);
                      showToast('현재 관리자 데이터가 TypeScript 코드로 클립보드에 복사되었습니다!', 'success');
                    }}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-mono font-bold rounded-sm flex items-center gap-2 transition shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>현재 데이터 TS 코드 복사 (Copy TS Code)</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2.5 bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 font-mono font-bold rounded-sm flex items-center gap-2 transition shadow-xs border border-[#8ed0fa]"
                  >
                    <Download className="w-4 h-4" />
                    <span>현재 연구실 데이터 JSON 백업 (Export)</span>
                  </button>

                  <label className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-mono font-bold rounded-sm flex items-center gap-2 transition cursor-pointer border border-slate-200 shadow-xs">
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>JSON 파일 불러오기 (Import)</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>

                  <button
                    onClick={handleResetDefault}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-mono font-bold rounded-sm flex items-center gap-2 transition shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>초기 데이터로 초기화 (Reset)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 9. Security & Admin Password Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password Change Form */}
              <div className="p-6 bg-slate-50 rounded-sm border border-slate-200 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-base font-serif font-bold text-slate-950 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-sky-600" />
                      <span>관리자 접속 비밀번호(PIN) 변경</span>
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      연구실 관리자 모드 진입 시 확인하는 비밀번호를 변경합니다.
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-sm bg-sky-100 text-sky-900 font-mono text-[11px] font-bold border border-sky-200">
                    현재 PIN 상태: 활성화됨
                  </div>
                </div>

                <form onSubmit={handleChangeAdminPin} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-slate-700 font-mono text-[11px] font-bold mb-1">
                      현재 비밀번호 (Current Password)
                    </label>
                    <input
                      type="password"
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      placeholder="현재 설정된 비밀번호 (기본: 798800)"
                      className="w-full px-3 py-2 text-xs font-mono rounded-sm border border-slate-300 bg-white focus:border-sky-500 outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 font-mono text-[11px] font-bold">
                          새 비밀번호 (New Password)
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowNewPin(!showNewPin)}
                          className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-mono"
                        >
                          {showNewPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showNewPin ? '숨기기' : '보기'}</span>
                        </button>
                      </div>
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="새 비밀번호 입력 (4자리 이상)"
                        className="w-full px-3 py-2 text-xs font-mono rounded-sm border border-slate-300 bg-white focus:border-sky-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono text-[11px] font-bold mb-1">
                        새 비밀번호 확인 (Confirm)
                      </label>
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value)}
                        placeholder="새 비밀번호 다시 입력"
                        className="w-full px-3 py-2 text-xs font-mono rounded-sm border border-slate-300 bg-white focus:border-sky-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      id="save-admin-pin-btn"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs rounded-sm transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Lock className="w-3.5 h-3.5 text-sky-400" />
                      <span>비밀번호 변경 및 적용</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetAdminPin}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-mono text-xs rounded-sm border border-slate-200 transition"
                    >
                      기본 번호(798800)로 재설정
                    </button>
                  </div>
                </form>
              </div>

              {/* GitHub / Vercel 배포 가이드 */}
              <div className="p-6 bg-sky-50/70 rounded-sm border border-[#b7e0fa] space-y-3 text-xs leading-relaxed">
                <h4 className="font-serif font-bold text-sky-950 flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  <span>GitHub 및 Vercel 배포 시 영구 비밀번호 설정 팁</span>
                </h4>
                <div className="space-y-2 text-slate-700">
                  <p>
                    1. <strong>브라우저에서 변경:</strong> 위 폼에서 비밀번호를 변경하면 현재 사용 중인 브라우저의 저장소(LocalStorage)에 즉시 저장되어 적용됩니다.
                  </p>
                  <p>
                    2. <strong>배포 소스 코드에서 기본값 변경:</strong> GitHub Repository에 Push하기 전, 소스코드의 <code className="px-1.5 py-0.5 bg-white border border-sky-200 rounded-xs font-mono text-sky-900">/src/components/AdminAuthModal.tsx</code> 파일 상단에 있는:
                  </p>
                  <pre className="p-3 bg-slate-900 text-sky-300 rounded-sm font-mono text-[11px] overflow-x-auto">
                    {`export const DEFAULT_ADMIN_PIN = '798800'; // ← 여기에 원하는 비밀번호를 입력`}
                  </pre>
                  <p>
                    위 변수를 변경한 후 GitHub에 Push하시면, Vercel로 새로 배포된 사이트에서도 해당 번호가 공식 기본 관리자 비밀번호로 작동합니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">수정 즉시 실시간 동기화 및 로컬 저장됩니다.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSafeClose}
              className="px-4 py-2 rounded-sm text-xs font-mono font-medium text-slate-600 hover:bg-slate-200 transition"
            >
              닫기 (Close)
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-sm text-xs font-mono font-bold bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 shadow-xs border border-[#8ed0fa] transition"
            >
              적용 완료 (Save)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
