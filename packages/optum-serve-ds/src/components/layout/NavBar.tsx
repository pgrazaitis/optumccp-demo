import React from 'react';
import { cn } from '../../utils/cn';

export interface NavBarProps {
  logo?: React.ReactNode;
  productName?: string;
  links?: Array<{ label: string; href: string; active?: boolean }>;
  actions?: React.ReactNode;
  className?: string;
}

export function NavBar({ logo, productName = 'Optum Serve', links = [], actions, className }: NavBarProps) {
  return (
    <nav
      className={cn(
        'h-14 px-6 flex items-center justify-between',
        'bg-[#1A2B4A] sticky top-0 z-[200]',
        className
      )}
      role="navigation"
      aria-label="Site navigation"
    >
      {/* Logo + product name */}
      <a href="/" className="flex items-center gap-2.5 text-white no-underline group">
        {logo ?? <DefaultLogoMark />}
        <span className="text-[15px] font-medium opacity-95 group-hover:opacity-100 transition-opacity">
          {productName}
        </span>
      </a>

      {/* Nav links */}
      {links.length > 0 && (
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0" role="list">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'text-sm no-underline transition-colors duration-150',
                  link.active
                    ? 'text-white font-medium'
                    : 'text-white/60 hover:text-white'
                )}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Actions slot */}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </nav>
  );
}

function DefaultLogoMark() {
  return (
    <div
      className="w-8 h-8 bg-[#FF612B] rounded flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" />
        <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Avatar ────────────────────────────────────

export interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md';
}

export function Avatar({ initials, name, size = 'md' }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-white/15 flex items-center justify-center',
        'text-white font-medium shrink-0',
        size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
      )}
      title={name}
      aria-label={name ? `Logged in as ${name}` : 'User avatar'}
    >
      {initials}
    </div>
  );
}
