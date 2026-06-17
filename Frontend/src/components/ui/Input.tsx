import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ElementType;
  iconTrailing?: boolean;
  variant?: 'light' | 'dark';
}

export function Input({ 
  label, 
  error, 
  helper, 
  icon: Icon, 
  iconTrailing, 
  className = '', 
  variant = 'light',
  ...props 
}: InputProps) {
  const isDark = variant === 'dark';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className={`text-[12px] font-semibold px-0.5 font-ui ${isDark ? 'text-white/60' : 'text-eva-txt-mid'}`}>
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            w-full py-2.5 text-[13px] font-medium 
            ${isDark 
              ? 'bg-black border-white/[0.1] text-white placeholder:text-white/20 focus:border-eva-gold/50 focus:ring-eva-gold/10' 
              : 'bg-eva-beige border border-eva-border-2 text-eva-black placeholder:text-eva-txt-faint focus:border-eva-olive focus:ring-2 focus:ring-eva-olive/8'
            }

            rounded-lg
            font-ui transition-all duration-200
            ${Icon && !iconTrailing ? 'pl-9 pr-4' : ''}
            ${Icon && iconTrailing ? 'pl-4 pr-9' : ''}
            ${!Icon ? 'px-4' : ''}
            ${error
              ? '!border-service-foundation/40 focus:!border-service-foundation/60 focus:ring-service-foundation/10'
              : ''
            }
            ${className}
          `}
          {...props}
        />
        {Icon && !iconTrailing && (
          <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none transition-colors ${isDark ? 'text-white/30 group-focus-within:text-eva-gold' : 'text-eva-txt-muted group-focus-within:text-eva-olive'}`} />
        )}
        {Icon && iconTrailing && (
          <Icon className={`absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none ${isDark ? 'text-white/30' : 'text-eva-txt-muted'}`} />
        )}
      </div>
      {(error || helper) && (
        <p className={`text-[10px] px-0.5 font-ui ${error ? 'text-service-foundation font-medium' : isDark ? 'text-white/40' : 'text-eva-txt-muted'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
}

