import React from 'react';
import { cn } from '../../utils/cn';
import type { BadgeColor } from '../../types';

export interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const colorMap: Record<BadgeColor, string> = {
  orange: 'bg-[#FFF0EB] text-[#A63E1A]',
  blue:   'bg-[#E6F2FA] text-[#004780]',
  teal:   'bg-[#E0F5F4] text-[#005C56]',
  green:  'bg-[#EDF7EE] text-[#1B5E20]',
  amber:  'bg-[#FFF3E0] text-[#BF360C]',
  red:    'bg-[#FEECEC] text-[#B71C1C]',
  gray:   'bg-[#F1F3F5] text-[#495057]',
};

const dotColor: Record<BadgeColor, string> = {
  orange: 'bg-[#FF612B]',
  blue:   'bg-[#0067B1]',
  teal:   'bg-[#00837A]',
  green:  'bg-[#2E7D32]',
  amber:  'bg-[#E65100]',
  red:    'bg-[#C62828]',
  gray:   'bg-[#6C757D]',
};

export function Badge({ color = 'gray', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5',
        'rounded-full text-xs font-medium leading-none',
        colorMap[color],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor[color])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
