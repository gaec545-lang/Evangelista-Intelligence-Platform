import { useState, useEffect, useCallback } from 'react';
import { FactorCard } from './FactorCard';
import { agentActions } from '../../lib/agentActions';

interface DetectedScopingParams {
  registros_estimados: number;
  fuentes_datos: number;
  nodo_critico: string | null;
  sucursales: number;
  [key: string]: any;
}

interface ScopingCalculatorProps {
  engagement: any;
  onUpdate: (updates: any) => Promise<void>;
  client?: any;
  saving?: boolean;
  autoDetected?: DetectedScopingParams | null;
}

const BASE_FEE = 35000;
const VIATICOS_COST = 15000;
const EXTRA_SOURCE_COST = 5000;
const LOG_MAX = 1000000;
const LOG_MIN = 1000;

function logScale(value: number): number {
  return Math.round(
    Math.pow(10, Math.log10(LOG_MIN) + (value / 100) * (Math.log10(LOG_MAX) - Math.log10(LOG_MIN)))
  );
}

function inverseLogScale(registros: number): number {
  if (registros <= LOG_MIN) return 0;
  if (registros >= LOG_MAX) return 100;
  return Math.round(
    ((Math.log10(registros) - Math.log10(LOG_MIN)) /
      (Math.log10(LOG_MAX) - Math.log10(LOG_MIN))) * 100
  );
}

function formatMXN(n: number): string {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function ScopingCalculator({
  engagement,
  onUpdate,
  client,
  saving,
  autoDetected,
}: ScopingCalculatorProps) {
  const [sucursales, setSucursales] = useState(engagement?.sucursales ?? client?.sucursales ?? 1);
  const [erps, setErps] = useState(engagement?.erps ?? client?.sistemas_erp ?? 1);
  const [registros, setRegistros] = useState(engagement?.registros_estimados ?? 10000);
  const [registroSlider, setRegistroSlider] = useState(
    inverseLogScale(engagement?.registros_estimados ?? 10000)
  );
  const [fuentes, setFuentes] = useState(engagement?.fuentes_datos ?? 1);
  const [nodoCritico, setNodoCritico] = useState(engagement?.nodo_critico ?? '');
  const [requiereViaticos, setRequiereViaticos] = useState(engagement?.requiere_viaticos ?? false);
  const [fuentesExtra, setFuentesExtra] = useState(engagement?.fuentes_extra ?? 0);

  // Apply auto-detected values when available (one-shot)
  useEffect(() => {
    if (!autoDetected) return;
    if (autoDetected.registros_estimados != null) handleRegistroNumber(autoDetected.registros_estimados);
    if (autoDetected.fuentes_datos != null) setFuentes(autoDetected.fuentes_datos);
    if (autoDetected.nodo_critico != null) setNodoCritico(autoDetected.nodo_critico);
    if (autoDetected.sucursales != null) setSucursales(autoDetected.sucursales);
  }, [autoDetected]);

  // Sync slider with number input for registros
  const handleRegistroNumber = (v: number) => {
    const clamped = Math.max(LOG_MIN, Math.min(LOG_MAX, v));
    setRegistros(clamped);
    setRegistroSlider(inverseLogScale(clamped));
  };

  const handleRegistroSlider = (v: number) => {
    const scaled = logScale(v);
    setRegistroSlider(v);
    setRegistros(scaled);
  };

  // Derived calculations
  const gamma = 1 + 0.5 * sucursales + 0.2 * erps;
  const alpha = Math.max(0, Math.log10(Math.max(registros, 1000)) - 4);
  const fuentesExtraForBeta = Math.max(0, fuentes - 1);
  const beta = Math.min(
    1,
    Math.max(0, fuentesExtraForBeta / Math.max(sucursales + erps, 1))
  );
  const alphaMultiplier = BASE_FEE * alpha;
  const betaMultiplier = BASE_FEE * beta;
  const viaticosCost = requiereViaticos ? VIATICOS_COST : 0;
  const extraSourcesCost = fuentesExtra * EXTRA_SOURCE_COST;
  const foundationFee =
    BASE_FEE + alphaMultiplier + viaticosCost + extraSourcesCost;

  const handleUpdate = useCallback(() => {
    onUpdate({
      registros_estimados: registros,
      fuentes_datos: fuentes,
      nodo_critico: nodoCritico,
      requiere_viaticos: requiereViaticos,
      factor_gamma: gamma,
      factor_alpha: alpha,
      factor_beta: beta,
      foundation_fee: foundationFee,
      sucursales,
      erps,
      fuentes_extra: fuentesExtra,
    });
  }, [
    registros,
    fuentes,
    nodoCritico,
    requiereViaticos,
    gamma,
    alpha,
    beta,
    foundationFee,
    sucursales,
    erps,
    fuentesExtra,
    onUpdate,
  ]);

  // Input style helper — dark theme
  const inputClass =
    'w-24 text-right text-sm font-mono bg-white/10 border border-white/[0.06] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-content-primary';
  const sliderClass =
    'flex-1 h-2 rounded-full appearance-none bg-white/10 cursor-pointer accent-primary-500';
  const labelClass =
    'block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1';

  return (
    <div className="bg-canvas-elevated rounded-2xl border border-white/[0.06] p-6 shadow-sm">
      <h2 className="text-xl font-bold text-content-primary mb-6 flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full bg-primary-500"></span>
        Scoping Calculator — Foundation
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Form inputs */}
        <div className="space-y-5">
          {/* Sucursales */}
          <div>
            <label className={labelClass}>Sucursales / Plantas</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={sucursales}
                onChange={(e) => setSucursales(Number(e.target.value))}
                className={sliderClass}
              />
              <input
                type="number"
                min={1}
                max={50}
                value={sucursales}
                onChange={(e) =>
                  setSucursales(
                    Math.max(1, Math.min(50, Number(e.target.value)))
                  )
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Sistemas ERP */}
          <div>
            <label className={labelClass}>Sistemas ERP</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={erps}
                onChange={(e) => setErps(Number(e.target.value))}
                className={sliderClass}
              />
              <input
                type="number"
                min={1}
                max={20}
                value={erps}
                onChange={(e) =>
                  setErps(Math.max(1, Math.min(20, Number(e.target.value))))
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Registros estimados (log scale) */}
          <div>
            <label className={labelClass}>Registros Estimados</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={registroSlider}
                onChange={(e) => handleRegistroSlider(Number(e.target.value))}
                className={sliderClass}
              />
              <input
                type="number"
                min={LOG_MIN}
                max={LOG_MAX}
                step={1000}
                value={registros}
                onChange={(e) => handleRegistroNumber(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Fuentes de datos */}
          <div>
            <label className={labelClass}>Fuentes de Datos</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={fuentes}
                onChange={(e) => setFuentes(Number(e.target.value))}
                className={sliderClass}
              />
              <input
                type="number"
                min={1}
                max={20}
                value={fuentes}
                onChange={(e) =>
                  setFuentes(Math.max(1, Math.min(20, Number(e.target.value))))
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Nodo critico */}
          <div>
            <label className={labelClass}>Nodo Critico</label>
            <input
              type="text"
              value={nodoCritico}
              onChange={(e) => setNodoCritico(e.target.value)}
              placeholder="e.g., SAP HANA, Oracle EBS..."
              className="w-full text-sm bg-white/10 border border-white/[0.06] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-content-primary placeholder-content-tertiary"
            />
          </div>

          {/* Viaticos */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requiereViaticos}
                onChange={(e) => setRequiereViaticos(e.target.checked)}
                className="w-4 h-4 rounded accent-primary-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-content-primary">
                Requiere viaticos
              </span>
            </label>
          </div>

          {/* Fuentes adicionales */}
          <div>
            <label className={labelClass}>Fuentes Adicionales</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={fuentesExtra}
                onChange={(e) => setFuentesExtra(Number(e.target.value))}
                className={sliderClass}
              />
              <input
                type="number"
                min={0}
                max={20}
                value={fuentesExtra}
                onChange={(e) =>
                  setFuentesExtra(
                    Math.max(0, Math.min(20, Number(e.target.value)))
                  )
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Factor cards */}
        <div className="grid grid-cols-2 gap-4 content-start">
          <FactorCard
            label="Gamma"
            value={gamma}
            threshold={0}
            isGreater={true}
            formula="gamma = 1 + 0.5*sucursales + 0.2*ERPs"
          />
          <FactorCard
            label="Alpha"
            value={alpha}
            threshold={1.0}
            isGreater={true}
            formula="alpha = log10(max(registros,1000)) - 4"
          />
          <FactorCard
            label="Beta"
            value={beta}
            threshold={0.7}
            isGreater={false}
            formula="beta = min(1, max(0, fuentesExtra / (sucursales + ERPs)))"
          />
          <FactorCard
            label="Foundation Fee"
            value={foundationFee}
            threshold={0}
            isGreater={true}
            formula="base + alpha*base + viaticos + extra*cost"
            unit=" MXN"
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div>
            <p className="text-content-secondary">Base Fee</p>
            <p className="font-mono font-bold text-content-primary">
              $ {formatMXN(BASE_FEE)}
            </p>
          </div>
          <div>
            <p className="text-content-secondary">x Alpha</p>
            <p className="font-mono font-bold text-content-primary">
              + $ {formatMXN(alphaMultiplier)}
            </p>
          </div>
          <div>
            <p className="text-content-secondary">Viaticos</p>
            <p className="font-mono font-bold text-content-primary">
              + $ {formatMXN(viaticosCost)}
            </p>
          </div>
          <div>
            <p className="text-content-secondary">Fuentes Extra</p>
            <p className="font-mono font-bold text-content-primary">
              + $ {formatMXN(extraSourcesCost)}
            </p>
          </div>
          <div className="bg-primary-500/10 rounded-lg px-3 py-2">
            <p className="text-primary-500 font-bold">TOTAL</p>
            <p className="font-mono font-bold text-primary-500 text-base">
              $ {formatMXN(foundationFee)}
            </p>
          </div>
        </div>
      </div>

      {/* Save button and AI Calculate */}
      <div className="mt-6 flex justify-between gap-4">
        <button
           onClick={async () => {
             const baseRes = await agentActions.calcularPricing({
                sucursales,
                sistemas_erp: erps,
                registros: registros,
                fuentes_manuales: fuentes,
                fuentes_rotas: fuentesExtra,
                fuentes_total: fuentes + fuentesExtra,
                requiere_viaticos: requiereViaticos
             });
             alert("Pricing Sugerido por IA (Ver Consola)\n\n" + baseRes.response.substring(0,200) + '...');
             console.log(baseRes.response);
           }}
           disabled={saving}
           className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          Pedir sugerencia IA
        </button>
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-primary-500 text-canvas hover:bg-primary-500/90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando...' : 'Guardar factores'}
        </button>
      </div>
    </div>
  );
}
