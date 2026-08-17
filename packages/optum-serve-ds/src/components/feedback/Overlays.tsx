import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import type { Status } from '../../types';

// ── Modal ─────────────────────────────────────

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  className?: string;
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement;
    dialogRef.current?.focus();
    return () => prev?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#1A2B4A]/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          'relative w-full bg-white rounded-xl shadow-xl',
          'outline-none',
          modalSizes[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E9ECEF]">
          <h2 id="modal-title" className="text-[17px] font-medium text-[#212529]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-lg text-[#6C757D]',
              'hover:bg-[#F1F3F5] hover:text-[#212529] transition-colors',
              'focus-visible:ring-2 focus-visible:ring-[#FF612B]'
            )}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-[#E9ECEF]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────

export interface ToastProps {
  id: string;
  message: string;
  status?: Status;
  duration?: number; // ms; 0 = persist
  onDismiss: (id: string) => void;
}

const toastColors: Record<Status, string> = {
  info:    'bg-[#E6F2FA] text-[#004780] border-[#0067B1]',
  success: 'bg-[#EDF7EE] text-[#1B5E20] border-[#2E7D32]',
  warning: 'bg-[#FFF3E0] text-[#BF360C] border-[#E65100]',
  error:   'bg-[#FEECEC] text-[#B71C1C] border-[#C62828]',
};

const toastIcons: Record<Status, string> = {
  info: '○', success: '✓', warning: '△', error: '✕',
};

export function Toast({ id, message, status = 'info', duration = 4000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border-l-4',
        'shadow-lg text-sm min-w-[280px] max-w-sm',
        'animate-in slide-in-from-right-2',
        toastColors[status]
      )}
    >
      <span aria-hidden="true">{toastIcons[status]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        className="opacity-60 hover:opacity-100 transition-opacity ml-2"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

// ── Toast container ───────────────────────────

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed bottom-5 right-5 z-[500] flex flex-col gap-2"
      aria-label="Notifications"
    >
      {children}
    </div>
  );
}
