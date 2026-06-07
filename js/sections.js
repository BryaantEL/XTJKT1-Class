/**
 * js/sections.js — Renders §2 Structure, §3 Members,
 *                  §5 Moments, §6 Blog/Quotes/Guestbook
 * ✏️  Edit MOMENTS and BLOG_POSTS constants below.
 */

'use strict';

import CLASS_STRUCTURE from '../data/structure.js';
import STUDENTS        from '../data/students.js';
import QUOTES          from '../data/quotes.js';

/* ── Shared SVG: Instagram icon ── */
const IG_ICON = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;

/* ── Safe HTML escape ── */
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');


/* ════════════════════════════════════════
   §2  CLASS STRUCTURE
════════════════════════════════════════ */
export function renderStructure() {
  const grid = document.getElementById('structure-grid');
  if (!grid) return;

  const frag = document.createDocumentFragment();

  CLASS_STRUCTURE.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = `structure-card sr${m.id === 'ketua' ? ' structure-card--ketua' : ''}`;
    card.style.setProperty('--i', i);
    card.setAttribute('aria-label', `${esc(m.role)}: ${esc(m.name)}`);

    const hasPhoto = m.photo && !m.photo.includes('placeholder');
    const photoHTML = hasPhoto
      ? `<img src="${esc(m.photo)}" alt="Foto ${esc(m.name)}"
             class="sc-photo" loading="lazy" decoding="async"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <div class="sc-photo-placeholder" style="display:none;" aria-hidden="true">${m.icon}</div>`
      : `<div class="sc-photo-placeholder" aria-hidden="true">${m.icon}</div>`;

    const igHandle = m.instagram?.replace('@', '') || '';
    const igHTML = igHandle
      ? `<a href="https://instagram.com/${esc(igHandle)}"
            target="_blank" rel="noopener noreferrer"
            class="sc-ig" aria-label="Instagram ${esc(m.instagram)}">
           ${IG_ICON} ${esc(m.instagram)}
         </a>`
      : '';

    card.innerHTML = `
      <div class="sc-icon-wrap" style="background:${m.iconBg}" aria-hidden="true">${m.icon}</div>
      <div class="sc-photo-wrap">${photoHTML}</div>
      <p class="sc-role">${esc(m.role)}</p>
      <p class="sc-name">${esc(m.name)}</p>
      <p class="sc-absen">Absen #${m.absen}</p>
      ${igHTML}
    `;
    frag.appendChild(card);
  });

  grid.appendChild(frag);
}


/* ════════════════════════════════════════
   §3  CLASS MEMBERS
════════════════════════════════════════ */
export function renderMembers() {
  const grid        = document.getElementById('members-grid');
  const searchInput = document.getElementById('members-search-input');
  const countEl     = document.getElementById('members-count');
  if (!grid) return;

  const frag = document.createDocumentFragment();

  STUDENTS.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'member-card sr';
    card.style.setProperty('--i', i);
    card.dataset.name = s.name.toLowerCase();
    card.dataset.nick = (s.nickname || '').toLowerCase();

    const hasPhoto = s.photo && !s.photo.includes('placeholder');
    const photoHTML = hasPhoto
      ? `<img src="${esc(s.photo)}" alt="Foto ${esc(s.name)}"
             class="mc-photo" loading="lazy" decoding="async"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <div class="mc-photo-placeholder" style="display:none;" aria-hidden="true">👤</div>`
      : `<div class="mc-photo-placeholder" aria-hidden="true">👤</div>`;

    const igHandle = s.instagram?.replace('@', '') || '';
    const igHTML = igHandle
      ? `<a href="https://instagram.com/${esc(igHandle)}"
            target="_blank" rel="noopener noreferrer"
            class="sc-ig" style="margin-top:6px;font-size:10px;"
            aria-label="Instagram ${esc(s.instagram)}">
           ${IG_ICON} ${esc(s.instagram)}
         </a>`
      : '';

    card.innerHTML = `
      <div class="mc-absen-badge" aria-label="Nomor absen ${s.absen}">${s.absen}</div>
      ${photoHTML}
      <p class="mc-name">${esc(s.name)}</p>
      ${s.quote ? `<p class="mc-quote">"${esc(s.quote)}"</p>` : ''}
      ${igHTML}
    `;
    frag.appendChild(card);
  });

  grid.appendChild(frag);
  if (countEl) countEl.textContent = `${STUDENTS.length} anggota`;

  // Live search/filter
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    let visible = 0;
    grid.querySelectorAll('.member-card').forEach(card => {
      const match = !q
        || card.dataset.name.includes(q)
        || card.dataset.nick.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (countEl) {
      countEl.textContent = q
        ? `${visible} dari ${STUDENTS.length} anggota`
        : `${STUDENTS.length} anggota`;
    }
  });
}


/* ════════════════════════════════════════
   §5  CLASS MOMENTS
   ✏️  Edit MOMENTS to add/change timeline items.
════════════════════════════════════════ */
const MOMENTS = [
  {
    date: 'Juli 2025', emoji: '🏫',
    title: 'Hari Pertama Masuk Kelas',
    desc:  'Hari pertama penuh semangat dan perkenalan. X 1 TKJ resmi memulai perjalanan satu tahun ajaran bersama.',
    tags:  ['MOS', 'Perkenalan'],
    photo: 'assets/images/moments/01-masuk.jpg',
  },
  {
    date: 'Agustus 2025', emoji: '🎌',
    title: 'Upacara 17 Agustus',
    desc:  'Seluruh siswa X 1 TKJ mengikuti upacara memperingati HUT RI ke-80 dengan penuh khidmat dan kebanggaan.',
    tags:  ['Upacara', 'HUT RI'],
    photo: 'assets/images/moments/02-upacara.jpg',
  },
  {
    date: 'Agustus 2025', emoji: '💻',
    title: 'Praktikum Jaringan Komputer',
    desc:  'Praktikum perdana di laboratorium. Belajar merakit kabel UTP, crimping, dan konfigurasi switch dasar.',
    tags:  ['Praktikum', 'TKJ', 'Jaringan'],
    photo: 'assets/images/moments/03-praktikum.jpg',
  },
  {
    date: 'September 2025', emoji: '⚽',
    title: 'Kompetisi Olahraga Antar Kelas',
    desc:  'Tim X 1 TKJ unjuk gigi di turnamen futsal dan voli. Semangat juang yang tinggi jadi kebanggaan kelas.',
    tags:  ['Olahraga', 'Kompetisi'],
    photo: 'assets/images/moments/04-olahraga.jpg',
  },
  {
    date: 'Oktober 2025', emoji: '🚌',
    title: 'Study Tour ke Semarang',
    desc:  'Kunjungan industri ke perusahaan IT di Semarang. Membuka wawasan tentang dunia kerja nyata di bidang TKJ.',
    tags:  ['Study Tour', 'Industri'],
    photo: 'assets/images/moments/05-studytour.jpg',
  },
  {
    date: 'November 2025', emoji: '🎨',
    title: 'Pentas Seni & Pekan Kreativitas',
    desc:  'X 1 TKJ tampil memukau di pentas seni sekolah. Dari pameran teknologi hingga pertunjukan seni kreatif.',
    tags:  ['Pentas Seni', 'Kreativitas'],
    photo: 'assets/images/moments/06-pentas.jpg',
  },
];

export function renderMoments() {
  const container = document.getElementById('moments-timeline');
  if (!container) return;

  const frag = document.createDocumentFragment();

  MOMENTS.forEach((m, i) => {
    const item = document.createElement('div');
    item.className = 'timeline-item sr';
    item.style.setProperty('--i', i);

    const tagsHTML = m.tags.map(t => `<span class="ti-tag">${esc(t)}</span>`).join('');

    item.innerHTML = `
      <div class="ti-content">
        <p class="ti-date">${esc(m.date)}</p>
        <h3 class="ti-title">${esc(m.title)}</h3>
        <p class="ti-desc">${esc(m.desc)}</p>
        <div class="ti-tags">${tagsHTML}</div>
        <div style="overflow:hidden;border-radius:var(--rad-lg);">
          <img src="${esc(m.photo)}" alt="${esc(m.title)}"
               class="ti-photo" loading="lazy" decoding="async"
               onerror="this.parentElement.style.display='none';" />
        </div>
      </div>
      <div class="ti-dot" aria-hidden="true">${m.emoji}</div>
      <div class="ti-spacer"></div>
    `;
    frag.appendChild(item);
  });

  container.appendChild(frag);
}


/* ════════════════════════════════════════
   §6  BLOG
   ✏️  Edit BLOG_POSTS to add entries.
════════════════════════════════════════ */
const BLOG_POSTS = [
  {
    emoji: '🖥️', tag: 'Teknologi',
    title: 'Mengenal Dasar Jaringan Komputer',
    excerpt: 'Jaringan komputer adalah fondasi dari dunia digital. Dari LAN hingga internet, pelajari cara perangkat saling berkomunikasi.',
    author: 'Tim X 1 TKJ', date: '10 Agt 2025', readTime: '3 min',
  },
  {
    emoji: '🔧', tag: 'Praktikum',
    title: 'Cara Crimping Kabel UTP yang Benar',
    excerpt: 'Crimping bukan sekadar menekan kabel ke konektor. Ada urutan warna, teknik, dan cara testing agar jaringan tetap stabil.',
    author: 'Tim X 1 TKJ', date: '18 Agt 2025', readTime: '5 min',
  },
  {
    emoji: '🌐', tag: 'Tips',
    title: '5 Tools Gratis Wajib Pelajar TKJ',
    excerpt: 'Dari Packet Tracer hingga Wireshark — tools gratis yang membuat belajar jaringan jauh lebih mudah dan menyenangkan.',
    author: 'Tim X 1 TKJ', date: '2 Sep 2025', readTime: '4 min',
  },
];

export function renderBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const frag = document.createDocumentFragment();

  BLOG_POSTS.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'blog-card sr';
    card.style.setProperty('--i', i);

    card.innerHTML = `
      <div class="blog-card-cover" aria-hidden="true">${p.emoji}</div>
      <div class="blog-card-body">
        <p class="blog-card-tag">${esc(p.tag)}</p>
        <h3 class="blog-card-title">${esc(p.title)}</h3>
        <p class="blog-card-excerpt">${esc(p.excerpt)}</p>
        <div class="blog-card-meta">
          <span>${esc(p.author)}</span>
          <span>${esc(p.date)} · ${esc(p.readTime)} baca</span>
        </div>
      </div>
    `;
    frag.appendChild(card);
  });

  grid.appendChild(frag);
}


/* ════════════════════════════════════════
   §6  QUOTE BOARD
════════════════════════════════════════ */
export function renderQuoteBoard() {
  const grid = document.getElementById('qboard-grid');
  if (!grid) return;

  const frag = document.createDocumentFragment();
  QUOTES.slice(0, 6).forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'qboard-card sr';
    card.style.setProperty('--i', i);
    card.innerHTML = `
      <p class="qboard-text">"${esc(q.text)}"</p>
      <p class="qboard-author">— ${esc(q.author)}</p>
    `;
    frag.appendChild(card);
  });

  grid.appendChild(frag);
}


/* ════════════════════════════════════════
   §6  GUESTBOOK
════════════════════════════════════════ */
const SAMPLE_ENTRIES = [
  { name: 'Anonim ✨',             time: '2 hari lalu',  message: 'Kelas X 1 TKJ keren banget! Semangat terus ya, kalian pasti bisa jadi developer atau network engineer hebat!' },
  { name: 'Alumni SMKN 1 Tuntang', time: '5 hari lalu',  message: 'Senang lihat kelas TKJ makin maju. Nikmati masa sekolah, itu waktu yang paling berharga!' },
  { name: 'Pengunjung 🌟',         time: '1 minggu lalu', message: 'Website kalian keren! Desainnya aesthetic banget, pasti ada yang berbakat di bidang web dev nih 😄' },
];

function createEntryEl(entry) {
  const el = document.createElement('div');
  el.className = 'gb-entry';
  const initial = (entry.name || '?').charAt(0).toUpperCase();
  el.innerHTML = `
    <div class="gb-avatar" aria-hidden="true">${esc(initial)}</div>
    <div class="gb-body">
      <div class="gb-header">
        <span class="gb-name">${esc(entry.name)}</span>
        <span class="gb-time">${esc(entry.time)}</span>
      </div>
      <p class="gb-message">${esc(entry.message)}</p>
    </div>
  `;
  return el;
}

function loadGuestbookEntries() {
  const raw = localStorage.getItem('x1tkj-gb');
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Guestbook localStorage entry is corrupted. Resetting stored data.', error);
    localStorage.removeItem('x1tkj-gb');
    return [];
  }
}

export function initGuestbook() {
  const list    = document.getElementById('gb-list');
  const form    = document.getElementById('gb-form');
  const nameEl  = document.getElementById('gb-name');
  const msgEl   = document.getElementById('gb-msg');
  const anonBtn = document.getElementById('gb-anon-btn');
  if (!list) return;

  // Render: stored user entries first, then samples
  const stored = loadGuestbookEntries();
  const frag   = document.createDocumentFragment();
  [...stored.slice().reverse(), ...SAMPLE_ENTRIES]
    .forEach(e => frag.appendChild(createEntryEl(e)));
  list.appendChild(frag);

  // Anon toggle
  let isAnon = false;
  anonBtn?.addEventListener('click', () => {
    isAnon = !isAnon;
    anonBtn.classList.toggle('on', isAnon);
    if (nameEl) {
      nameEl.disabled    = isAnon;
      nameEl.placeholder = isAnon ? 'Dikirim sebagai anonim' : 'Nama kamu';
      if (isAnon) nameEl.value = '';
    }
  });

  // Submit
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = isAnon ? 'Anonim ✨' : (nameEl?.value.trim() || 'Anonim ✨');
    const msg  = msgEl?.value.trim();
    if (!msg) { msgEl?.focus(); return; }

    const entry = { name, message: msg, time: 'Baru saja' };
    const newEntry = list.insertBefore(createEntryEl(entry), list.firstChild);
    if (newEntry) {
      newEntry.classList.add('gb-entry-new');
      window.setTimeout(() => newEntry.classList.remove('gb-entry-new'), 900);
    }

    // Persist (cap at 50)
    const saved = loadGuestbookEntries();
    saved.push(entry);
    localStorage.setItem('x1tkj-gb', JSON.stringify(saved.slice(-50)));

    form.reset();
    if (nameEl) { nameEl.disabled = false; nameEl.placeholder = 'Nama kamu'; }
    isAnon = false;
    anonBtn?.classList.remove('on');

    // Scroll to new entry smoothly
    list.firstChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}


/* ════════════════════════════════════════
   §6  INTERACTIVE TABS
════════════════════════════════════════ */
export function initInteractiveTabs() {
  const btns   = document.querySelectorAll('.itab-btn');
  const panels = document.querySelectorAll('.itab-panel');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });
}
