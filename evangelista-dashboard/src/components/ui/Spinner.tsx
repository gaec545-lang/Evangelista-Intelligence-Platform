export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizes = { 
    sm: 'w-4 h-4 border-2', 
    md: 'w-8 h-8 border-3', 
    lg: 'w-12 h-12 border-4' 
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className={`${sizes[size]} border-primary-100 rounded-full`} />
      <div className={`absolute inset-0 ${sizes[size]} border-t-primary-500 rounded-full animate-spin`} />
    </div>
  );
}
