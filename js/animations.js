/**
 * js/animations.js
 * Handles: scroll-reveal, hero parallax blobs.
 * CSS keyframes and entrance stagger live in css/animations.css.
 */

'use strict';

/* ════════════════════════════════════════
   SCROLL REVEAL
   Observes elements with class .sr / .sr-scale / .sr-left / .sr-right
   and adds .in when they enter viewport.
════════════════════════════════════════ */
export function initScrollReveal() {
  // Respect reduced-motion — reveal everything instantly
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.sr, .sr-scale, .sr-left, .sr-right')
      .forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -48px 0px',
  });

  document.querySelectorAll('.sr, .sr-scale, .sr-left, .sr-right')
    .forEach(el => observer.observe(el));
}


/* ════════════════════════════════════════
   HERO PARALLAX BLOBS
   Subtle mouse-tracking movement on hero background blobs.
   Only runs on fine-pointer (desktop) devices and respects
   reduced-motion preference.
════════════════════════════════════════ */
export function initHeroParallax() {
  if (!window.matchMedia('(pointer: fine)').matches)           return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero  = document.getElementById('hero');
  const blobs = hero?.querySelectorAll('.blob');
  if (!hero || !blobs?.length) return;

  // Parallax strength per blob layer (alternating directions)
  const FACTORS = [24, -15, 11, -19];

  let tx = 0, ty = 0; // lerp targets
  let cx = 0, cy = 0; // raw mouse offsets (-0.5 → 0.5)
  let rafId = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    tx = lerp(tx, cx, 0.055);
    ty = lerp(ty, cy, 0.055);

    blobs.forEach((blob, i) => {
      const f = FACTORS[i % FACTORS.length];
      blob.style.transform = `translate(${tx * f}px, ${ty * f}px)`;
    });

    rafId = requestAnimationFrame(tick);
  }

  function onMove(e) {
    const r = hero.getBoundingClientRect();
    cx = (e.clientX - r.left)  / r.width  - 0.5;
    cy = (e.clientY - r.top)   / r.height - 0.5;
  }

  function onLeave() { cx = 0; cy = 0; }

  hero.addEventListener('mousemove',  onMove,   { passive: true });
  hero.addEventListener('mouseleave', onLeave,  { passive: true });

  rafId = requestAnimationFrame(tick);

  // Cleanup on hero scroll out-of-view to save GPU
  const stopObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }, { threshold: 0 });

  stopObserver.observe(hero);
}


/* ════════════════════════════════════════
   STAGGER INDEX ASSIGNMENT
   Sets CSS --i variable on sr children so
   CSS animation delays work without JS loops.
════════════════════════════════════════ */
export function assignStaggerIndex(parentSelector) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    parent.querySelectorAll('.sr').forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });
}
