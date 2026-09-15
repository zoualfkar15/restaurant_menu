import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export const inputClass =
  'block w-full rounded-2xl bg-menu-surface px-4 py-3 text-[15px] font-medium text-menu-ink ring-1 ring-inset ring-menu-border transition placeholder:text-menu-ink-muted hover:ring-menu-border-strong focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500';

export const labelClass = 'mb-1.5 block text-sm font-bold text-menu-ink';

export const primaryButtonClass =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 text-[15px] font-extrabold text-white shadow-primary-glow transition-all hover:bg-primary-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

export const secondaryButtonClass =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-menu-surface px-5 text-[15px] font-bold text-menu-ink ring-1 ring-menu-border transition-colors hover:bg-primary-50 hover:text-primary-800 hover:ring-primary-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

type FieldProps = { id: string; label: ReactNode; hint?: ReactNode };

export function TextField({ id, label, hint, className = '', ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input id={id} className={`${inputClass} ${className}`} aria-describedby={hintId} {...props} />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs font-medium text-menu-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextAreaField({ id, label, hint, className = '', ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea id={id} className={`${inputClass} min-h-[120px] resize-y ${className}`} aria-describedby={hintId} {...props} />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs font-medium text-menu-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
      {children}
    </p>
  );
}
