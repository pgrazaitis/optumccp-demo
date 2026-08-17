import React from 'react';
import { cn } from '../../utils/cn';

// ── Shared field wrapper ──────────────────────

export interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({
  label,
  htmlFor,
  required,
  hint,
  error,
  optional,
  children,
  className,
}: FieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-[#343A40] flex items-center gap-1.5 flex-wrap"
        >
          {label}
          {required && (
            <span className="text-[#C62828]" aria-label="required">*</span>
          )}
          {optional && (
            <span className="text-xs font-normal text-[#6C757D] bg-[#F1F3F5] px-2 py-0.5 rounded-full">
              optional
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-[#6C757D]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-[#C62828] flex items-center gap-1" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ── Input ─────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  prefilled?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, prefilled, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 text-sm rounded border',
        'text-[#212529] placeholder:text-[#ADB5BD]',
        'transition-all duration-150 outline-none',
        error
          ? 'border-[#C62828] focus:ring-[#C62828]/20'
          : 'border-[#ADB5BD] focus:border-[#FF612B] focus:ring-[#FF612B]/20',
        'focus:ring-[3px]',
        prefilled && 'bg-[#F8F9FA]',
        !prefilled && 'bg-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

// ── Select ────────────────────────────────────

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 text-sm rounded border appearance-none',
        'text-[#212529] bg-white cursor-pointer',
        'transition-all duration-150 outline-none',
        error
          ? 'border-[#C62828] focus:ring-[#C62828]/20'
          : 'border-[#ADB5BD] focus:border-[#FF612B] focus:ring-[#FF612B]/20',
        'focus:ring-[3px]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Custom chevron
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236C757D' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] pr-9",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

// ── Textarea ──────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2.5 text-sm rounded border',
        'text-[#212529] placeholder:text-[#ADB5BD] bg-white',
        'resize-vertical min-h-[90px]',
        'transition-all duration-150 outline-none',
        error
          ? 'border-[#C62828] focus:ring-[#C62828]/20'
          : 'border-[#ADB5BD] focus:border-[#FF612B] focus:ring-[#FF612B]/20',
        'focus:ring-[3px]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

// ── Checkbox ──────────────────────────────────

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-2.5 cursor-pointer group', className)}>
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-[#ADB5BD] accent-[#FF612B] cursor-pointer"
        {...props}
      />
      <span className="text-sm text-[#343A40] group-hover:text-[#212529]">{label}</span>
    </label>
  );
}

// ── Chip checkbox (multi-select) ──────────────

export interface ChipCheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ChipCheckbox({ label, checked, onChange, disabled, className }: ChipCheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded border cursor-pointer',
        'transition-all duration-150 select-none',
        checked
          ? 'border-[#FF612B] bg-[#FFF0EB] text-[#A63E1A] font-medium'
          : 'border-[#ADB5BD] bg-white text-[#343A40] hover:border-[#FF612B]',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      {checked && <span className="text-[#FF612B] text-xs" aria-hidden="true">✓</span>}
      {label}
    </label>
  );
}

// ── Radio group ───────────────────────────────

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  'aria-label'?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  direction = 'horizontal',
  className,
  'aria-label': ariaLabel,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'flex flex-wrap gap-3',
        direction === 'vertical' && 'flex-col',
        className
      )}
    >
      {options.map(opt => (
        <label
          key={opt.value}
          className={cn(
            'flex items-start gap-2 cursor-pointer',
            opt.disabled && 'opacity-40 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            disabled={opt.disabled}
            className="mt-0.5 accent-[#FF612B] cursor-pointer w-4 h-4 shrink-0"
          />
          <span>
            <span className="text-sm text-[#343A40]">{opt.label}</span>
            {opt.description && (
              <span className="block text-xs text-[#6C757D] mt-0.5">{opt.description}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
