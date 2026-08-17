import React from 'react';
import { cn } from '../../utils/cn';
import type { Status } from '../../types';

export interface AlertProps {
  status?: Status;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const statusMap: Record<Status, { bg: string; border: string; text: string; icon: string }> = {
  info:    { bg: 'bg-[#E6F2FA]', border: 'border-[#0067B1]', text: 'text-[#004780]', icon: '○' },
  success: { bg: 'bg-[#EDF7EE]', border: 'border-[#2E7D32]', text: 'text-[#1B5E20]', icon: '✓' },
  warning: { bg: 'bg-[#FFF3E0]', border: 'border-[#E65100]', text: 'text-[#BF360C]', icon: '△' },
  error:   { bg: 'bg-[#FEECEC]', border: 'border-[#C62828]', text: 'text-[#B71C1C]', icon: '✕' },
};

export function Alert({ status = 'info', title, children, onClose, className }: AlertProps) {
  const s = statusMap[status];
  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 p-3.5 rounded-r border-l-[3px]',
        s.bg, s.border, s.text,
        className
      )}
    >
      <span className="shrink-0 text-sm font-medium mt-0.5" aria-hidden="true">
        {s.icon}
      </span>
      <div className="flex-1 min-w-0 text-sm leading-relaxed">
        {title && <p className="font-medium mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
