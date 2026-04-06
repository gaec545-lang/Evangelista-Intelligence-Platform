import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ElementType;
  iconTrailing?: boolean;
}

export function Input({ label, error, helper, icon: Icon, iconTrailing, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[9px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            input-glass w-full py-2.5 text-[13px] font-medium
            ${Icon && !iconTrailing ? 'pl-9 pr-4' : ''}
            ${Icon && iconTrailing ? 'pl-4 pr-9' : ''}
            ${!Icon ? 'px-4' : ''}
            placeholder:text-[#A1A1A6]/50
            transition-all duration-200
            ${error
              ? '!border-red-500/40 focus:!border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
              : ''
            }
            ${className}
          `}
          {...props}
        />
        {Icon && !iconTrailing && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A6]/50 size-4 pointer-events-none group-focus-within:text-[#95B877] transition-colors" />
        )}
        {Icon && iconTrailing && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A6]/40 size-4 pointer-events-none" />
        )}
      </div>
      {(error || helper) && (
        <p className={`text-[9px] px-0.5 ${error ? 'text-red-400' : 'text-[#A1A1A6]/80'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
}
