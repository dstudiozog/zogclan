/* ============================================
   ZoG CLAN WEBSITE — gallery.js
   Smart Auto-Loader: 0–100 multi-extension
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryTabs();
  loadAllGalleries();
  initModal();
});

/* ── Supported extensions in order of priority ── */
const EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp'];
const MAX_FILES   = 101; // 0 → 100

/* ── Gallery config ── */
const GALLERIES = [
  { id: 'clan',         path: 'gallery/clan/',         label: 'Clan Gallery' },
  { id: 'tournament',   path: 'gallery/tournament/',   label: 'Tournament' },
  { id: 'certificates', path: 'gallery/certificates/', label: 'Certificates' }
];

/* ── Track loaded images per gallery for modal nav ── */
const galleryImages = {
  clan:         [],
  tournament:   [],
  certificates: []
};

/* ────────────────────────────────────────────
   TABS
──────────────────────────────────────────── */
function initGalleryTabs() {
  const tabs  = document.querySelectorAll('.gallery-tab');
  const panes = document.querySelectorAll('.gallery-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t  => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const pane = document.querySelector(`.gallery-pane[data-pane="${target}"]`);
      if (pane) pane.classList.add('active');
    });
  });
}

/* ────────────────────────────────────────────
   LOAD ALL GALLERIES
──────────────────────────────────────────── */
function loadAllGalleries() {
  GALLERIES.forEach(g => {
    const container = document.getElementById(`gallery-${g.id}`);
    if (!container) return;
    loadGallery(g.id, g.path, container);
  });
}

async function loadGallery(id, basePath, container) {
  // Show loading state
  container.innerHTML = `
    <div class="gallery-loading">
      <div class="loading-spinner"></div>
      <span>Loading ${id} gallery...</span>
    </div>
  `;

  const found = [];

  // Try each index 0–100 with all extensions
  for (let i = 0; i < MAX_FILES; i++) {
    const src = await tryLoadImage(basePath, i);
    if (src) {
      found.push({ index: i, src });
    }
  }

  // Render
  container.innerHTML = '';

  if (found.length === 0) {
    container.innerHTML = buildEmptyState(id);
    updateTabBadge(id, 0);
    return;
  }

  galleryImages[id] = found;
  updateTabBadge(id, found.length);

  found.forEach((item, pos) => {
    const el = buildGalleryItem(item.src, item.index, id, pos);
    el.style.animationDelay = `${pos * 0.05}s`;
    container.appendChild(el);
  });
}

/* ── Try each extension for a given index ── */
function tryLoadImage(basePath, index) {
  return new Promise(resolve => {
    let tried = 0;

    function tryNext(extIdx) {
      if (extIdx >= EXTENSIONS.length) {
        resolve(null); // None found
        return;
      }

      const ext = EXTENSIONS[extIdx];
      const src = `${basePath}${index}.${ext}`;
      const img = new Image();

      img.onload = () => resolve(src);
      img.onerror = () => tryNext(extIdx + 1);

      img.src = src;
    }

    tryNext(0);
  });
}

/* ── Build gallery item element ── */
function buildGalleryItem(src, index, galleryId, pos) {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.dataset.galleryId  = galleryId;
  div.dataset.pos        = pos;

  div.innerHTML = `
    <img src="${src}" alt="Gallery ${galleryId} #${index}" loading="lazy">
    <div class="gallery-item-overlay">
      <span class="gallery-item-num">No. ${String(index).padStart(2, '0')}</span>
      <span class="gallery-item-zoom">⊕</span>
    </div>
  `;

  div.addEventListener('click', () => openModal(galleryId, pos));

  return div;
}

/* ── Empty state ── */
function buildEmptyState(id) {
  return `
    <div class="gallery-empty">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="#D4AF37" stroke-width="1.5"/>
        <circle cx="18" cy="20" r="4" stroke="#D4AF37" stroke-width="1.5"/>
        <path d="M6 30L16 22L22 28L30 20L42 30" stroke="#D4AF37" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      <p>No images yet — upload photos to <code>gallery/${id}/</code> named <code>0.jpg</code>, <code>1.png</code>, etc.</p>
    </div>
  `;
}

/* ── Update tab badge count ── */
function updateTabBadge(id, count) {
  const badge = document.getElementById(`badge-${id}`);
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

/* ────────────────────────────────────────────
   MODAL
──────────────────────────────────────────── */
let modalState = { galleryId: null, pos: 0 };

function initModal() {
  const modal    = document.getElementById('gallery-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const prevBtn  = document.getElementById('modal-prev');
  const nextBtn  = document.getElementById('modal-next');

  if (!modal) return;

  // Close
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Navigate
  if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')       closeModal();
    if (e.key === 'ArrowLeft')    navigateModal(-1);
    if (e.key === 'ArrowRight')   navigateModal(1);
  });

  // Touch swipe
  let touchStartX = 0;
  modal.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) navigateModal(delta < 0 ? 1 : -1);
  });
}

function openModal(galleryId, pos) {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;

  modalState = { galleryId, pos };
  renderModal();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function navigateModal(direction) {
  const images = galleryImages[modalState.galleryId];
  if (!images || images.length === 0) return;

  modalState.pos = (modalState.pos + direction + images.length) % images.length;
  renderModal();
}

function renderModal() {
  const images  = galleryImages[modalState.galleryId];
  if (!images) return;

  const item    = images[modalState.pos];
  const imgEl   = document.getElementById('modal-img');
  const counter = document.getElementById('modal-counter');

  if (imgEl)   imgEl.src = item.src;
  if (counter) counter.textContent = `${modalState.pos + 1} / ${images.length}`;
}
