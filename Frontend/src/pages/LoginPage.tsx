import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Hexagon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import loginImage from '../assets/image-login.jpg';

export function LoginPage() {
  const { user, signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const isLocked = lockedUntil != null && Date.now() < lockedUntil;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
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
      className="flex h-screen w-full overflow-hidden bg-white select-none"
    >
      {/* LEFT COLUMN: BRAND IMAGE & OVERLAY */}
      <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden flex-col py-7 pl-20 pr-4">
        {/* New Login Image */}
        <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div 
            className="w-full h-full bg-cover bg-[position:80%_50%] transition-transform duration-[20000ms] hover:scale-110"
            style={{ backgroundImage: `url(${loginImage})` }}
          />
          {/* Subtle overlay for the image to maintain brand feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-eva-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Previous Content (Hidden for now)
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
          style={{ backgroundImage: 'url("/login-bg.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-eva-olive/72 to-eva-black/95 z-0" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-[34px] h-[34px] rounded-lg bg-gradient-to-br from-eva-olive to-eva-olive-2 flex items-center justify-center shadow-lg shadow-black/20">
            <Hexagon size={18} className="text-eva-gold fill-eva-gold/20" />
          </div>
          <div>
            <h2 className="font-brand text-[16px] font-medium text-[#f0ece2]">Evangelista & Co.</h2>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-eva-gold/55">Intelligence Firm</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="font-brand italic text-[38px] text-[#f0ece2] text-center leading-[1.15] max-w-md">
            Transformando la incertidumbre <br />
            en arquitectura de <br />
            <span className="text-eva-gold not-italic font-semibold">decisiones.</span>
          </h1>
          <div className="w-10 h-[1.5px] mt-6 bg-gradient-to-r from-transparent via-eva-gold to-transparent" />
        </div>

        <div className="relative z-10">
          <p className="font-brand italic text-[15px] text-[#f0ece2]/50 max-w-[240px] leading-snug">
            "Si los datos existen, encontraremos la verdad."
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-eva-gold/45 mt-1.5">
            — Misión Evangelista
          </p>
        </div>
        */}
      </div>

      {/* RIGHT COLUMN: LOGIN FORM */}
      <div className="flex-1 lg:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 md:px-24 xl:px-32">
        <div className="max-w-sm w-full mx-auto">
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[1px] bg-eva-olive-3" />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-eva-olive-3">
                Acceso Reservado
              </span>
            </div>
            <div className="flex items-center gap-4">
              <img src={`${import.meta.env.BASE_URL}logoEvangelistaCo.png`} alt="Logo" className="h-12 w-auto" />
              <h3 className="font-brand text-[28px] font-medium text-eva-black leading-tight">
                Evangelista <br /> Intelligence Platform
              </h3>
            </div>
            <p className="font-ui text-[14px] text-eva-txt-mid mt-3 leading-relaxed">
              Bienvenido a la plataforma de gestión y desarrollo para clientes y equipo de nuestra firma.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-ui text-[12px] font-semibold text-eva-txt-mid mb-1.5 ml-1">
                Email Corporativo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-eva-beige border border-eva-border-2 rounded-lg text-sm text-eva-black placeholder:text-eva-txt-faint focus:outline-none focus:border-eva-olive focus:ring-2 focus:ring-eva-olive/8 font-ui transition-all duration-200"
                placeholder="usuario@evangelista.co"
              />
            </div>

            <div>
              <label className="block font-ui text-[12px] font-semibold text-eva-txt-mid mb-1.5 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-eva-beige border border-eva-border-2 rounded-lg text-sm text-eva-black placeholder:text-eva-txt-faint focus:outline-none focus:border-eva-olive focus:ring-2 focus:ring-eva-olive/8 font-ui transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="w-3.5 h-3.5 rounded-sm border border-eva-border-2 flex items-center justify-center group-hover:border-eva-olive transition-colors">
                  <div className="w-1.5 h-1.5 bg-eva-olive rounded-sm opacity-0 group-active:opacity-100" />
                </div>
                <span className="font-ui text-[12px] text-eva-txt-muted">Mantener sesión</span>
              </label>
              <button type="button" className="font-ui text-[12px] text-eva-olive-3 font-semibold hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="group relative w-full py-3 px-4 bg-eva-black hover:bg-eva-olive text-eva-beige rounded-lg text-[13px] font-semibold tracking-wide transition-all duration-200 font-ui flex items-center justify-center"
            >
              {loading ? 'Validando…' : 'Ingresar'}
              <ArrowRight size={16} className="absolute right-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-service-foundation/10 border border-service-foundation/20 rounded-lg">
              <p className="text-[12px] text-service-foundation font-medium text-center">{error}</p>
            </div>
          )}


          {/* Footer */}
          <footer className="mt-8">
            <p className="font-ui text-[11px] text-eva-txt-faint text-center leading-relaxed">
              Sistema restringido. El acceso no autorizado está <br /> 
              monitoreado y sancionado por Evangelista & Co.
            </p>
          </footer>
        </div>
      </div>
    </motion.div>
  );
}
