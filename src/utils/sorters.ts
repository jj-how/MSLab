import { Publication, ResearchProject, NewsItem, ProfessorInfo } from '../types';

/**
 * Extracts the highest / starting 4-digit year from a string (e.g., "2024.03 - 2027.02", "2025", "2020 - 현재")
 */
export function extractYearScore(text: string | undefined | null): number {
  if (!text) return 0;
  const isPresent = /현재|present|재직|수행중/i.test(text);
  const years = text.match(/\b(19\d\d|20\d\d)\b/g);
  if (!years || years.length === 0) {
    return isPresent ? 9999 : 0;
  }
  const firstYear = parseInt(years[0], 10);
  const lastYear = years.length > 1 ? parseInt(years[years.length - 1], 10) : firstYear;
  
  // Combine primary starting year and end year for precise chronological ordering
  const baseScore = firstYear * 10000 + lastYear;
  return isPresent ? baseScore + 50000 : baseScore;
}

/**
 * Sorts publications automatically by year descending (latest first)
 */
export function sortPublicationsByYear(publications: Publication[]): Publication[] {
  return [...publications].sort((a, b) => {
    const yearA = Number(a.year) || 0;
    const yearB = Number(b.year) || 0;
    if (yearB !== yearA) {
      return yearB - yearA;
    }
    // Secondary sort: title
    return (a.title || '').localeCompare(b.title || '');
  });
}

/**
 * Sorts research projects automatically by period / year descending (latest first)
 */
export function sortProjectsByYear(projects: ResearchProject[]): ResearchProject[] {
  return [...projects].sort((a, b) => {
    const scoreA = extractYearScore(a.period) + (a.status === 'ongoing' ? 1000 : 0);
    const scoreB = extractYearScore(b.period) + (b.status === 'ongoing' ? 1000 : 0);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return (a.titleKo || '').localeCompare(b.titleKo || '');
  });
}

/**
 * Sorts awards / achievements automatically by year descending
 */
export function sortAwardsByYear(awards: ProfessorInfo['awards']): ProfessorInfo['awards'] {
  return [...awards].sort((a, b) => {
    const yearA = extractYearScore(a.year);
    const yearB = extractYearScore(b.year);
    if (yearB !== yearA) {
      return yearB - yearA;
    }
    return (a.title || '').localeCompare(b.title || '');
  });
}

/**
 * Sorts experience items automatically by period descending (most recent first)
 */
export function sortExperienceByYear(experience: ProfessorInfo['experience']): ProfessorInfo['experience'] {
  return [...experience].sort((a, b) => {
    const scoreA = extractYearScore(a.period);
    const scoreB = extractYearScore(b.period);
    return scoreB - scoreA;
  });
}

/**
 * Sorts education items automatically by year descending
 */
export function sortEducationByYear(education: ProfessorInfo['education']): ProfessorInfo['education'] {
  return [...education].sort((a, b) => {
    const scoreA = extractYearScore(a.year);
    const scoreB = extractYearScore(b.year);
    return scoreB - scoreA;
  });
}

/**
 * Sorts news items automatically by date/year descending
 */
export function sortNewsByDate(news: NewsItem[]): NewsItem[] {
  return [...news].sort((a, b) => {
    const dateA = (a.date || '').replace(/[^0-9]/g, '');
    const dateB = (b.date || '').replace(/[^0-9]/g, '');
    return dateB.localeCompare(dateA);
  });
}
