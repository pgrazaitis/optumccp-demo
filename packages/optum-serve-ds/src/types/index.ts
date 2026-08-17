// ─────────────────────────────────────────────
//  Optum Serve Design System — Shared Types
// ─────────────────────────────────────────────

export type Size       = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant    = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Status     = 'info' | 'success' | 'warning' | 'error';
export type Align      = 'left' | 'center' | 'right';
export type BadgeColor = 'orange' | 'blue' | 'teal' | 'green' | 'amber' | 'red' | 'gray';

export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}
