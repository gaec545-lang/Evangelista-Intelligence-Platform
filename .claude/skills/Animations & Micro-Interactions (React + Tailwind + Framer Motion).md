# SKILL.md — Animations & Micro-Interactions (React + Tailwind + Framer Motion)

## Purpose
This skill teaches Claude Code how to implement animations that make an interface feel alive and responsive without being distracting. The goal is "Apple-level polish" — every transition is intentional, every movement communicates meaning, and nothing moves just because it can.

## When to Use
Activate this skill for any React project where the visual quality of the interface is a business differentiator. Particularly important for demos, client-facing dashboards, and products where first impressions matter.

## Dependencies
- **Tailwind CSS 3+** with custom animation keyframes (see elite-frontend-design skill)
- **Framer Motion 11+** (install: `npm install framer-motion`) — use for complex animations, layout transitions, and gesture-based interactions
- **CSS transitions** — use for simple hover/focus/active states (don't import Framer Motion for a hover effect)

## Decision Rule: CSS vs Framer Motion
Use CSS transitions/animations when: hover effects, focus states, color changes, simple opacity fades, loading skeletons.
Use Framer Motion when: enter/exit animations, layout changes, staggered lists, drag interactions, scroll-triggered reveals, shared layout animations between routes.

---

## Page Transition Pattern

Every page change should feel smooth, not jarring. Wrap your route content with AnimatePresence.

```jsx
// In App.tsx or your layout wrapper
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
};

// Wrap each page component
export function DashboardPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* page content */}
    </motion.div>
  );
}
```

---

## Staggered List Entry

When a list of cards or items appears (documents, steps, deadlines), they should cascade in — not all appear at once.

```jsx
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06, // 60ms between each child
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export function DocumentList({ documents }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-3"
    >
      {documents.map((doc) => (
        <motion.div key={doc.id} variants={itemVariants}>
          <DocumentCard document={doc} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Stagger Timing Rules
- **3-5 items:** 80ms stagger (feels deliberate)
- **6-10 items:** 60ms stagger (fast enough to not feel slow)
- **10+ items:** 40ms stagger, and only animate the first 8 visible — the rest appear instantly
- **Never exceed 120ms stagger** — feels like the app is broken/slow

---

## Progress Stepper Animation

The stepper is the hero component of this interface. It needs to feel dynamic.

```jsx
// Each step node transitions when status changes
// Completed: scale pulse + color fill from left to right
// Current: gentle breathing pulse
// The connecting line between steps fills progressively

const StepNode = ({ status, index }) => {
  return (
    <motion.div
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center border-2 relative',
        status === 'completed' && 'bg-primary-600 border-primary-600 text-white',
        status === 'current' && 'bg-white border-primary-500 text-primary-600',
        status === 'pending' && 'bg-white border-gray-200 text-gray-400',
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        ...(status === 'current' && {
          boxShadow: [
            '0 0 0 0 rgba(0, 102, 204, 0)',
            '0 0 0 6px rgba(0, 102, 204, 0.15)',
            '0 0 0 0 rgba(0, 102, 204, 0)',
          ],
        }),
      }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ...(status === 'current' && {
          boxShadow: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }),
      }}
    >
      {status === 'completed' ? (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Check size={16} strokeWidth={3} />
        </motion.div>
      ) : (
        <span className="text-xs font-semibold">{index + 1}</span>
      )}
    </motion.div>
  );
};

// The connecting line between steps fills progressively
const StepConnector = ({ filled, index }) => (
  <div className="flex-1 h-0.5 mx-1 bg-gray-200 rounded-full overflow-hidden">
    <motion.div
      className="h-full bg-primary-500 rounded-full"
      initial={{ width: '0%' }}
      animate={{ width: filled ? '100%' : '0%' }}
      transition={{ delay: index * 0.05 + 0.15, duration: 0.4, ease: 'easeOut' }}
    />
  </div>
);
```

---

## Card Hover Interactions

Cards should respond to hover with subtle elevation and optional border highlight.

```jsx
// CSS-only approach (preferred for simple cards)
<div className="group bg-white rounded-card border border-surface-border p-6
                shadow-card hover:shadow-card-hover hover:border-primary-200
                transition-all duration-200 cursor-pointer">
  {/* Optional: icon that shifts on hover */}
  <ChevronRight className="w-4 h-4 text-content-tertiary
                           group-hover:text-primary-500
                           group-hover:translate-x-0.5
                           transition-all duration-200" />
</div>

// Framer Motion approach (for cards with layout animations or complex states)
<motion.div
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.99 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className="bg-white rounded-card border border-surface-border p-6 cursor-pointer"
>
  {/* content */}
</motion.div>
```

### Hover Rules
- **y offset on hover:** -2px maximum. -4px feels like the card is jumping off the screen.
- **Scale on tap/click:** 0.98-0.99. Never below 0.97 — it looks like a UI glitch.
- **Color transitions:** 150ms for borders and text, 200ms for shadows and backgrounds.
- **Never animate width or height on hover** — it shifts the layout and feels broken.

---

## Number Counter Animation

For KPIs, stats, and progress percentages — numbers should count up, not appear instantly.

```jsx
import { useEffect, useState, useRef } from 'react';

function useCountUp(target: number, duration = 600) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    rafId.current = requestAnimationFrame(animate);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [target, duration]);

  return count;
}

// Usage
function StepCounter({ current, total }) {
  const animatedCurrent = useCountUp(current);
  return (
    <p className="text-3xl font-semibold text-content-primary">
      <span className="text-primary-600">{animatedCurrent}</span>
      <span className="text-content-tertiary text-xl"> / {total}</span>
    </p>
  );
}
```

---

## Progress Bar Animation

```jsx
function ProgressBar({ percentage, color = 'primary' }) {
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-${color}-500`}
        initial={{ width: '0%' }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}
```

---

## Toast / Alert Entry Animation

```jsx
const toastVariants = {
  initial: { opacity: 0, y: -12, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

// Alert banner that slides down from top of card
const alertVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', transition: { duration: 0.25 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};
```

---

## PDF Generation Feedback

When the user clicks "Generate PDF", provide immediate visual feedback — don't leave them wondering if the click registered.

```jsx
function GeneratePDFButton({ onGenerate }) {
  const [state, setState] = useState('idle'); // idle | generating | done

  const handleClick = async () => {
    setState('generating');
    await onGenerate();
    setState('done');
    setTimeout(() => setState('idle'), 2000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={state === 'generating'}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-medium',
        'transition-colors duration-150',
        state === 'idle' && 'bg-primary-600 text-white hover:bg-primary-700',
        state === 'generating' && 'bg-primary-400 text-white cursor-wait',
        state === 'done' && 'bg-success text-white',
      )}
      whileTap={state === 'idle' ? { scale: 0.98 } : {}}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex items-center gap-2">
            <FileDown size={16} />
            Generar PDF
          </motion.span>
        )}
        {state === 'generating' && (
          <motion.span key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Generando...
          </motion.span>
        )}
        {state === 'done' && (
          <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                       className="flex items-center gap-2">
            <CheckCircle size={16} />
            Descargado
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
```

---

## Scroll-Triggered Reveal

For sections below the fold that should animate in as the user scrolls.

```jsx
import { useInView } from 'framer-motion';

function RevealOnScroll({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

## Skeleton Loading States

Never show a spinner. Show the shape of the content that's about to appear.

```jsx
function SkeletonCard() {
  return (
    <div className="bg-white rounded-card border border-surface-border p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-2.5">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

// Match the skeleton shape to the real component it replaces
// A stat card skeleton should have a small rectangle (label) and a large rectangle (number)
// A document card skeleton should have an icon circle + two text lines + a badge rectangle
```

---

## Animation Performance Rules

1. **Only animate `transform` and `opacity`.** Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, or `border`. These trigger layout recalculation and cause jank.
2. **Use `will-change: transform` sparingly** — only on elements that actually animate. Adding it everywhere hurts performance.
3. **Keep durations under 400ms for UI interactions.** 200-300ms is the sweet spot. Longer feels sluggish. Exception: progress bars and counters can take 600-800ms because they communicate data, not state change.
4. **Use `transform: translateZ(0)` or Tailwind's `transform-gpu`** to force GPU acceleration on frequently animated elements.
5. **Disable animations for `prefers-reduced-motion`.** Wrap animated components:
```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Pass transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
```
6. **Never animate more than 12 elements simultaneously.** If a page has 20 cards, stagger the first 8 and instant-show the rest.

---

## Timing Cheat Sheet

| Interaction | Duration | Easing | Tool |
|---|---|---|---|
| Hover color change | 150ms | ease | CSS transition |
| Hover shadow/elevation | 200ms | ease-out | CSS transition |
| Button tap/click | 100ms | ease-out | Framer Motion whileTap |
| Card enter (staggered) | 300ms | easeOut | Framer Motion variants |
| Page transition | 250ms | easeOut | Framer Motion AnimatePresence |
| Progress bar fill | 800ms | [0.25, 0.46, 0.45, 0.94] | Framer Motion |
| Number count-up | 600ms | easeOutQuart | Custom hook |
| Toast appear | 200ms | spring(400, 25) | Framer Motion |
| Toast dismiss | 150ms | ease-in | Framer Motion |
| Dropdown open | 200ms | easeOut | Framer Motion |
| Modal overlay | 200ms | ease | CSS transition |
| Modal content | 250ms | spring(400, 30) | Framer Motion |
