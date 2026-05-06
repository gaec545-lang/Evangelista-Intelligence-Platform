# Evangelista DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: Tailwind CSS 3.4.10 + React 18.3.1
> Colors: 20 · Fonts: 1 · Components: 101
> Icon library: Lucide · State: Zustand
> Primary theme: light · Dark mode toggle: no · Motion: expressive

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a neutral, approachable feel. The light background emphasizes content clarity. Typography uses **Lora** throughout — a clean, modern choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| eva-gold-light | `#fefaf0` | background | Page background, darkest surface |
| eva-olive-light | `#f0f4ec` | surface | Card and panel backgrounds |
| surface-card | `#ffffff` | surface | Card and panel backgrounds |
| eva-black | `#12120f` | text-primary | Headings and body text |
| text-muted | `#95b877` | text-muted | Captions, placeholders, secondary info |
| eva-black-3 | `#24241f` | border | Dividers, card borders, outlines |
| foundation | `#b04a30` | danger | Error states, destructive actions |
| sentinel | `#0d614d` | success | Success states, positive indicators |
| eva-beige-3 | `#e8e2d0` | warning | Warning states, caution indicators |
| architecture | `#4a42a3` | info | Informational highlights |
| eva-olive | `#3e4d32` | unknown | Palette color |
| eva-gold | `#b89a42` | unknown | Palette color |
| unknown | `#a1a1a6` | unknown | Palette color |
| eva-olive-2 | `#2d3824` | unknown | Palette color |
| eva-border-2 | `#d1cdc0` | unknown | Palette color |
| primary-800 | `#191f15` | unknown | Palette color |
| content-secondary | `#707060` | unknown | Palette color |
| eva-olive-3 | `#4f6140` | unknown | Palette color |
| eva-gold-2 | `#d4b762` | unknown | Palette color |
| primary-200 | `#c3d5b3` | unknown | Palette color |

### CSS Variable Tokens

```css
--eva-txt-muted: #707060;
--eva-border: #e1ddd1;
--eva-border-2: #d1cdc0;
```


---

## 3. Typography Rules

**Font Stack:**
- **Lora** — Heading 1, Heading 2, Heading 3, Body, Caption

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Lora | 48px / 3rem | 700 |
| Heading 2 | Lora | 32px / 2rem | 600 |
| Heading 3 | Lora | 24px / 1.5rem | 600 |
| Body | Lora | 16px / 1rem | 400 |
| Caption | Lora | 12px / 0.75rem | 400 |

**Typographic Rules:**
- Use **Lora** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (38)

**ServiceTag** — `src/components/ui/ServiceTag.tsx`
- Variants: `foundation`, `architecture`, `sentinel`, `gold`
- Props: `service`, `label`
- Key Styles: `rounded-full`, `px-2`, `font-mono`

```tsx
<span 
      className="inline-flex items-center px-2 py-0.5 rounded-full border font-mono text-[9px] font-semibold uppercase tracking-[0.06em]"
      style={{ 
        backgroundColor: style.bg, 
        color: style.text, 
        borderColor: style.border 
      }}
    >
      {label}
    </span>
```

**Panel** — `src/components/ui/Panel.tsx`
- Props: `title`, `service`, `serviceLabel`, `children`, `headerAction`
- Key Styles: `rounded-xl`, `border-eva-border`, `bg-white`, `px-4`, `text-sm`, `font-ui`, `shadow-sm`

```tsx
<div className="bg-white border border-eva-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-eva-border flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <h3 className="font-ui text-sm font-semibold text-eva-black">{title}</h3>
          {service && serviceLabel && (
            <ServiceTag service={service} label={serviceLabel} />
```

**DocumentDownloader** — `src/components/DocumentDownloader.tsx`
- Variants: `foundation`, `architecture`, `sentinel`
- Props: `template`, `label`, `data`, `accent`
- Key Styles: `rounded-lg`, `gap-2`, `text-sm`, `disabled:opacity-50`
- Animation: tw-animate-spin, tw-transitions: transition-all
- State: useState

```tsx
<button
      onClick={handleDownload}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${accentColors[accent]} disabled:opacity-50`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <FileText className="w-4 h-4" />
      <span>{label}</span>
    </button>
```

**AppLayout** — `src/components/layout/AppLayout.tsx`
- Key Styles: `bg-eva-beige`, `p-6`

```tsx
<div className="flex h-screen bg-eva-beige overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
```

**Sidebar** — `src/components/layout/Sidebar.tsx`
- Variants: `Consultor`
- Props: `isActive`
- Key Styles: `rounded-full`, `border-r`, `bg-eva-black-3`, `px-1.5`, `font-ui`, `opacity-60`, `group-hover:scale-110`
- Animation: tw-transitions: transition-all, duration-200, transition-transform, transition-colors, hover-transforms

```tsx
<NavLink 
      to={to} 
      className={({ isActive }
```

**HallazgoCard** — `src/components/foundation/HallazgoCard.tsx`
- Props: `hallazgo`, `onEdit`, `h`, `onDelete`, `id`
- Key Styles: `rounded`, `bg-primary-500/10`, `gap-3`, `text-xs`, `font-mono`, `hover:bg-white/[0.05]`
- Animation: tw-transitions: transition-colors
- State: useState

```tsx
<div className={`p-4 rounded-lg border ${crit.border} ${crit.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-content-secondary">
              {hallazgo.id}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${crit.color} ${crit.bg} border ${crit.border}`}>
              {hallazgo.criticidad}
            </span>
          </div>
          <p className="text-sm font-semibold text-content-primary mt-1">{hallazgo.nombre}</p>
```

**ScopingCalculator** — `src/components/foundation/ScopingCalculator.tsx`
- Props: `engagement`, `onUpdate`, `updates`, `client`, `saving`, `autoDetected`
- Key Styles: `rounded-2xl`, `border-white/[0.06]`, `bg-canvas-elevated`, `p-6`, `text-xl`, `font-bold`, `shadow-sm`, `focus:outline-none`
- Animation: tw-transitions: transition-all
- State: useState

```tsx
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
```

**CitaPipeline** — `src/components/foundation/CitaPipeline.tsx`
- Props: `engagement`, `onUpdate`, `updates`
- Key Styles: `rounded-xl`, `border-white/[0.06]`, `bg-canvas-elevated`, `space-y-4`, `text-sm`, `font-medium`, `hover:bg-primary-500/90`
- Animation: tw-transitions: transition-all, transition-colors
- State: useState

```tsx
<div className="space-y-4">
      <div className="rounded-xl border border-white/[0.06] bg-canvas-elevated p-4">
        <StatusStepper
          steps={steps.map(({ label, completed, active, date }
```

*...and 30 more layout components.*

### Navigation (18)

**AgentCard** — `src/components/AgentCard.tsx`
- Key Styles: `rounded-xl`, `bg-success/80`, `mb-4`, `text-sm`, `font-semibold`, `cursor-pointer`
- Animation: tw-animate-pulse-soft, tw-transitions: transition-transform, duration-200, transition-all, transition-colors, hover-transforms

```tsx
<Card
      index={index}
      className="group flex flex-col h-full cursor-pointer transition-transform duration-200"
      hover
      onClick={(
```

**Topbar** — `src/components/layout/Topbar.tsx`
- Key Styles: `rounded-full`, `border-eva-border`, `bg-white`, `px-6`, `font-ui`, `select-none`
- Animation: tw-transitions: transition-colors

```tsx
<header className="h-[52px] bg-white border-b border-eva-border flex items-center justify-between px-6 z-10 select-none">
      <div className="flex items-center h-full">
        <h2 className="font-ui text-[15px] font-semibold text-eva-black">
          {pageTitle}
        </h2>
        
        <div className="h-full border-r border-eva-border mx-5" />
        
        <nav className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-eva-txt-muted">evangelista</span>
          {pathnames.map((name, index
```

**AnalysisResult** — `src/components/AnalysisResult.tsx`
- Props: `response`, `confidence`, `sources`, `errors`, `executionTimeMs`
- Key Styles: `rounded-lg`, `border-red-500/20`, `bg-red-500/10`, `space-y-4`, `text-xs`, `font-medium`

```tsx
<div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <ConfidenceBadge value={confidence} />
        {executionTimeMs != null && <span className="text-xs text-[#A1A1A6]">{(executionTimeMs / 1000
```

**ProjectsTab** — `src/components/client/ProjectsTab.tsx`
- Props: `clientId`, `clientName`, `project`, `onClick`
- Key Styles: `rounded`, `border-eva-border`, `bg-white`, `p-5`, `text-lg`, `font-bold`, `shadow-card`, `cursor-pointer`
- Animation: framer-motion, tw-animate-in, tw-transitions: transition-all, transition-colors, duration-1000, transition-transform, duration-500
- State: useState

```tsx
<motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className="p-5 bg-white border border-eva-border hover:border-eva-olive/50 transition-all h-full flex flex-col shadow-card">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <div 
              className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold text-white w-fit"
              style={{ background: areaColor, opacity: 0.8 }}
            >
```

**NewProjectModal** — `src/components/client/NewProjectModal.tsx`
- Variants: `Consultor`
- Props: `open`, `onClose`, `clientId`, `clientName`
- Key Styles: `rounded-xl`, `border-white/10`, `bg-white/5`, `space-y-6`, `text-sm`, `font-medium`, `focus:ring-1`
- Animation: tw-transitions: transition-all
- State: useState

```tsx
<Modal open={open} onClose={onClose} title="Nuevo Proyecto">
      <div className="space-y-6">
        <p className="text-sm text-white/40">Iniciando nuevo engagement para <span className="text-cream font-medium">{clientName}</span></p>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-white/40 font-bold ml-1">Nombre del Proyecto *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value }
```

**ProposalTab** — `src/components/workspace/tabs/ProposalTab.tsx`
- Variants: `docx`, `Consultor`, `pdf`
- Props: `project`
- Key Styles: `rounded-xl`, `border-eva-olive/20`, `bg-eva-olive/10`, `gap-8`, `text-xl`, `font-serif`, `shadow-sm`, `cursor-pointer`
- Animation: tw-animate-in, tw-transitions: duration-700, transition-all, duration-300, transition-colors
- State: useState

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* PANEL IZQUIERDO: CALCULADORA */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-eva-olive/10 flex items-center justify-center border border-eva-olive/20 shadow-sm">
            <Calculator className="w-5 h-5 text-eva-olive" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-eva-black">Motor de Inversión</h3>
            <p className="text-xs text-eva-txt-muted font-medium">Cálculo algorítmico basado en Alcance (α
```

**AgentDetailPage** — `src/pages/AgentDetailPage.tsx`
- Key Styles: `rounded-2xl`, `border-surface-border`, `bg-success`, `gap-3`, `text-xs`, `font-semibold`, `hover:text-primary-600`
- Animation: framer-motion, animate: {opacity: 1, y: 0}, tw-animate-pulse-soft
- State: useState

```tsx
<div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-content-secondary">Cargando agente…</p>
      </div>
```

**ClientDetailPage** — `src/pages/ClientDetailPage.tsx`
- Variants: `info`, `proyectos`, `go`, `actividad`
- Props: `client_id`, `task`, `final_response`, `confidence`, `status`
- Key Styles: `rounded-full`, `border-eva-border`, `bg-red-50`, `space-y-1`, `text-xs`, `font-mono`, `shadow-sm`, `hover:text-eva-olive`
- Animation: tw-animate-fade-in, tw-transitions: transition-colors, transition-transform, transition-all, duration-200, hover-transforms
- State: useState

```tsx
<div className="space-y-1">
      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-eva-txt-faint">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-eva-txt-muted flex-shrink-0" />}
        <p className="text-[14px] font-ui text-eva-txt-dark font-medium">
          {value ?? <span className="text-eva-txt-faint italic font-normal">Sin registrar</span>}
        </p>
      </div>
    </div>
```

*...and 10 more navigation components.*

### Data Display (9)

**Card** — `src/components/ui/Card.tsx`
- Props: `children`, `className`, `hover`, `padding`, `onClick`, `index`
- Key Styles: `rounded-card`, `border-surface-border`, `bg-surface-card`, `shadow-card`
- Animation: framer-motion, transition: {duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.05}, animate: {opacity: 1, y: 0}

```tsx
<motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.05 
      }}
      onClick={onClick}
      className={`
        bg-surface-card rounded-card border border-surface-border shadow-card
        ${padding ? 'p-6' : ''}
```

**MetricCard** — `src/components/ui/MetricCard.tsx`
- Props: `label`, `value`, `subtitle`, `serviceColor`
- Key Styles: `rounded-xl`, `border-eva-border`, `bg-white`, `p-4`, `text-2xl`, `font-mono`, `shadow-sm`, `hover:shadow-card-hover`
- Animation: tw-transitions: transition-all, duration-200

```tsx
<div className="bg-white border border-eva-border rounded-xl p-4 relative overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-200">
      <div 
        className="absolute top-0 left-0 right-0 h-[3px]" 
        style={{ backgroundColor: serviceColor }} 
      />
      <p className="font-mono text-[10px] tracking-[0.10em] uppercase text-eva-txt-muted mb-2">
        {label}
      </p>
      <p className="font-ui text-2xl font-bold text-eva-black mb-1">
        {value}
      </p>
      {subtitle && (
```

**Badge** — `src/components/ui/Badge.tsx`
- Variants: `success`, `info`, `warning`, `danger`, `neutral`, `primary`, `olive`, `red`, `gray`, `xs`, `sm`, `md`, `custom`, `lg`
- Props: `children`, `variant`, `size`, `className`, `dot`
- Key Styles: `rounded-badge`, `gap-1.5`, `font-medium`, `opacity-80`
- Animation: tw-transitions: transition-all, duration-200

```tsx
<span className={`
      inline-flex items-center gap-1.5 rounded-badge font-medium tracking-wide uppercase
      transition-all duration-200
      ${baseCss}
      ${sizeMap[size]}
      ${className}
    `}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-80`}
          aria-hidden="true"
        />
```

**StatusStepper** — `src/components/foundation/StatusStepper.tsx`
- Props: `steps`
- Key Styles: `rounded-full`, `gap-0`, `text-xs`, `font-medium`
- Animation: tw-animate-pulse, tw-transitions: transition-all

```tsx
<div className="flex items-start gap-0">
      {steps.map((step, i
```

**DataUploadWizard** — `src/components/foundation/DataUploadWizard.tsx`
- Props: `clientId`, `engagementId`, `onDetected`, `params`, `onClose`
- Key Styles: `rounded-full`, `border-[rgba(255,255,255,0.08)]`, `bg-canvas`, `gap-2`, `text-xs`, `font-mono`, `backdrop-blur-sm`, `hover:bg-canvas`
- Animation: tw-animate-spin, tw-transitions: transition-colors
- State: useState

```tsx
<div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-canvas rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-mono text-content-secondary w-8 text-right">{pct}%</span>
      </div>
```

**GraphVisualizer** — `src/components/GraphVisualizer.tsx`
- Props: `mermaid`, `title`, `nodeHistory`, `className`
- Key Styles: `rounded-lg`, `border-[rgba(255,255,255,0.08)]`, `bg-black/60`, `p-4`, `text-sm`, `font-medium`, `backdrop-blur-sm`, `hover:text-white`
- Animation: tw-transitions: transition-opacity, duration-300
- State: useState, useRef

```tsx
<div className={`rounded-xl border border-surface-border bg-canvas-elevated overflow-hidden ${className || ''}`}>
      {title && (
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08
```

**ContractTab** — `src/components/workspace/tabs/ContractTab.tsx`
- Props: `project`
- Key Styles: `rounded-[2rem]`, `border-eva-border`, `bg-white`, `space-y-8`, `text-2xl`, `font-serif`, `shadow-sm`, `group-hover:border-eva-olive`
- Animation: tw-animate-in, tw-transitions: duration-700, transition-colors, duration-500, hover-transforms
- State: useState

```tsx
<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECCION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif text-eva-black">Gestión Contractual</h3>
          <p className="text-sm text-eva-txt-muted">Control legal, documentos de confidencialidad y flujo de pagos.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="bg-white">
             <ShieldCheck className="w-4 h-4 mr-2" />
             Vetting Status: OK
```

**FoundationPipelinePage** — `src/pages/FoundationPipelinePage.tsx`
- Variants: `pipeline`, `asc`, `table`, `desc`
- Props: `client_id`, `status`, `fuentes_datos`, `requiere_viaticos`, `hallazgos`
- Key Styles: `rounded-full`, `border-4`, `px-2.5`, `text-sm`, `font-bold`, `hover:bg-[#95B877]/90`
- Animation: tw-animate-spin, tw-transitions: transition-all, transition-colors, transition-opacity
- State: useState

```tsx
<span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border"
      style={{ backgroundColor: v.bg, color: v.text, borderColor: v.border }}
    >
      {label}
    </span>
```

*...and 1 more data display components.*

### Data Input (11)

**Input** — `src/components/ui/Input.tsx`
- Variants: `light`, `dark`
- Props: `label`, `error`, `helper`, `icon`, `iconTrailing`, `className`, `variant`
- Key Styles: `rounded-lg`, `gap-1.5`, `font-semibold`, `pointer-events-none`
- Animation: tw-transitions: transition-all, duration-200, transition-colors

```tsx
<div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className={`text-[12px] font-semibold px-0.5 font-ui ${isDark ? 'text-white/60' : 'text-eva-txt-mid'}`}>
          {label}
        </label>
```

**SearchBar** — `src/components/SearchBar.tsx`
- Props: `onSearch`, `query`, `agent`, `loading`, `agents`
- Key Styles: `rounded-button`, `gap-3`, `text-sm`, `font-semibold`, `group-focus-within:text-primary-500`
- Animation: tw-transitions: transition-colors
- State: useState

```tsx
<form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-stretch">
      {/* Query input */}
      <div className="flex-1 relative group">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-secondary/50 group-focus-within:text-primary-500 transition-colors pointer-events-none"
        />
        <input
          value={query}
          onChange={e => setQuery(e.target.value
```

**ClientForm** — `src/components/ClientForm.tsx`
- Variants: `id`, `created_at`, `light`, `updated_at`, `dark`
- Props: `initial`, `onSubmit`, `data`, `onCancel`
- Key Styles: `rounded-2xl`, `border-white/[0.08]`, `bg-[#0a0a0a]`, `space-y-6`, `text-2xl`, `font-mono`, `focus:outline-none`
- Animation: tw-transitions: transition-all, transition-colors
- State: useState

```tsx
<form onSubmit={handleSubmit} className="space-y-6">
      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Razón Social / Empresa *"
            placeholder="Ej. Textiles del Centro S.A."
            value={form.name}
            onChange={e => set('name', e.target.value
```

**SearchResults** — `src/components/SearchResults.tsx`
- Variants: `General`
- Key Styles: `rounded-lg`, `space-y-3`, `text-sm`, `font-semibold`, `group-hover:text-primary-500`
- Animation: framer-motion, transition: {delay: Math.min(i * 0.04, 0.25)}, animate: {opacity: 1, y: 0}

```tsx
<div className="space-y-3">
      {results.map((r, i
```

**ProposalForm** — `src/components/ProposalForm.tsx`
- Variants: `foundation`, `profesional`, `agresivo`, `conservador`, `architecture`, `conciliador`
- Props: `initialData`, `onGenerate`, `data`, `loading`
- Key Styles: `rounded-button`, `space-y-7`, `text-xs`, `font-semibold`, `opacity-70`
- Animation: framer-motion, tw-transitions: transition-all, duration-200
- State: useState

```tsx
<form onSubmit={e => { e.preventDefault(
```

**ClosureTab** — `src/components/workspace/tabs/ClosureTab.tsx`
- Props: `project`
- Key Styles: `rounded-2xl`, `border-service-sentinel/20`, `bg-service-sentinel/10`, `p-20`, `text-2xl`, `font-serif`, `shadow-sm`, `hover:bg-eva-beige-2/30`
- Animation: tw-animate-in, tw-transitions: duration-700, transition-all, hover-transforms
- State: useState

```tsx
<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-service-sentinel/10 flex items-center justify-center border border-service-sentinel/20 shadow-sm">
          <Trophy className="w-6 h-6 text-service-sentinel" />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-eva-black">Cierre de Proyecto</h3>
          <p className="text-sm text-eva-txt-muted">Formalización de entrega, evaluación de resultados y lecciones aprendidas.</p>
        </div>
      </div>
```

**NewWorkstreamModal** — `src/components/workspace/workstream/NewWorkstreamModal.tsx`
- Props: `projectId`, `onClose`, `onSuccess`
- Key Styles: `rounded-2xl`, `border-eva-border`, `bg-eva-black/40`, `p-4`, `text-xl`, `font-brand`, `backdrop-blur-sm`, `hover:text-eva-black`
- Animation: framer-motion, animate-presence, animate: {opacity: 1}
- State: useState

```tsx
<AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-eva-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-eva-border flex justify-between items-center bg-eva-beige/30">
```

**NewTaskModal** — `src/components/workspace/workstream/NewTaskModal.tsx`
- Props: `projectId`, `workstreamId`, `tasks`, `onClose`, `onSuccess`
- Key Styles: `rounded-2xl`, `border-eva-border`, `bg-eva-black/40`, `p-4`, `text-xl`, `font-brand`, `backdrop-blur-sm`, `hover:text-eva-black`
- Animation: framer-motion, animate-presence, animate: {opacity: 1}
- State: useState

```tsx
<AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-eva-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-eva-border flex justify-between items-center bg-eva-beige/30">
```

*...and 3 more data input components.*

### Feedback (2)

**EmptyState** — `src/components/ui/EmptyState.tsx`
- Props: `icon`, `title`, `description`, `action`, `className`
- Key Styles: `rounded-full`, `mb-5`, `text-base`, `font-semibold`
- Animation: framer-motion, transition: {duration: 0.35}, animate: {opacity: 1, y: 0}

```tsx
<motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center rounded-card ${className}`}
      style={{
        background: 'rgba(255,255,255,0.02
```

**Spinner** — `src/components/ui/Spinner.tsx`
- Variants: `sm`, `md`, `lg`
- Key Styles: `rounded-full`, `border-eva-border`
- Animation: tw-animate-spin

```tsx
<div className={`relative ${className}`}>
      <div className={`${sizes[size]} border-eva-border rounded-full`} />
      <div className={`absolute inset-0 ${sizes[size]} border-t-eva-olive rounded-full animate-spin`} />
    </div>
```

### Overlay (19)

**Button** — `src/components/ui/Button.tsx`
- Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `xs`, `sm`, `md`, `button`, `olive`, `lg`, `submit`
- Props: `children`, `onClick`, `variant`, `size`, `isLoading`, `disabled`, `className`, `icon` (+2 more)
- Key Styles: `rounded-lg`, `gap-2`, `font-ui`
- Animation: motion-variant: variants = {
    // Primary: Negro con texto beige. Hover: verde olivo.
    primary: 'bg-eva-black text-eva-beige hove, framer-motion, animate-presence

```tsx
<motion.button
      type={type}
      form={form}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-ui font-semibold
        transition-all duration-200 tracking-wide
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
```

**Modal** — `src/components/ui/Modal.tsx`
- Props: `open`, `isOpen`, `onClose`, `title`, `children`, `maxWidth`
- Key Styles: `rounded-lg`, `border-white/[0.08]`, `bg-black/50`, `p-4`, `text-lg`, `font-semibold`, `backdrop-blur-sm`, `hover:text-[#F5F5F7]`
- Animation: framer-motion, transition: {duration: 0.2}, animate-presence

**AnalysisHistory** — `src/components/AnalysisHistory.tsx`
- Variants: `success`, `warning`, `primary`, `danger`, `default`
- Key Styles: `rounded-card`, `border-r`, `p-4`, `text-sm`, `font-semibold`, `pointer-events-none`
- Animation: framer-motion, transition: {delay: Math.min(i * 0.03, 0.3)}, animate-presence
- State: useState

```tsx
<div className="rounded-card overflow-hidden animate-glass-enter"
      style={{ height: 'calc(100vh - 160px
```

**AnalysisResultV2** — `src/components/AnalysisResultV2.tsx`
- Variants: `success`, `warning`, `danger`
- Key Styles: `rounded-button`, `bg-success/80`, `space-y-6`, `text-xs`, `font-medium`, `hover:text-content-primary`
- Animation: framer-motion, transition: {duration: 0.25}, animate-presence
- State: useState

```tsx
<div className="space-y-6">
      {/* Metrics Row */}
      <div className="flex flex-wrap gap-3">
        <Badge
          variant={getConfidenceVariant(data.confidence
```

**AnalysisPanel** — `src/components/AnalysisPanel.tsx`
- Props: `clientId`, `onComplete`, `result`, `task`, `response`, `confidence`
- Key Styles: `rounded-[20px]`, `space-y-8`, `text-base`, `font-semibold`, `opacity-0`, `group-focus-within:opacity-100`
- Animation: framer-motion, transition: {repeat: Infinity, duration: 1.5, ease: 'linear'}, animate-presence
- State: useState

```tsx
<div className="space-y-8">
      {/* Input */}
      <div className="space-y-4">
        <div className="relative group">
          {/* Olive glow on focus */}
          <div
            className="absolute -inset-1 rounded-[20px] opacity-0 blur-xl transition-opacity duration-500 group-focus-within:opacity-100 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(149,184,119,0.10
```

**ScopingTab** — `src/components/workspace/tabs/ScopingTab.tsx`
- Variants: `grid`, `problema`, `causa_raiz`, `oportunidad`, `tree`, `riesgo`
- Props: `project`
- Key Styles: `rounded-lg`, `border-eva-olive/10`, `bg-eva-olive/5`, `space-y-8`, `text-xl`, `font-serif`, `shadow-sm`, `hover:bg-eva-olive-2`
- Animation: framer-motion, animate-presence, animate: {opacity: 1, y: 0}
- State: useState

```tsx
<div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL IZQUIERDO: NOTAS DE ENTREVISTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-eva-olive/5 flex items-center justify-center border border-eva-olive/10 shadow-sm">
                <FileText className="w-4 h-4 text-eva-olive" />
              </div>
              <h3 className="text-xl font-serif text-eva-black">Entrevistas</h3>
            </div>
```

**DataTab** — `src/components/workspace/tabs/DataTab.tsx`
- Variants: `Consultor`
- Props: `project`
- Key Styles: `rounded-2xl`, `border-2`, `bg-eva-olive`, `space-y-8`, `text-2xl`, `font-serif`, `shadow-md`, `hover:text-eva-olive`
- Animation: tw-animate-in, tw-animate-spin, tw-transitions: duration-700, transition-colors, transition-all, transition-transform
- State: useState

```tsx
<div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif text-eva-black">Fuentes de Datos</h3>
          <p className="text-sm text-eva-txt-muted font-medium">Gestión de conexiones seguras y bóveda de credenciales bajo protocolo ALCOA+.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={loadSources} className="text-eva-txt-faint hover:text-eva-olive transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="primary"
```

**AnalysisTab** — `src/components/workspace/tabs/AnalysisTab.tsx`
- Variants: `Consultor`
- Props: `project`
- Key Styles: `rounded-2xl`, `border-eva-olive/20`, `bg-eva-olive/10`, `space-y-8`, `text-2xl`, `font-serif`, `shadow-sm`
- Animation: tw-animate-in, tw-transitions: duration-700
- State: useState

```tsx
<div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER Y ACCIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-eva-olive/10 flex items-center justify-center border border-eva-olive/20 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-eva-olive" />
          </div>
          <div>
            <h3 className="text-2xl font-serif text-eva-black">Análisis Forense</h3>
            <p className="text-sm text-eva-txt-muted font-medium">Evidencia técnica cuantificada y trazabilidad ALCOA+.</p>
          </div>
```

*...and 11 more overlay components.*

### Typography (1)

**MarkdownRenderer** — `src/components/MarkdownRenderer.tsx`
- Props: `content`, `className`
- Key Styles: `rounded-lg`, `border-[rgba(255,255,255,0.08)]`, `bg-[#95B877]/5`, `mt-6`, `text-xl`, `font-serif`, `hover:text-[#A8C88A]`
- Animation: tw-transitions: transition-colors

```tsx
<div className={`markdown-body ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headers con estilo Evangelista
          h1: ({ children }
```

### Other (3)

**Counter** — `src/components/ui/Counter.tsx`
- Props: `target`, `duration`, `prefix`, `suffix`, `className`
- State: useState, useRef

**FactorCard** — `src/components/foundation/FactorCard.tsx`
- Props: `label`, `value`, `threshold`, `isGreater`, `formula`, `unit`
- Key Styles: `rounded-xl`, `border-2`, `mt-2`, `text-xs`, `font-bold`
- Animation: tw-transitions: transition-all

```tsx
<div className={`p-4 rounded-xl border-2 transition-all ${
      viable
        ? 'border-primary-500/30 bg-primary-500/5'
        : value !== null
          ? 'border-danger/30 bg-danger/5'
          : 'border-white/[0.06] bg-white/[0.02]'
    }`}>
      <p className="text-xs font-bold text-primary-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-2 text-content-primary">
        {value !== null ? `${value.toFixed(2
```

**ConfidenceBadge** — `src/components/ConfidenceBadge.tsx`
- Variants: `sm`, `success`, `warning`, `md`, `danger`
- Key Styles: `ml-1`, `opacity-60`

```tsx
<Badge variant={getVariant(
```



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32
- **Border radius:** 2px, 3px, 4px, 6px, 8px, 12px, 16px, 24px, 999px
- **Grid usage:** `grid-cols-1`, `grid-cols-2`, `col-span-2`, `grid-cols-4`, `grid-cols-12`
- **Container:** Tailwind `container` class with responsive padding

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Raised — cards, buttons, interactive elements

- **card:** `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)`
- `0 0 0 3px rgba(149,184,119,0.15)`

### Floating — dropdowns, popovers, modals

- **card-hover:** `0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)`
- **glass:** `0 2px 16px rgba(0,0,0,0.03)`

### Overlay — full-screen overlays, top-level dialogs

- **modal:** `0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### Framer Motion Patterns

```tsx
// Standard enter animation
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>

// List stagger
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
}
```

### CSS Animations

- `@keyframes fadeIn`
- `@keyframes animate-spin`
- `@keyframes animate-pulse-soft`
- `@keyframes animate-glass-enter`
- `@keyframes animate-pulse`
- `@keyframes animate-in`
- `@keyframes animate-bounce`
- `@keyframes animate-fade-in`

### Animated Components

- **Card**: framer-motion, transition: {duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.05}, animate: {opacity: 1, y: 0}
- **MetricCard**: tw-transitions: transition-all, duration-200
- **Badge**: tw-transitions: transition-all, duration-200
- **Button**: motion-variant: variants = {
    // Primary: Negro con texto beige. Hover: verde olivo.
    primary: 'bg-eva-black text-eva-beige hove, framer-motion, animate-presence
- **Modal**: framer-motion, transition: {duration: 0.2}, animate-presence

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#fefaf0` as the primary page background
- Use **Lora** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 2px, 3px, 4px, 6px, 8px
- Reuse existing components from Section 4 before creating new ones
- Use **Lucide** for all icons

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use Lora consistently
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use gradients — the design uses solid colors only
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't mix icon libraries — consistency matters

### Anti-Patterns (detected from codebase)

- No gradient backgrounds
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| sm | 640px | tailwind |
| md | 768px | tailwind |
| lg | 1024px | tailwind |
| xl | 1280px | tailwind |
| 2xl | 1536px | tailwind |

**Approach:** Mobile-first using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
Always design for mobile first, then layer on responsive overrides.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f0f4ec
Border: 1px solid #24241f
Radius: 8px
Padding: 16px
Font: Lora
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border #24241f
Padding: 8px 16px
Radius: 8px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #fefaf0
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f0f4ec
Label: #95b877 (muted, 12px, uppercase)
Value: #12120f (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #fefaf0
Input border: 1px solid #24241f
Focus: border-color var(--accent)
Label: #95b877 12px
Spacing: 16px between fields
Radius: 8px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Lora, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```
