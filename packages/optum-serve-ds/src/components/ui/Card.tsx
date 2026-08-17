import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  as?: React.ElementType;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  padded = true,
  bordered = true,
  elevated = false,
  as: Tag = 'div',
  onClick,
}: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-white rounded-xl',
        padded && 'p-5',
        bordered && 'border border-[#E9ECEF]',
        elevated ? 'shadow-md' : 'shadow-none',
        onClick && 'cursor-pointer hover:border-[#FF612B] transition-colors duration-150',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}

// ── Sub-components ────────────────────────

export interface CardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  sectionNumber?: string | number;
  className?: string;
}

export function CardHeader({
  icon,
  title,
  subtitle,
  badge,
  action,
  sectionNumber,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 pb-4 mb-4',
        'border-b border-[#E9ECEF]',
        className
      )}
    >
      {/* Section number circle */}
      {sectionNumber !== undefined && (
        <div className="w-8 h-8 rounded-full bg-[#FF612B] text-white flex items-center justify-center text-sm font-medium shrink-0">
          {sectionNumber}
        </div>
      )}

      {/* Icon (without number) */}
      {icon && !sectionNumber && (
        <div className="w-9 h-9 rounded-lg bg-[#FFF0EB] flex items-center justify-center shrink-0 text-[#FF612B]">
          {icon}
        </div>
      )}

      {/* Title + subtitle */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-[#212529] leading-snug">{title}</p>
        {subtitle && (
          <p className="text-xs text-[#6C757D] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Badge */}
      {badge && <div className="shrink-0">{badge}</div>}

      {/* Action (e.g. edit button) */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-sm text-[#6C757D] leading-relaxed', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('pt-4 mt-4 border-t border-[#E9ECEF] flex items-center gap-3', className)}>
      {children}
    </div>
  );
}
