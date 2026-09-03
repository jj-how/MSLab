export interface ProfessorInfo {
  nameKo: string;
  nameEn: string;
  titleKo: string;
  titleEn: string;
  departmentKo: string;
  departmentEn: string;
  universityKo: string;
  universityEn: string;
  email: string;
  phone: string;
  officeKo: string;
  officeEn: string;
  avatarUrl: string;
  bioKo: string;
  bioEn: string;
  messageKo: string;
  messageEn: string;
  education: {
    year: string;
    degree: string;
    institution: string;
    details?: string;
  }[];
  experience: {
    period: string;
    role: string;
    institution: string;
  }[];
  awards: {
    year: string;
    title: string;
    organization: string;
  }[];
  academicServices: string[];
  links: {
    scholar?: string;
    github?: string;
    dblp?: string;
    orcid?: string;
    linkedin?: string;
    homepage?: string;
  };
}

export interface ResearchTheme {
  id: string;
  titleKo: string;
  titleEn: string;
  iconName: string;
  descriptionKo: string;
  descriptionEn: string;
  keywords: string[];
  sampleTopics: string[];
}

export interface ResearchProject {
  id: string;
  titleKo: string;
  titleEn: string;
  fundingAgency: string;
  agencyType: 'government' | 'industry' | 'university' | 'international';
  period: string;
  role: '연구책임자 (PI)' | '공동연구원 (Co-PI)' | '참여기관';
  budget?: string;
  status: 'ongoing' | 'completed';
  keywords: string[];
  descriptionKo: string;
  descriptionEn?: string;
  relatedThemeId?: string;
}

export type PublicationCategory = 'conference' | 'journal' | 'workshop' | 'patent' | 'book';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  labAuthors?: string[]; // names of lab members to highlight
  venue: string; // e.g. NeurIPS 2025, IEEE TPAMI
  venueType: 'Top Conference' | 'SCI/SCIE Journal' | 'International Conference' | 'Domestic Journal' | 'Patent';
  category: PublicationCategory;
  year: number;
  month?: string;
  pages?: string;
  doi?: string;
  pdfUrl?: string;
  codeUrl?: string;
  projectUrl?: string;
  bibtex: string;
  abstract: string;
  tags: string[];
  award?: string; // e.g. "Best Paper Award", "Spotlight", "Oral (Top 2%)"
  isHighlighted?: boolean;
}

export type MemberRole = 'pi' | 'postdoc' | 'phd' | 'ms' | 'integrated' | 'intern' | 'alumni';

export interface LabMember {
  id: string;
  nameKo: string;
  nameEn?: string;
  role: MemberRole;
  roleTitleKo: string;
  roleTitleEn?: string;
  admissionYear?: string;
  graduationYear?: string;
  customNote?: string; // 기타사항 (예: 석사과정 졸업, 박사과정 졸업, 석박사졸업 등)
  currentAffiliation?: string; // For alumni (e.g. 삼성전자, 네이버, 포스닥)
  email?: string;
  researchInterests: string[];
  avatarUrl?: string;
  links?: {
    scholar?: string;
    github?: string;
    website?: string;
    linkedin?: string;
  };
  featuredWork?: string;
}

export interface NewsItem {
  id: string;
  titleKo: string;
  titleEn: string;
  category: 'paper' | 'award' | 'grant' | 'seminar' | 'general' | 'notice';
  date: string;
  contentKo: string;
  contentEn: string;
  link?: string;
  imageUrl?: string;
  isImportant?: boolean;
}

export interface SeminarSchedule {
  id: string;
  date: string;
  titleKo: string;
  titleEn: string;
  speaker: string;
  location: string;
  materialsUrl?: string;
}

export interface GalleryFile {
  type: 'image' | 'pdf' | 'video' | 'file';
  url: string;
  name?: string;
}

export interface GalleryItem {
  id: string;
  titleKo: string;
  titleEn: string;
  date: string;
  category: string;
  imageUrl: string;
  files?: GalleryFile[];
  descriptionKo: string;
  descriptionEn: string;
}

export interface RecruitmentInfo {
  openings: {
    typeKo: string;
    typeEn: string;
    count: string;
    target: string;
    requirements: string[];
  }[];
  benefits: {
    icon: string;
    titleKo: string;
    titleEn: string;
    descKo: string;
    descEn: string;
  }[];
  idealCandidate: string[];
  procedure: {
    step: number;
    titleKo: string;
    titleEn: string;
    descKo: string;
    descEn: string;
  }[];
  contactEmail: string;
  inquiryTemplate: string;
}

export interface LabInfo {
  labNameKo: string;
  labNameEn: string;
  shortName: string;
  logoUrl?: string;
  mottoKo: string;
  mottoEn: string;
  descriptionKo: string;
  descriptionEn: string;
  universityKo: string;
  universityEn: string;
  departmentKo: string;
  departmentEn: string;
  buildingKo: string;
  buildingEn: string;
  roomKo: string;
  roomEn: string;
  addressKo: string;
  addressEn: string;
  establishedYear: number;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    github?: string;
    youtube?: string;
    twitter?: string;
  };
  stats: {
    publicationsCount: number;
    activeProjectsCount: number;
    totalGrants: string;
    currentMembersCount: number;
    alumniCount: number;
  };
}

export interface LabFullData {
  lab: LabInfo;
  professor: ProfessorInfo;
  themes: ResearchTheme[];
  projects: ResearchProject[];
  publications: Publication[];
  members: LabMember[];
  news: NewsItem[];
  seminars: SeminarSchedule[];
  gallery: GalleryItem[];
  recruitment: RecruitmentInfo;
}
