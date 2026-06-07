/**
 * js/main.js — Application boot
 * Imports and initialises every module in correct order.
 */

'use strict';

import {
  initTheme,
  initScroll,
  initMobileMenu,
  initActiveNav,
  initSmoothScroll,
} from './navbar.js';

import {
  initScrollReveal,
  initHeroParallax,
  assignStaggerIndex,
} from './animations.js';

import { initGallery } from './gallery.js';

import {
  renderStructure,
  renderMembers,
  renderMoments,
  renderBlog,
  renderQuoteBoard,
  initGuestbook,
  initInteractiveTabs,
} from './sections.js';

import QUOTES from '../data/quotes.js';


/* ── Hero quote widget ── */
function initHeroQuote() {
  const bodyEl = document.querySelector('.quote-body');
  const textEl = document.getElementById('qt');
  const authEl = document.getElementById('qa');
  const btn    = document.getElementById('quote-refresh');
  if (!textEl || !authEl || !QUOTES.length) return;

  const dailySeed = () => {
    const d = new Date();
    return (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate())
      % QUOTES.length;
  };

  let cur = dailySeed();

  const render = (idx, animate = false) => {
    const q = QUOTES[idx];
    if (!q) return;
    if (animate && bodyEl) {
      bodyEl.classList.add('fading');
      setTimeout(() => {
        textEl.textContent = `"${q.text}"`;
        authEl.textContent = `— ${q.author}`;
        bodyEl.classList.remove('fading');
      }, 340);
    } else {
      textEl.textContent = `"${q.text}"`;
      authEl.textContent = `— ${q.author}`;
    }
  };

  render(cur);
  btn?.addEventListener('click', () => { cur = (cur + 1) % QUOTES.length; render(cur, true); });
}


/* ── Assign CSS --i stagger vars after render ── */
function assignAllStaggerIndices() {
  const grids = [
    '#structure-grid',
    '#members-grid',
    '#gallery-grid',
    '#blog-grid',
    '#qboard-grid',
  ];
  grids.forEach(sel => assignStaggerIndex(sel));

  // Timeline items themselves carry sr class
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.setProperty('--i', i);
  });
}


/* ── Re-observe newly inserted .sr elements ── */
function reObserveSR() {
  // Schedule reveal initialization after all dynamic content is rendered.
  requestAnimationFrame(() => { initScrollReveal(); });
}


/* ── Boot ── */
function boot() {
  // 1. Core UI — must be first
  initTheme();
  initScroll();
  initMobileMenu();
  initActiveNav();
  initSmoothScroll();

  // 2. Animations — hero parallax before content
  initHeroParallax();

  // 3. Hero quote
  initHeroQuote();

  // 4. Render all data-driven sections
  renderStructure();
  renderMembers();
  renderMoments();
  renderBlog();
  renderQuoteBoard();
  initGuestbook();
  initInteractiveTabs();
  initGallery();

  // 5. Stagger indices + scroll-reveal after content is in DOM
  assignAllStaggerIndices();
  reObserveSR();
}


document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', boot)
  : boot();
