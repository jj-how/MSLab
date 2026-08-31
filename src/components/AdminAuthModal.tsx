import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, X, ShieldCheck } from 'lucide-react';

export const ADMIN_PIN_STORAGE_KEY = 'jnu_msa_stat_admin_pin_v1';
export const DEFAULT_ADMIN_PIN = '798800';

export const getStoredAdminPin = (): string => {
  try {
    const saved = localStorage.getItem(ADMIN_PIN_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch (e) {
    console.error('Error reading admin pin', e);
  }
  return DEFAULT_ADMIN_PIN;
};

export const setStoredAdminPin = (newPin: string): void => {
  try {
    localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin.trim());
  } catch (e) {
    console.error('Error saving admin pin', e);
  }
};

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang?: 'ko' | 'en';
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang = 'ko'
}) => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMessage('');
      setShake(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const currentPin = getStoredAdminPin();

    if (pin === currentPin) {
      setErrorMessage('');
      onSuccess();
    } else {
      setErrorMessage(
        lang === 'ko'
          ? '비밀번호가 일치하지 않습니다. 다시 입력해주세요.'
          : 'Incorrect password. Please try again.'
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
      inputRef.current?.select();
    }
  };

  return (
    <div
      id="admin-auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="admin-auth-card"
        className={`bg-white w-full max-w-md rounded-sm border border-slate-300 shadow-2xl overflow-hidden transition-transform ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm tracking-tight">
                {lang === 'ko' ? '연구실 관리자 인증' : 'Lab Admin Authentication'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {lang === 'ko' ? '관리자 권한 비밀번호 입력' : 'Enter Admin PIN / Password'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 font-mono">
              <span>{lang === 'ko' ? '관리자 비밀번호 (PIN)' : 'Admin Password (PIN)'}</span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                id="admin-pin-input"
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder={lang === 'ko' ? '비밀번호를 입력하세요' : 'Enter password'}
                className={`w-full pl-9 pr-10 py-2 text-sm font-mono rounded-sm border ${
                  errorMessage
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-200'
                } bg-slate-50/50 outline-hidden transition`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          <div className="bg-sky-50/70 border border-[#b7e0fa] rounded-sm p-3 text-[11px] text-sky-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-900">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>{lang === 'ko' ? '보안 안내' : 'Security Notice'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'ko'
                ? '연구실 정보 수정 권한은 지정된 관리자만 접근할 수 있습니다. 접속 후 관리자 창에서 언제든지 비밀번호를 변경할 수 있습니다.'
                : 'Only authorized personnel may modify lab data. Password can be updated in the Admin settings.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-mono rounded-sm text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
            >
              {lang === 'ko' ? '취소' : 'Cancel'}
            </button>
            <button
              type="submit"
              id="admin-auth-submit-btn"
              className="px-4 py-2 text-xs font-mono font-bold rounded-sm bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>{lang === 'ko' ? '인증 및 진입' : 'Authenticate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
