import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Hexagon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import loginImage from '../assets/image-login.jpg';

export function LoginPage() {
  const { user, signIn } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn();
    } catch (err) {
      setError('Credenciales inválidas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex h-screen w-full overflow-hidden bg-[var(--eva-black)] select-none text-[var(--eva-txt-primary)]"
    >
      {/* LEFT COLUMN: BRAND IMAGE & OVERLAY */}
      <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden flex-col py-7 pl-20 pr-4 bg-[var(--eva-black)]">
        {/* New Login Image */}
        <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-[var(--eva-border)]">
          <div 
            className="w-full h-full bg-cover bg-[position:80%_50%] transition-transform duration-[20000ms] hover:scale-110"
            style={{ backgroundImage: `url(${loginImage})` }}
          />
          {/* Subtle overlay for the image to maintain brand feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--eva-black)]/35 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 md:px-24 xl:px-32 bg-[var(--eva-black)]">
        <div className="max-w-sm w-full mx-auto p-8 rounded-[2rem] bg-[#1e1e1a] border border-[var(--eva-border)] shadow-2xl">
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[1px] bg-[var(--eva-gold)]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--eva-gold)]">
                Acceso Reservado
              </span>
            </div>
            <div className="flex items-center gap-4">
              <img src={`${import.meta.env.BASE_URL}logo-white.png`} alt="Logo" className="h-12 w-auto" />
              <h3 className="font-brand text-[28px] font-medium text-[var(--eva-txt-primary)] leading-tight">
                Evangelista <br /> Intelligence Platform
              </h3>
            </div>
            <p className="font-ui text-[14px] text-[var(--eva-txt-secondary)] mt-3 leading-relaxed">
              Bienvenido a la plataforma de gestión y desarrollo para clientes y equipo de nuestra firma.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative w-full py-3 px-4 bg-[var(--eva-gold)] hover:bg-[var(--eva-gold-2)] text-[#141410] rounded-lg text-[13px] font-bold tracking-wide transition-all duration-200 font-ui flex items-center justify-center shadow-lg shadow-[var(--eva-gold)]/20"
            >
              {loading ? 'Validando…' : 'Iniciar Sesión con Microsoft'}
              <ArrowRight size={16} className="absolute right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-[var(--eva-critical)]/10 border border-[var(--eva-critical)]/20 rounded-lg">
              <p className="text-[12px] text-[var(--eva-critical)] font-medium text-center">{error}</p>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8">
            <p className="font-ui text-[11px] text-[var(--eva-txt-muted)] text-center leading-relaxed">
              Sistema restringido. El acceso no autorizado está <br /> 
              monitoreado y sancionado por Evangelista & Co.
            </p>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}
