import React from 'react';
import { cn } from '../../utils/cn';

// ── Step progress tracker ─────────────────────

export interface Step {
  label: string;
  description?: string;
}

export interface StepProgressProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  className?: string;
  theme?: 'dark' | 'light';
}

export function StepProgress({ steps, currentStep, className, theme = 'dark' }: StepProgressProps) {
  const isDark = theme === 'dark';
  return (
    <ol
      className={cn('flex items-start', className)}
      role="list"
      aria-label="Form progress"
    >
      {steps.map((step, i) => {
        const done   = i < currentStep;
        const active = i === currentStep;
        return (
          <li key={i} className="flex flex-col items-center flex-1 relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'absolute top-3.5 left-1/2 w-full h-0.5 z-0',
                  done
                    ? 'bg-[#FF612B]'
                    : isDark ? 'bg-white/15' : 'bg-[#E9ECEF]'
                )}
                aria-hidden="true"
              />
            )}

            {/* Dot */}
            <div
              className={cn(
                'relative z-10 w-7 h-7 rounded-full flex items-center justify-center',
                'text-xs font-medium transition-all duration-200',
                done   && 'bg-[#FF612B] text-white',
                active && 'bg-[#FF612B] text-white ring-4 ring-[#FF612B]/30',
                !done && !active && isDark
                  ? 'border-2 border-white/25 text-white/40'
                  : !done && !active
                  ? 'border-2 border-[#DEE2E6] text-[#ADB5BD]'
                  : ''
              )}
              aria-label={`Step ${i + 1}: ${step.label}${done ? ', completed' : active ? ', current step' : ''}`}
            >
              {done ? '✓' : i + 1}
            </div>

            {/* Label */}
            <span
              className={cn(
                'mt-1.5 text-center text-[10px] whitespace-nowrap',
                isDark
                  ? (active || done) ? 'text-white/90' : 'text-white/40'
                  : (active || done) ? 'text-[#343A40]' : 'text-[#ADB5BD]'
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// ── Breadcrumb ────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 flex-wrap list-none m-0 p-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="text-sm text-[#0067B1] hover:underline no-underline"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={cn(
                    'text-sm',
                    isLast ? 'text-[#212529] font-medium' : 'text-[#6C757D]'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-[#ADB5BD] text-xs" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Tabs ──────────────────────────────────────

export interface Tab {
  id: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  'aria-label'?: string;
}

export function Tabs({ tabs, activeTab, onChange, className, 'aria-label': ariaLabel }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'flex border-b border-[#E9ECEF] gap-0',
        className
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          disabled={tab.disabled}
          onClick={() => !tab.disabled && onChange(tab.id)}
          className={cn(
            'px-4 py-2.5 text-sm flex items-center gap-2 border-b-2 -mb-px',
            'transition-colors duration-150 outline-none',
            'focus-visible:ring-2 focus-visible:ring-[#FF612B] focus-visible:ring-inset',
            activeTab === tab.id
              ? 'border-[#FF612B] text-[#FF612B] font-medium'
              : 'border-transparent text-[#6C757D] hover:text-[#212529]',
            tab.disabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          {tab.label}
          {tab.badge !== undefined && (
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full font-medium',
                activeTab === tab.id
                  ? 'bg-[#FFF0EB] text-[#A63E1A]'
                  : 'bg-[#F1F3F5] text-[#6C757D]'
              )}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
