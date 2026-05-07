import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Circle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export function EntryPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isExiting, setIsExiting] = React.useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleNavigation = (path: string) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 400); // Wait for exit animation
  };

  return (
    <div className="min-h-screen w-full bg-eva-beige flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden relative">
      {/* Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-eva-olive/5 rounded-full blur-[120px]" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-eva-gold/5 rounded-full blur-[120px]" 
      />
      
      {/* Main Content Container */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl w-full flex flex-col items-center z-10"
          >
            
            {/* Header Section */}
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <img src="/platform/logoEvangelistaCo.png" alt="Evangelista & Co" className="h-20 w-auto" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-brand text-4xl sm:text-5xl font-medium text-eva-black leading-tight mb-4"
              >
                Intelligence Platform
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="font-ui text-lg text-eva-txt-muted max-w-xl mx-auto leading-relaxed"
              >
                Bienvenido al centro de inteligencia estratégica de <span className="text-eva-olive-3 font-semibold">Evangelista & Co.</span> Por favor, selecciona tu portal de acceso.
              </motion.p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              
              {/* Internal Firm Access Card */}
              <motion.button 
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('/login')}
                className="group relative bg-white border border-eva-border rounded-[2rem] p-10 text-left transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(62,77,50,0.12)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-eva-olive/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all duration-500 group-hover:bg-eva-olive/10 group-hover:scale-110" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-eva-black flex items-center justify-center mb-8 shadow-xl shadow-eva-black/10 transition-transform duration-500 group-hover:scale-110">
                    <Hexagon size={28} className="text-eva-gold fill-eva-gold/10" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-eva-olive-3" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-eva-olive-3 font-bold">
                      Acceso Interno
                    </span>
                  </div>
                  
                  <h2 className="font-brand text-2xl font-medium text-eva-black mb-4">
                    Consultoría & Staff
                  </h2>
                  
                  <p className="font-ui text-[14px] text-eva-txt-mid leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                    Portal exclusivo para consultores y personal administrativo de la firma. Gestión de proyectos, análisis de inteligencia y herramientas de decisión.
                  </p>
                  
                  <div className="flex items-center gap-2 text-eva-olive-3 font-ui text-[13px] font-bold group-hover:gap-4 transition-all">
                    <span>Ingresar al sistema</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.button>

              {/* Client Portal Card */}
              <motion.button 
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('/client-login')}
                className="group relative bg-white border border-eva-border rounded-[2rem] p-10 text-left transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(184,154,66,0.12)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-eva-gold/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-all duration-500 group-hover:bg-eva-gold/10 group-hover:scale-110" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-eva-gold flex items-center justify-center mb-8 shadow-xl shadow-eva-gold/10 transition-transform duration-500 group-hover:scale-110">
                    <Circle size={20} className="text-white fill-white/20" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-[1px] bg-eva-gold" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-eva-gold font-bold">
                      Portal de Clientes
                    </span>
                  </div>
                  
                  <h2 className="font-brand text-2xl font-medium text-eva-black mb-4">
                    Clientes Sentinel
                  </h2>
                  
                  <p className="font-ui text-[14px] text-eva-txt-mid leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                    Acceso para socios y directivos externos. Visualización de dashboards personalizados, monitoreo de riesgos y reportes estratégicos.
                  </p>
                  
                  <div className="flex items-center gap-2 text-eva-gold font-ui text-[13px] font-bold group-hover:gap-4 transition-all">
                    <span>Acceder a mi panel</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.button>

            </div>

            {/* Footer */}
            <div className="mt-20 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-eva-txt-faint">
                © 2026 Evangelista & Co. — Todos los derechos reservados.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition Overlay */}
      {isExiting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-white z-[100] flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <img src="/platform/logoEvangelistaCo.png" alt="Loading..." className="h-28 w-auto grayscale opacity-10" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
