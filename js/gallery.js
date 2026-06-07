/**
 * js/gallery.js
 * Gallery grid render + fully-accessible lightbox.
 * ✏️  Add photos to GALLERY_ITEMS below.
 */

'use strict';

/* ════════════════════════════════════════
   GALLERY DATA
   ✏️  Edit paths, captions, dates here.
   Photos → assets/images/gallery/
   Thumbs → assets/images/gallery/thumbs/ (optional, falls back to full)
════════════════════════════════════════ */
export const GALLERY_ITEMS = [
  { src: 'assets/images/gallery/01.jpg', thumb: 'assets/images/gallery/thumbs/01.jpg', caption: 'Hari Pertama X 1 TKJ',          date: 'Juli 2025' },
  { src: 'assets/images/gallery/02.jpg', thumb: 'assets/images/gallery/thumbs/02.jpg', caption: 'Praktikum Jaringan Komputer',     date: 'Agt 2025' },
  { src: 'assets/images/gallery/03.jpg', thumb: 'assets/images/gallery/thumbs/03.jpg', caption: 'Foto Bersama Wali Kelas',         date: 'Agt 2025' },
  { src: 'assets/images/gallery/04.jpg', thumb: 'assets/images/gallery/thumbs/04.jpg', caption: 'Upacara 17 Agustus',             date: 'Agt 2025' },
  { src: 'assets/images/gallery/05.jpg', thumb: 'assets/images/gallery/thumbs/05.jpg', caption: 'Kompetisi Antar Kelas',          date: 'Sep 2025' },
  { src: 'assets/images/gallery/06.jpg', thumb: 'assets/images/gallery/thumbs/06.jpg', caption: 'Study Tour TKJ',                 date: 'Okt 2025' },
  { src: 'assets/images/gallery/07.jpg', thumb: 'assets/images/gallery/thumbs/07.jpg', caption: 'Kunjungan Industri',             date: 'Okt 2025' },
  { src: 'assets/images/gallery/08.jpg', thumb: 'assets/images/gallery/thumbs/08.jpg', caption: 'Pentas Seni & Pekan Kreativitas', date: 'Nov 2025' },
  { src: 'assets/images/gallery/09.jpg', thumb: 'assets/images/gallery/thumbs/09.jpg', caption: 'Foto Akhir Semester',            date: 'Des 2025' },
];


/* ════════════════════════════════════════
   LIGHTBOX STATE
════════════════════════════════════════ */
let lb          = null;  // lightbox element
let lbImg       = null;
let lbCaption   = null;
let lbDate      = null;
let lbCounter   = null;
let lbLoader    = null;
let currentIdx  = 0;
let items       = GALLERY_ITEMS;
let lbOpen      = false;
let prevFocus   = null;  // for focus-restore on close


/* ════════════════════════════════════════
   BUILD LIGHTBOX (once, on first open)
════════════════════════════════════════ */
function buildLightbox() {
  if (document.getElementById('lightbox')) return;

  lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Lightbox foto galeri');
  lb.setAttribute('tabindex', '-1');

  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-inner">
      <button class="lb-close" aria-label="Tutup lightbox (Esc)">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="lb-prev" aria-label="Foto sebelumnya (←)">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lb-img-wrap">
        <img id="lb-img" src="" alt="" loading="eager" />
        <div class="lb-loader"></div>
      </div>
      <button class="lb-next" aria-label="Foto berikutnya (→)">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lb-caption">
        <p id="lb-cap"></p>
        <span id="lb-date"></span>
      </div>
      <div class="lb-counter" id="lb-counter"></div>
    </div>
  `;

  document.body.appendChild(lb);

  lbImg     = document.getElementById('lb-img');
  lbCaption = document.getElementById('lb-cap');
  lbDate    = document.getElementById('lb-date');
  lbCounter = document.getElementById('lb-counter');
  lbLoader  = lb.querySelector('.lb-loader');

  // Events
  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', () => navigate(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => navigate(1));

  // Keyboard
  document.addEventListener('keydown', onLbKey);

  // Swipe (touch)
  let touchX = 0;
  lb.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  }, { passive: true });
}


/* ════════════════════════════════════════
   LIGHTBOX CONTROLS
════════════════════════════════════════ */
export function openLightbox(idx, galleryItems = GALLERY_ITEMS) {
  buildLightbox();
  items      = galleryItems;
  currentIdx = idx;
  lbOpen     = true;
  prevFocus  = document.activeElement;

  lb.classList.add('open');
  document.body.classList.add('no-scroll');
  setSlide(currentIdx);

  // Defer focus to lightbox for accessibility
  requestAnimationFrame(() => lb.focus());
}

function closeLightbox() {
  lbOpen = false;
  lb?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  prevFocus?.focus();
}

function navigate(dir) {
  currentIdx = (currentIdx + dir + items.length) % items.length;
  setSlide(currentIdx);
}

function setSlide(idx) {
  const item = items[idx];
  if (!item || !lbImg) return;

  lbLoader?.classList.add('active');
  lbImg.style.opacity = '0';

  const fallbackSrc = item.thumb && item.thumb !== item.src ? item.thumb : null;
  const tmp = new Image();
  let triedFallback = false;

  tmp.onload = () => {
    lbImg.src          = tmp.src;
    lbImg.alt          = item.caption || '';
    lbImg.style.opacity = '1';
    lbLoader?.classList.remove('active');
  };

  tmp.onerror = () => {
    if (fallbackSrc && !triedFallback) {
      triedFallback = true;
      tmp.src = fallbackSrc;
      return;
    }

    lbLoader?.classList.remove('active');
    lbImg.removeAttribute('src');
    lbImg.alt = item.caption ? `Foto tidak tersedia: ${item.caption}` : 'Foto tidak tersedia';
    lbImg.style.opacity = '1';
  };

  tmp.src = item.src || item.thumb || '';

  if (lbCaption) lbCaption.textContent = item.caption || '';
  if (lbDate)    lbDate.textContent    = item.date    || '';
  if (lbCounter) lbCounter.textContent = `${idx + 1} / ${items.length}`;
}

function onLbKey(e) {
  if (!lbOpen) return;
  const map = { Escape: closeLightbox, ArrowLeft: () => navigate(-1), ArrowRight: () => navigate(1) };
  map[e.key]?.();
}


/* ════════════════════════════════════════
   GALLERY GRID RENDER
════════════════════════════════════════ */
export function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Use placeholder images if real ones haven't been added
  const displayItems = GALLERY_ITEMS.length
    ? GALLERY_ITEMS
    : generatePlaceholders(9);

  displayItems.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'gallery-card sr';
    card.style.setProperty('--i', i);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Buka foto: ${item.caption || `Foto ${i + 1}`}`);

    // Use picsum for placeholders
    const thumbSrc = item.thumb || item.src || `https://picsum.photos/seed/tkj${i}/600/450`;

    card.innerHTML = `
      <img
        src="${thumbSrc}"
        alt="${item.caption || `Galeri foto ${i + 1}`}"
        loading="lazy"
        decoding="async"
      />
      <div class="gallery-card-overlay">
        <p>${item.caption || ''}</p>
      </div>
    `;

    const img = card.querySelector('img');
    let triedFallback = false;
    const fallbackSrc = item.thumb && item.src && item.thumb !== item.src ? item.src : null;
    img?.addEventListener('error', () => {
      if (fallbackSrc && !triedFallback) {
        triedFallback = true;
        img.src = fallbackSrc;
        return;
      }

      img.style.opacity = '0';
      img.style.visibility = 'hidden';
    });

    card.addEventListener('click',   () => openLightbox(i, displayItems));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i, displayItems); } });

    grid.appendChild(card);
  });
}


/* ── Placeholder generator (used before real photos are added) ── */
function generatePlaceholders(count) {
  const captions = [
    'Hari Pertama Kelas', 'Praktikum TKJ', 'Foto Bersama',
    'Kegiatan Sekolah', 'Study Tour', 'Upacara',
    'Kompetisi Olahraga', 'Pentas Seni', 'Akhir Semester',
  ];
  return Array.from({ length: count }, (_, i) => ({
    src:     `https://picsum.photos/seed/x1tkj${i}/1200/900`,
    thumb:   `https://picsum.photos/seed/x1tkj${i}/600/450`,
    caption: captions[i] || `Foto ${i + 1}`,
    date:    '2025',
  }));
}
