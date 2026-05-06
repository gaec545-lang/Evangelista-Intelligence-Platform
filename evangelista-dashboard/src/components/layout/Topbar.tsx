import React from 'react';
import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  
  // Basic breadcrumb logic
  const pathnames = location.pathname.split('/').filter((x) => x);
  const pageTitle = pathnames.length > 0 ? pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1) : 'Dashboard';

  return (
    <header className="h-[52px] bg-white border-b border-eva-border flex items-center justify-between px-6 z-10 select-none">
      <div className="flex items-center h-full">
        <h2 className="font-ui text-[15px] font-semibold text-eva-black">
          {pageTitle}
        </h2>
        
        <div className="h-full border-r border-eva-border mx-5" />
        
        <nav className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-eva-txt-muted">evangelista</span>
          {pathnames.map((name, index) => (
            <React.Fragment key={name}>
              <span className="font-mono text-[10px] text-eva-txt-faint">/</span>
              <span className={`font-mono text-[11px] ${index === pathnames.length - 1 ? 'text-eva-txt-mid' : 'text-eva-txt-muted'}`}>
                {name}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-1.5 text-eva-txt-muted hover:text-eva-txt-dark transition-colors">
          <Bell size={18} />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-service-foundation rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
