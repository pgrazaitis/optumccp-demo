import React from 'react';
import { cn } from '../../utils/cn';

// ── Stat card ─────────────────────────────────

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-[#F1F3F5] rounded-lg p-4',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6C757D] mb-1">{label}</p>
          <p className="text-2xl font-medium text-[#212529] leading-none">{value}</p>
          {change && (
            <p
              className={cn(
                'inline-flex items-center gap-1 text-xs mt-2',
                'px-2 py-0.5 rounded-full',
                change.positive
                  ? 'bg-[#EDF7EE] text-[#1B5E20]'
                  : 'bg-[#FEECEC] text-[#B71C1C]'
              )}
            >
              <span aria-hidden="true">{change.positive ? '↑' : '↓'}</span>
              {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-[#FFF0EB] flex items-center justify-center text-[#FF612B] shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────

export interface ProgressBarProps {
  value: number;     // 0–100
  label?: string;
  showValue?: boolean;
  color?: 'orange' | 'blue' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const progressColors = {
  orange: 'bg-[#FF612B]',
  blue:   'bg-[#0067B1]',
  green:  'bg-[#2E7D32]',
  red:    'bg-[#C62828]',
};

const progressSizes = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  label,
  showValue = true,
  color = 'orange',
  size = 'md',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-[#6C757D]">{label}</span>}
          {showValue && (
            <span className="text-xs font-medium text-[#343A40]">{clamped}%</span>
          )}
        </div>
      )}
      <div
        className={cn('w-full bg-[#E9ECEF] rounded-full overflow-hidden', progressSizes[size])}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300', progressColors[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

// ── Data table ────────────────────────────────

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  caption?: string;
  className?: string;
  stickyHeader?: boolean;
}

export function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyState,
  caption,
  className,
  stickyHeader,
}: DataTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-[#E9ECEF]', className)}>
      <table className="w-full text-sm border-collapse">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className={cn(stickyHeader && 'sticky top-0 z-10')}>
            {columns.map(col => (
              <th
                key={String(col.key)}
                scope="col"
                style={{ width: col.width }}
                className={cn(
                  'px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider',
                  'text-[#6C757D] bg-[#F8F9FA] border-b border-[#E9ECEF] whitespace-nowrap',
                  col.align === 'right'  && 'text-right',
                  col.align === 'center' && 'text-center'
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={String(row[rowKey])}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-[#F1F3F5] last:border-0',
                'bg-white transition-colors duration-100',
                onRowClick && 'cursor-pointer hover:bg-[#FFF0EB]/40'
              )}
            >
              {columns.map(col => (
                <td
                  key={String(col.key)}
                  className={cn(
                    'px-3 py-2.5 text-[#212529]',
                    col.align === 'right'  && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                >
                  {col.render
                    ? col.render(row, i)
                    : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Divider ───────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-[#E9ECEF] my-4', className)} />;
}
