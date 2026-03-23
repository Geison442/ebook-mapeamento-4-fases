/* ═══════════════════════════════════════════════════════
   MAPEAMENTO DAS 4 FASES INTERNAS — APP.JS
   ═══════════════════════════════════════════════════════ */

'use strict';

// ── Service Worker ────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('[SW] Registrado:', reg.scope))
      .catch(err => console.warn('[SW] Falha:', err));
  });
}

// ── State ─────────────────────────────────────────────────
const state = {
  currentPhase: 'cover',  // 'cover' | 1 | 2 | 3 | 4
  readProgress: { 1: 0, 2: 0, 3: 0, 4: 0 },
  phaseScrollProgress: { 1: 0, 2: 0, 3: 0, 4: 0 },
};

// Restore from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem('4fases-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state.readProgress, parsed.readProgress || {});
      Object.assign(state.phaseScrollProgress, parsed.phaseScrollProgress || {});
    }
  } catch {}
}

function saveState() {
  try {
    localStorage.setItem('4fases-progress', JSON.stringify({
      readProgress: state.readProgress,
      phaseScrollProgress: state.phaseScrollProgress,
    }));
  } catch {}
}

// ── DOM Refs ──────────────────────────────────────────────
const progressBar   = document.getElementById('progress-bar');
const phaseSections = document.querySelectorAll('.phase-section');
const coverSection  = document.getElementById('cover');
const phaseNavBtns  = document.querySelectorAll('.phase-btn');
const installBanner = document.getElementById('install-banner');
const toast         = document.getElementById('toast');
const offlineBadge  = document.getElementById('offline-badge');

// ── Navigation ────────────────────────────────────────────
function showSection(target) {
  // target: 'cover' | 1 | 2 | 3 | 4
  coverSection.style.display = 'none';
  phaseSections.forEach(s => s.classList.remove('active'));

  if (target === 'cover') {
    coverSection.style.display = '';
    state.currentPhase = 'cover';
  } else {
    const phaseNum = parseInt(target);
    const section = document.getElementById(`phase-${phaseNum}`);
    if (section) {
      section.classList.add('active');
      state.currentPhase = phaseNum;
    }
  }

  // Update nav buttons
  phaseNavBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.phase == target);
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
  updateProgressBar();
  updateReadingProgressUI();
}

// ── Reading Progress (scroll-based) ──────────────────────
function updateProgressBar() {
  const phase = state.currentPhase;
  if (phase === 'cover') { progressBar.style.width = '0%'; return; }

  const section = document.getElementById(`phase-${phase}`);
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const sectionHeight = section.offsetHeight;
  const windowH = window.innerHeight;
  const scrolled = Math.max(0, -rect.top);
  const total = sectionHeight - windowH;
  const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 100;

  progressBar.style.width = pct + '%';

  // Save max progress for this phase
  if (pct > (state.phaseScrollProgress[phase] || 0)) {
    state.phaseScrollProgress[phase] = Math.round(pct);
    // Compute "read" as having scrolled >= 80%
    if (pct >= 80 && !state.readProgress[phase]) {
      state.readProgress[phase] = 1;
      showToast(`Fase ${phase} concluída! ✨`);
    }
    saveState();
    updateReadingProgressUI();
  }
}

function updateReadingProgressUI() {
  const items = document.querySelectorAll('.phase-progress-item');
  items.forEach(item => {
    const ph = item.dataset.phase;
    const pct = state.phaseScrollProgress[ph] || 0;
    const fill = item.querySelector('.pp-bar-fill');
    const label = item.querySelector('.pp-percent');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = pct + '%';
  });
}

// ── Collapsible Blocks ────────────────────────────────────
function initCollapsibles() {
  document.querySelectorAll('.content-block .block-header').forEach(header => {
    header.addEventListener('click', () => {
      const block = header.closest('.content-block');
      block.classList.toggle('collapsed');
    });
  });
}

// ── Wheel Interaction ─────────────────────────────────────
function initWheel() {
  document.querySelectorAll('.wheel-segment').forEach(seg => {
    seg.addEventListener('click', () => {
      const ph = seg.dataset.phase;
      if (ph) showSection(parseInt(ph));
    });
  });
}

// ── Phase Mini-Cards on Cover ─────────────────────────────
document.querySelectorAll('.phase-mini-card').forEach(card => {
  card.addEventListener('click', () => {
    showSection(parseInt(card.dataset.phase));
  });
});

// ── Phase Nav Buttons ─────────────────────────────────────
phaseNavBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.phase === 'cover' ? 'cover' : parseInt(btn.dataset.phase);
    showSection(target);
  });
});

// ── Bottom Nav Buttons ────────────────────────────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-go]');
  if (btn) {
    const target = btn.dataset.go;
    showSection(target === 'cover' ? 'cover' : parseInt(target));
  }
});

// ── Start Button ──────────────────────────────────────────
document.getElementById('start-btn')?.addEventListener('click', () => showSection(1));

// ── Scroll Listener ───────────────────────────────────────
window.addEventListener('scroll', updateProgressBar, { passive: true });

// ── PWA Install Prompt ────────────────────────────────────
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    if (!localStorage.getItem('4fases-install-dismissed')) {
      installBanner.classList.add('visible');
    }
  }, 3000);
});

document.getElementById('install-btn')?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    showToast('App instalado com sucesso! 🌙');
    installBanner.classList.remove('visible');
  }
  deferredPrompt = null;
});

document.getElementById('install-dismiss')?.addEventListener('click', () => {
  installBanner.classList.remove('visible');
  localStorage.setItem('4fases-install-dismissed', '1');
});

// ── Offline Detection ─────────────────────────────────────
function updateOnlineStatus() {
  if (!navigator.onLine) {
    offlineBadge.classList.add('visible');
  } else {
    offlineBadge.classList.remove('visible');
  }
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// ── Toast ─────────────────────────────────────────────────
let toastTimeout = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Init ──────────────────────────────────────────────────
loadState();
initCollapsibles();
initWheel();
updateReadingProgressUI();
showSection('cover');
