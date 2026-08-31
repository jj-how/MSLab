import React, { useState } from 'react';
import { Publication } from '../types';
import { X, Copy, Check, BookOpen, ExternalLink, Code } from 'lucide-react';

interface BibtexModalProps {
  publication: Publication | null;
  onClose: () => void;
}

export const BibtexModal: React.FC<BibtexModalProps> = ({ publication, onClose }) => {
  const [copiedType, setCopiedType] = useState<'bibtex' | 'apa' | 'ieee' | null>(null);

  if (!publication) return null;

  const authorsText = publication.authors.join(', ');
  const apaCitation = `${publication.authors.join(', ')} (${publication.year}). ${publication.title}. ${publication.venue}.`;
  const ieeeCitation = `${publication.authors.map(a => a.split(' ').pop() + ', ' + a.split(' ')[0][0] + '.').join(', ')}, "${publication.title}," ${publication.venue}, ${publication.year}.`;

  const copyToClipboard = (text: string, type: 'bibtex' | 'apa' | 'ieee') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div id="bibtex-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="bibtex-modal-container" 
        className="bg-white text-slate-900 rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#e0f2fe] text-sky-800 border border-[#b7e0fa] rounded-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-950 text-base sm:text-lg">Citation & BibTeX</h3>
              <p className="text-xs text-slate-500 font-mono truncate max-w-sm sm:max-w-md">{publication.venue} ({publication.year})</p>
            </div>
          </div>
          <button 
            id="close-bibtex-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-sm transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          <div>
            <h4 className="font-serif font-bold text-slate-950 text-base mb-1">{publication.title}</h4>
            <p className="text-slate-500 text-xs mb-3 font-light">{authorsText}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-sm text-[11px] font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {publication.venueType}
              </span>
              {publication.award && (
                <span className="px-2.5 py-0.5 rounded-sm text-[11px] font-mono bg-[#b7e0fa] text-slate-900 border border-[#9ed3f7] font-semibold">
                  🏆 {publication.award}
                </span>
              )}
            </div>
          </div>

          {/* BibTeX Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-sky-900 flex items-center gap-1.5 font-bold">
                <Code className="w-3.5 h-3.5 text-sky-600" /> BibTeX Format
              </span>
              <button
                id="copy-bibtex-btn"
                onClick={() => copyToClipboard(publication.bibtex, 'bibtex')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold bg-[#b7e0fa] hover:bg-[#9ed3f7] text-slate-900 rounded-sm transition shadow-xs border border-[#8ed0fa]"
              >
                {copiedType === 'bibtex' ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> 복사 완료! (Copied)
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> BibTeX 복사
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-sm text-xs font-mono overflow-x-auto leading-relaxed border border-slate-700 select-all">
                {publication.bibtex}
              </pre>
            </div>
          </div>

          {/* Formatted APA Citation */}
          <div className="p-4 bg-slate-50 rounded-sm border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-sky-900 uppercase tracking-wider">APA Citation</span>
              <button
                id="copy-apa-btn"
                onClick={() => copyToClipboard(apaCitation, 'apa')}
                className="text-xs text-slate-600 hover:text-sky-800 font-mono inline-flex items-center gap-1 transition"
              >
                {copiedType === 'apa' ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'apa' ? '복사됨' : 'APA 복사'}
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-light">{apaCitation}</p>
          </div>

          {/* Formatted IEEE Citation */}
          <div className="p-4 bg-slate-50 rounded-sm border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-sky-900 uppercase tracking-wider">IEEE Citation</span>
              <button
                id="copy-ieee-btn"
                onClick={() => copyToClipboard(ieeeCitation, 'ieee')}
                className="text-xs text-slate-600 hover:text-sky-800 font-mono inline-flex items-center gap-1 transition"
              >
                {copiedType === 'ieee' ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedType === 'ieee' ? '복사됨' : 'IEEE 복사'}
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-light">{ieeeCitation}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="close-bibtex-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium text-slate-700 hover:bg-slate-200 rounded-sm transition"
          >
            닫기 (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
