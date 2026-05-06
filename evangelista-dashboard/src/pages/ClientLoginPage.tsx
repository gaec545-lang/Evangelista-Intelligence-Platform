import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function ClientLoginPage() {
  const { user, signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError('Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-screen w-full overflow-hidden select-none"
      style={{ backgroundColor: '#12120f' }}
    >
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <rect width="100" height="100" fill="#12120f" />
          {/* HIGH VISIBILITY LINES */}
          <path d="M-10,20 C30,80 70,20 110,80" stroke="#b89a42" strokeWidth="2" fill="none" />
          <path d="M-10,50 C30,10 70,90 110,50" stroke="#b89a42" strokeWidth="1" fill="none" />
          <path d="M50,-10 C10,30 90,70 50,110" stroke="#3e4d32" strokeWidth="2.5" fill="none" />
          <path d="M20,-10 C80,40 20,60 80,110" stroke="#3e4d32" strokeWidth="1" fill="none" />
          <path d="M0,0 L100,100" stroke="#b89a42" strokeWidth="0.2" opacity="0.3" fill="none" />
          <path d="M100,0 L0,100" stroke="#3e4d32" strokeWidth="0.2" opacity="0.3" fill="none" />
        </svg>
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 flex h-full w-full">
        {/* LEFT MESSAGE */}
        <div className="hidden lg:flex w-1/2 h-full flex-col p-8">
          <div className="relative flex-1 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col justify-between p-12 overflow-hidden shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center">
                <img src="/logo-white.png" alt="Logo" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
              <div>
                <h2 className="font-brand text-[18px] font-medium text-white">Evangelista & Co.</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#b89a42]">Portal de Clientes</p>
              </div>
            </div>

            {/* Central Slogan */}
            <div className="flex flex-col items-center">
              <h1 className="font-brand italic text-[42px] text-white text-center leading-tight">
                Claridad y control <br />
                sobre tu <br />
                <span className="text-[#b89a42] not-italic font-bold">estrategia.</span>
              </h1>
              <div className="w-16 h-[2px] mt-8 bg-[#b89a42]/30" />
            </div>

            {/* Quote */}
            <p className="font-brand italic text-[16px] text-white/60 max-w-xs leading-relaxed">
              "Acompañamiento continuo y visibilidad total en cada decisión estratégica."
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-24 relative">
          {/* Back button */}
          <button 
            onClick={() => navigate('/')}
            className="absolute top-10 left-10 md:left-24 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[13px]"
          >
            <ArrowLeft size={16} />
            <span>Volver al acceso principal</span>
          </button>

          <div className="max-w-md w-full mx-auto bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-[2px] bg-[#b89a42]" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#b89a42] font-bold">Portal VIP</span>
              </div>
              <h3 className="font-brand text-[32px] font-medium text-white mb-2">Acceso de Clientes</h3>
              <p className="text-white/50 text-[15px]">Gestiona tus activos y visualiza tu progreso.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-white/70 ml-1">Email Corporativo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#b89a42] focus:ring-1 focus:ring-[#b89a42] transition-all"
                  placeholder="ejemplo@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-white/70 ml-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#b89a42] focus:ring-1 focus:ring-[#b89a42] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#b89a42] hover:bg-[#d4b762] text-[#12120f] rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#b89a42]/10"
              >
                {loading ? 'Cargando...' : 'Entrar al Portal'}
                <ArrowRight size={18} />
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[13px] text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
