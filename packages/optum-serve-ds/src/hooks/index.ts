import { useState, useCallback } from 'react';
import type { Status } from '../types';

// ── useToast ──────────────────────────────────

export interface ToastItem {
  id: string;
  message: string;
  status: Status;
  duration?: number;
}

let _toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, status: Status = 'info', duration = 4000) => {
      const id = `toast-${++_toastId}`;
      setToasts(prev => [...prev, { id, message, status, duration }]);
      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
    success: (msg: string, d?: number) => addToast(msg, 'success', d),
    error:   (msg: string, d?: number) => addToast(msg, 'error',   d),
    warning: (msg: string, d?: number) => addToast(msg, 'warning', d),
    info:    (msg: string, d?: number) => addToast(msg, 'info',    d),
  };
}

// ── useMultiStep ──────────────────────────────

export interface UseMultiStepOptions {
  totalSteps: number;
  initialStep?: number;
  onComplete?: () => void;
}

export function useMultiStep({ totalSteps, initialStep = 0, onComplete }: UseMultiStepOptions) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = useCallback(() => {
    setCurrentStep(s => {
      if (s === totalSteps - 1) {
        onComplete?.();
        return s;
      }
      return s + 1;
    });
  }, [totalSteps, onComplete]);

  const prev = useCallback(() => {
    setCurrentStep(s => Math.max(0, s - 1));
  }, []);

  const goTo = useCallback((step: number) => {
    setCurrentStep(Math.min(totalSteps - 1, Math.max(0, step)));
  }, [totalSteps]);

  return {
    currentStep,
    isFirst:    currentStep === 0,
    isLast:     currentStep === totalSteps - 1,
    progress:   ((currentStep + 1) / totalSteps) * 100,
    next,
    prev,
    goTo,
  };
}

// ── useDisclosure (modal / drawer open state) ─

export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  return {
    isOpen,
    open:   () => setIsOpen(true),
    close:  () => setIsOpen(false),
    toggle: () => setIsOpen(v => !v),
  };
}

// ── useLocalStorage ───────────────────────────

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStored = useCallback(
    (val: T | ((prev: T) => T)) => {
      const next = val instanceof Function ? val(value) : val;
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // silently fail if storage unavailable
      }
    },
    [key, value]
  );

  return [value, setStored] as const;
}

// ── useDebounce ───────────────────────────────

import { useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

// ── usePrevious ───────────────────────────────

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
