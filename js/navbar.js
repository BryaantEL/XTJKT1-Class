/**
 * js/navbar.js
 * Theme, scroll, progress, back-to-top, mobile menu,
 * active nav highlighting, smooth scroll.
 */

'use strict';

const NAVBAR_H         = 66;
const SCROLL_TRIGGER   = 32;
const BACK_TOP_TRIGGER = 480;
const THEME_KEY        = 'x1tkj-theme';

const $ = id => document.getElementById(id);

/* ════════════════════════════════════════
   THEME
════════════════════════════════════════ */
export function initTheme() {
  const toggle = $('dark-toggle');

  function apply(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    toggle?.setAttribute('aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
    toggle?.setAttribute('title',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  const saved  = localStorage.getItem(THEME_KEY);
  const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved ?? (osDark ? 'dark' : 'light'));

  toggle?.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    apply(next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Sync with OS changes when no saved preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) apply(e.matches ? 'dark' : 'light');
  });
}


/* ════════════════════════════════════════
   SCROLL — navbar + progress + back-to-top
════════════════════════════════════════ */
export function initScroll() {
  const navbar      = $('navbar');
  const progressBar = $('progress-bar');
  const backToTop   = $('back-to-top');
  let   pending     = false;

  function tick() {
    const sy   = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    navbar?.classList.toggle('scrolled', sy > SCROLL_TRIGGER);
    backToTop?.classList.toggle('visible', sy > BACK_TOP_TRIGGER);
    if (progressBar && docH > 0) {
      progressBar.style.width = `${(sy / docH) * 100}%`;
    }
    pending = false;
  }

  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(tick); }
  }, { passive: true });

  tick(); // run once on init

  backToTop?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}


/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */
export function initMobileMenu() {
  const btn  = $('ham-btn');
  const menu = $('mobile-menu');
  let open   = false;

  function openMenu() {
    open = true;
    menu?.classList.add('open');
    btn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    open = false;
    menu?.classList.remove('open');
    btn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  btn?.addEventListener('click', () => open ? closeMenu() : openMenu());

  // Close on any nav-link tap
  menu?.querySelectorAll('.mobile-nav-link').forEach(l =>
    l.addEventListener('click', closeMenu)
  );

  // Close on outside click
  document.addEventListener('pointerdown', e => {
    if (open && !menu?.contains(e.target) && !btn?.contains(e.target)) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { closeMenu(); btn?.focus(); }
  });

  // Close on resize to desktop
  const mq = window.matchMedia('(min-width: 768px)');
  mq.addEventListener('change', e => { if (e.matches && open) closeMenu(); });
}


/* ════════════════════════════════════════
   ACTIVE NAV LINK
════════════════════════════════════════ */
export function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  function setActive(id) {
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
  }

  const io = new IntersectionObserver(entries => {
    // Pick the entry with the highest intersectionRatio
    const best = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (best) setActive(best.target.id);
  }, {
    rootMargin: `-${NAVBAR_H}px 0px -45% 0px`,
    threshold: [0, 0.1, 0.25, 0.5],
  });

  sections.forEach(s => io.observe(s));
}


/* ════════════════════════════════════════
   SMOOTH SCROLL  — anchor polyfill
   (Safari, Instagram in-app browser)
════════════════════════════════════════ */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
