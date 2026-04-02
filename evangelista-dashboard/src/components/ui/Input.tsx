import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({ label, error, helper, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[9px] font-semibold uppercase tracking-wider text-content-tertiary px-0.5">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            input-glass w-full px-4 py-2.5 text-[13px] font-medium
            placeholder:text-content-tertiary/40
            transition-all duration-200
            ${error
              ? '!border-red-500/40 focus:!border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
              : ''
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {(error || helper) && (
        <p className={`text-[9px] px-0.5 ${error ? 'text-red-400/80' : 'text-content-tertiary/60'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
}
