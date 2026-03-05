// ===========================================
// STATE
// ===========================================
const STORAGE_PROJECT = 'framevibes-project-v1';
const STORAGE_NOTES = 'framevibes-notes-v1';
const STORAGE_COMPARE = 'framevibes-compare-v1';

const PROJECT_MAX = 30;
const COMPARE_MAX = 3;
const FEATURED_LIMIT = 6;

const SCENE_TEMPLATES = [
  {
    id: 'cold-open',
    name: 'Cold Open',
    scene: 'Opening',
    desc: 'Hook the viewer immediately. High contrast visuals, immediate tension, or striking beauty — before the title card drops.',
    criteria: v => v.energy === 'high' || v.mood === 'intense',
    filterHint: { energy: 'high' },
  },
  {
    id: 'world-establishment',
    name: 'First Light',
    scene: 'Opening',
    desc: 'Slow and atmospheric. Let the world breathe before the story starts. Wide shots, quiet sound beds.',
    criteria: v => v.energy === 'low' && (v.mood === 'calm' || v.mood === 'dreamy' || v.mood === 'warm' || v.mood === 'nostalgic'),
    filterHint: { energy: 'low' },
  },
  {
    id: 'tension-build',
    name: 'Slow Burn',
    scene: 'Rising Action',
    desc: 'Mounting unease. Every cut tightens the noose. Dark or suspenseful tones that force the viewer to lean in.',
    criteria: v => v.mood === 'suspenseful' || v.mood === 'dark',
    filterHint: { mood: 'suspenseful' },
  },
  {
    id: 'action-sequence',
    name: 'Full Throttle',
    scene: 'Climax',
    desc: 'Kinetic energy. Fast cuts, high BPM, visceral impact. No room to breathe — only momentum.',
    criteria: v => v.energy === 'high' && v.tempo === 'fast',
    filterHint: { energy: 'high', tempo: 'fast' },
  },
  {
    id: 'emotional-beat',
    name: 'The Quiet Part',
    scene: 'Falling Action',
    desc: 'Character vulnerability. Space for feeling over action. Warm, dreamy, or nostalgic moods that invite reflection.',
    criteria: v => v.mood === 'warm' || v.mood === 'nostalgic' || v.mood === 'dreamy',
    filterHint: { mood: 'warm' },
  },
  {
    id: 'night-scene',
    name: 'Night Scene',
    scene: 'Atmosphere',
    desc: 'Darkness as a character. Isolation, mystery, or danger lurking just beyond the frame.',
    criteria: v => v.mood === 'dark' || v.mood === 'eerie',
    filterHint: { mood: 'dark' },
  },
  {
    id: 'chase-sequence',
    name: 'The Chase',
    scene: 'Climax',
    desc: 'Relentless momentum. No pause, no mercy. Action-forward genre vibes with punishing tempo.',
    criteria: v => v.genre === 'action' || (v.energy === 'high' && v.tempo === 'fast'),
    filterHint: { genre: 'action' },
  },
  {
    id: 'final-frame',
    name: 'Final Frame',
    scene: 'Resolution',
    desc: 'The last image. Lingering and unresolved — or cathartic and complete. Low energy with emotional weight.',
    criteria: v => v.energy === 'low' || v.mood === 'nostalgic',
    filterHint: { energy: 'low' },
  },
];

let currentDetailId = null;
let projectIds = loadStoredArray(STORAGE_PROJECT);
let compareIds = loadStoredArray(STORAGE_COMPARE).slice(0, COMPARE_MAX);
let noteMap = loadStoredObject(STORAGE_NOTES);

function loadStoredArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadStoredObject(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persistState() {
  localStorage.setItem(STORAGE_PROJECT, JSON.stringify(projectIds));
  localStorage.setItem(STORAGE_COMPARE, JSON.stringify(compareIds));
  localStorage.setItem(STORAGE_NOTES, JSON.stringify(noteMap));
}

function findVibe(id) {
  return vibes.find(v => v.id === id);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>'"]/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[ch]));
}

function fallbackThumb(genre = 'cinematic', name = 'vibe') {
  const text = encodeURIComponent(`${name} • ${genre}`);
  return `https://placehold.co/1600x1000/111111/e8e0d0?text=${text}`;
}

function getLicenseInfo(item, type) {
  if (type === 'music') {
    const license = (item.license || '').toUpperCase();
    if (license.includes('CC0')) return { label: 'Commercial-safe', tone: 'good' };
    if (license.includes('CC BY-NC')) return { label: 'Non-commercial', tone: 'warn' };
    if (license.includes('CC BY')) return { label: 'Attribution needed', tone: 'neutral' };
    return { label: 'Check license', tone: 'warn' };
  }

  const source = (item.source || '').toLowerCase();
  if (source.includes('bbc')) return { label: 'Not for commercial use', tone: 'warn' };
  if (source.includes('zapsplat')) return { label: 'License varies by plan', tone: 'neutral' };
  if (source.includes('freesound')) return { label: 'Per-asset license check', tone: 'neutral' };
  return { label: 'Check source terms', tone: 'warn' };
}

function isCommercialSafeVibe(vibe) {
  const musicSafe = vibe.music.every(m => {
    const license = (m.license || '').toUpperCase();
    return license.includes('CC0') || license.includes('CC BY');
  });
  const sfxSafe = vibe.sfx.every(s => !(s.source || '').toLowerCase().includes('bbc'));
  return musicSafe && sfxSafe;
}

function getWhyThisWorks(vibe) {
  const pace = vibe.energy === 'high'
    ? 'High energy and faster tempo support rapid cutting and movement-heavy edits.'
    : vibe.energy === 'medium'
      ? 'Medium energy gives flexibility for dialogue and pacing transitions.'
      : 'Lower energy gives space for atmosphere, silence, and slow-burn tension.';
  const color = `The palette moves from deep shadow tones into controlled highlights, built for ${vibe.mood} storytelling with clear visual hierarchy.`;
  const sound = `${vibe.music[0]?.genre || 'Music'} with ${vibe.sfx[0]?.category || 'ambient'} effects reinforces the ${vibe.mood} mood without overcomplicating the sound bed.`;
  return `${pace} ${color} ${sound}`;
}

function getProjectVibes() {
  return projectIds.map(findVibe).filter(Boolean);
}

function getCompareVibes() {
  return compareIds.map(findVibe).filter(Boolean);
}

// ===========================================
// RENDER FUNCTIONS
// ===========================================
function createCard(vibe, options = {}) {
  const { compact = false } = options;
  const card = document.createElement('div');
  card.className = `vibe-card${compact ? ' vibe-card--compact' : ''}`;
  card.onclick = () => openDetail(vibe);

  const inProject = projectIds.includes(vibe.id);
  const inCompare = compareIds.includes(vibe.id);

  card.innerHTML = `
    <img class="vibe-card-img" src="${escapeHtml(vibe.image)}" alt="${escapeHtml(vibe.name)}" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(fallbackThumb(vibe.genre, vibe.name))}'"/>
    <div class="vibe-card-overlay">
      <div class="vibe-card-overlay-btn">Explore Vibe</div>
    </div>
    <div class="vibe-card-quick-actions">
      <button class="quick-action-btn ${inProject ? 'is-active' : ''}" data-action="project" data-id="${escapeHtml(vibe.id)}">${inProject ? 'Saved' : 'Save'}</button>
      <button class="quick-action-btn ${inCompare ? 'is-active' : ''}" data-action="compare" data-id="${escapeHtml(vibe.id)}">${inCompare ? 'Comparing' : 'Compare'}</button>
    </div>
    <div class="vibe-card-bottom">
      <div class="vibe-card-name">${escapeHtml(vibe.name.toUpperCase())}</div>
      <div class="vibe-card-tags">
        <span class="vibe-tag">${escapeHtml(vibe.genre)}</span>
        <span class="vibe-tag">${escapeHtml(vibe.mood)}</span>
        <span class="vibe-tag">${escapeHtml(vibe.energy)}</span>
        <span class="vibe-tag ${isCommercialSafeVibe(vibe) ? 'vibe-tag--good' : 'vibe-tag--warn'}">${isCommercialSafeVibe(vibe) ? 'commercial-safe' : 'check licenses'}</span>
      </div>
    </div>
    <div class="vibe-card-colors">
      ${vibe.colors.slice(0, 6).map(c => `<span style="background:${escapeHtml(c)}"></span>`).join('')}
    </div>
  `;

  card.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (btn.dataset.action === 'project') toggleProject(id);
      if (btn.dataset.action === 'compare') toggleCompare(id);
    });
  });

  return card;
}

function renderGrid(containerId, vibeList, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (!vibeList.length) {
    container.innerHTML = '<div class="empty-state">No vibes match this filter. Try loosening your include/exclude terms.</div>';
    return;
  }

  vibeList.forEach(v => container.appendChild(createCard(v, options)));
}

function renderWorkspaceStats() {
  const statsEl = document.getElementById('workspaceStats');
  if (!statsEl) return;

  const browseCount = document.getElementById('browseGrid')?.childElementCount || 0;
  const safeCount = vibes.filter(isCommercialSafeVibe).length;

  statsEl.innerHTML = `
    <div class="stat-pill">${projectIds.length} saved</div>
    <div class="stat-pill">${compareIds.length} in compare</div>
    <div class="stat-pill">${safeCount} commercial-safe vibes</div>
    <div class="stat-pill">${browseCount} current results</div>
  `;
}

function renderProjectViews() {
  const projectVibes = getProjectVibes();
  renderGrid('workspaceSavedGrid', projectVibes, { compact: true });
  renderGrid('workspacePageGrid', projectVibes);
}

function renderCompareDock() {
  const dock = document.getElementById('compareDock');
  const list = document.getElementById('compareChipList');
  const summary = document.getElementById('compareDockSummary');
  if (!dock || !list || !summary) return;

  const selected = getCompareVibes();
  dock.classList.toggle('is-open', selected.length > 0);

  summary.textContent = selected.length
    ? `${selected.length} of ${COMPARE_MAX} selected`
    : 'Pick up to 3 vibes to compare.';

  list.innerHTML = selected.map(v => `
    <button class="compare-chip" onclick="toggleCompare('${escapeHtml(v.id)}')">
      ${escapeHtml(v.name)}
      <span>×</span>
    </button>
  `).join('');
}

// ===========================================
// SCENE TEMPLATES
// ===========================================
function renderTemplates() {
  const container = document.getElementById('templatesGrid');
  if (!container) return;
  container.innerHTML = '';

  SCENE_TEMPLATES.forEach(tmpl => {
    const matched = vibes.filter(tmpl.criteria).slice(0, 4);
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `
      <div class="template-scene-badge">${escapeHtml(tmpl.scene)}</div>
      <div class="template-name">${escapeHtml(tmpl.name)}</div>
      <div class="template-desc">${escapeHtml(tmpl.desc)}</div>
      <div class="template-vibes">
        ${matched.map(v => `<img class="template-vibe-thumb" src="${escapeHtml(v.image)}" alt="${escapeHtml(v.name)}" title="${escapeHtml(v.name)}" loading="lazy"/>`).join('')}
        <span class="template-count">${matched.length} vibe${matched.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="template-actions">
        <button class="btn-ghost btn-ghost--small" onclick="browseTemplate('${escapeHtml(tmpl.id)}')">Browse These</button>
        ${matched.length ? `<button class="btn-primary btn-primary--small" onclick="saveTemplateToProject('${escapeHtml(tmpl.id)}')">Add All</button>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

function browseTemplate(tmplId) {
  const tmpl = SCENE_TEMPLATES.find(t => t.id === tmplId);
  if (!tmpl) return;
  ['filterGenre', 'filterMood', 'filterEnergy', 'filterTempo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 'all';
  });
  const inc = document.getElementById('filterInclude');
  const exc = document.getElementById('filterExclude');
  if (inc) inc.value = '';
  if (exc) exc.value = '';
  const h = tmpl.filterHint;
  if (h.genre) { const el = document.getElementById('filterGenre'); if (el) el.value = h.genre; }
  if (h.mood) { const el = document.getElementById('filterMood'); if (el) el.value = h.mood; }
  if (h.energy) { const el = document.getElementById('filterEnergy'); if (el) el.value = h.energy; }
  if (h.tempo) { const el = document.getElementById('filterTempo'); if (el) el.value = h.tempo; }
  navigate('browse');
  applyFilters();
}

function saveTemplateToProject(tmplId) {
  const tmpl = SCENE_TEMPLATES.find(t => t.id === tmplId);
  if (!tmpl) return;
  const matched = vibes.filter(tmpl.criteria);
  let added = 0;
  matched.forEach(v => {
    if (!projectIds.includes(v.id) && projectIds.length < PROJECT_MAX) {
      projectIds.unshift(v.id);
      added++;
    }
  });
  if (added > 0) {
    persistState();
    renderAll();
    showToast(`Added ${added} vibe${added !== 1 ? 's' : ''} to project`);
  } else {
    showToast('All vibes already in project');
  }
}

// ===========================================
// MOODBOARD
// ===========================================
function renderMoodboard() {
  const paletteEl = document.getElementById('moodboardPalette');
  const refsEl = document.getElementById('moodboardRefs');
  const emptyEl = document.getElementById('moodboardEmpty');
  const contentEl = document.getElementById('moodboardContent');
  if (!paletteEl || !refsEl) return;

  const projectVibes = getProjectVibes();
  const hasVibes = projectVibes.length > 0;
  if (emptyEl) emptyEl.style.display = hasVibes ? 'none' : 'block';
  if (contentEl) contentEl.style.display = hasVibes ? 'block' : 'none';
  if (!hasVibes) return;

  const allColors = [];
  projectVibes.forEach(v => v.colors.forEach(c => { if (!allColors.includes(c)) allColors.push(c); }));
  paletteEl.innerHTML = allColors.map(c => `
    <div class="moodboard-swatch" onclick="copyHex('${escapeHtml(c)}', this)" title="${escapeHtml(c)}">
      <div class="moodboard-swatch-color" style="background:${escapeHtml(c)}">
        <div class="swatch-copied">✓</div>
      </div>
      <span class="moodboard-swatch-hex">${escapeHtml(c)}</span>
    </div>
  `).join('');

  const allRefs = new Set();
  projectVibes.forEach(v => { allRefs.add(v.image); v.refs.forEach(r => allRefs.add(r)); });
  refsEl.innerHTML = [...allRefs].map(r => `
    <div class="moodboard-ref"><img src="${escapeHtml(r)}" alt="Visual reference" loading="lazy"/></div>
  `).join('');
}

function printMoodboard() {
  window.print();
}

function switchWorkspaceTab(tab) {
  document.getElementById('ws-panel-vibes').style.display = tab === 'vibes' ? 'block' : 'none';
  document.getElementById('ws-panel-moodboard').style.display = tab === 'moodboard' ? 'block' : 'none';
  document.getElementById('ws-tab-vibes').classList.toggle('active', tab === 'vibes');
  document.getElementById('ws-tab-moodboard').classList.toggle('active', tab === 'moodboard');
  if (tab === 'moodboard') renderMoodboard();
}

function renderAll() {
  renderGrid('vibesGrid', vibes.slice(0, FEATURED_LIMIT));
  applyFilters();
  renderProjectViews();
  renderCompareDock();
  renderWorkspaceStats();
  renderTemplates();
}

function initDynamicFilterOptions() {
  const genreSelect = document.getElementById('filterGenre');
  const moodSelect = document.getElementById('filterMood');
  const genreBar = document.querySelector('.genre-bar');
  if (!genreSelect || !moodSelect || !genreBar) return;

  const toLabel = v => v
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const genres = [...new Set(vibes.map(v => v.genre))].sort();
  const moods = [...new Set(vibes.map(v => v.mood))].sort();

  genreSelect.innerHTML = '<option value="all">All</option>' + genres
    .map(g => `<option value="${escapeHtml(g)}">${escapeHtml(toLabel(g))}</option>`)
    .join('');

  moodSelect.innerHTML = '<option value="all">All</option>' + moods
    .map(m => `<option value="${escapeHtml(m)}">${escapeHtml(toLabel(m))}</option>`)
    .join('');

  genreBar.innerHTML = '<button class="genre-pill active" onclick="filterByGenre(\'all\', this)">All</button>' + genres
    .map(g => `<button class="genre-pill" onclick="filterByGenre('${escapeHtml(g)}', this)">${escapeHtml(toLabel(g))}</button>`)
    .join('');
}

// ===========================================
// PROJECT & COMPARE
// ===========================================
function toggleProject(vibeId) {
  const idx = projectIds.indexOf(vibeId);
  if (idx !== -1) {
    projectIds.splice(idx, 1);
    showToast('Removed from project');
  } else {
    if (projectIds.length >= PROJECT_MAX) {
      showToast(`Project limit reached (${PROJECT_MAX})`);
      return;
    }
    projectIds.unshift(vibeId);
    showToast('Added to project');
  }

  persistState();
  renderAll();
  syncDetailButtons();
}

function toggleCompare(vibeId) {
  const idx = compareIds.indexOf(vibeId);
  if (idx !== -1) {
    compareIds.splice(idx, 1);
    showToast('Removed from compare');
  } else {
    if (compareIds.length >= COMPARE_MAX) {
      showToast(`Compare supports up to ${COMPARE_MAX}`);
      return;
    }
    compareIds.push(vibeId);
    showToast('Added to compare');
  }

  persistState();
  renderAll();
  syncDetailButtons();
}

function clearProject() {
  projectIds = [];
  persistState();
  renderAll();
  showToast('Workspace project cleared');
}

function clearCompare() {
  compareIds = [];
  persistState();
  renderAll();
  closeCompareView();
  showToast('Compare cleared');
}

function toggleProjectFromDetail() {
  if (!currentDetailId) return;
  toggleProject(currentDetailId);
}

function toggleCompareFromDetail() {
  if (!currentDetailId) return;
  toggleCompare(currentDetailId);
}

function syncDetailButtons() {
  const saveBtn = document.getElementById('detailSaveBtn');
  const compareBtn = document.getElementById('detailCompareBtn');
  if (!currentDetailId || !saveBtn || !compareBtn) return;

  const saved = projectIds.includes(currentDetailId);
  const compared = compareIds.includes(currentDetailId);

  saveBtn.textContent = saved ? 'Remove From Project' : 'Save To Project';
  saveBtn.classList.toggle('is-active', saved);

  compareBtn.textContent = compared ? 'Remove From Compare' : 'Add To Compare';
  compareBtn.classList.toggle('is-active', compared);
}

// ===========================================
// DETAIL MODAL
// ===========================================
function openDetail(vibe) {
  const overlay = document.getElementById('detailOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  currentDetailId = vibe.id;

  const detailImg = document.getElementById('detailImg');
  detailImg.src = vibe.image;
  detailImg.onerror = () => {
    detailImg.onerror = null;
    detailImg.src = fallbackThumb(vibe.genre, vibe.name);
  };
  document.getElementById('detailTitle').textContent = vibe.name.toUpperCase();

  const bar = document.getElementById('detailColorBar');
  bar.innerHTML = vibe.colors.map(c => `<span style="background:${escapeHtml(c)}"></span>`).join('');

  const tags = document.getElementById('detailTags');
  tags.innerHTML = `
    <span class="detail-tag active">${escapeHtml(vibe.genre)}</span>
    <span class="detail-tag active">${escapeHtml(vibe.mood)}</span>
    <span class="detail-tag">${escapeHtml(vibe.energy)} energy</span>
    <span class="detail-tag">${escapeHtml(vibe.tempoBpm)}</span>
    <span class="detail-tag">${isCommercialSafeVibe(vibe) ? 'commercial-safe pack' : 'license check required'}</span>
  `;

  document.getElementById('detailDescription').textContent = vibe.description;
  document.getElementById('detailWhyWorks').textContent = getWhyThisWorks(vibe);

  const noteInput = document.getElementById('detailNoteInput');
  noteInput.value = noteMap[vibe.id] || '';
  noteInput.oninput = () => {
    const value = noteInput.value.trim();
    if (value) noteMap[vibe.id] = value;
    else delete noteMap[vibe.id];
    persistState();
    renderProjectViews();
  };

  const swatches = document.getElementById('detailSwatches');
  swatches.innerHTML = vibe.colors.map(hex => `
    <div class="swatch" onclick="copyHex('${escapeHtml(hex)}', this)">
      <div class="swatch-color" style="background:${escapeHtml(hex)}">
        <div class="swatch-copied">✓</div>
      </div>
      <span class="swatch-hex">${escapeHtml(hex)}</span>
    </div>
  `).join('');

  const music = document.getElementById('detailMusic');
  music.innerHTML = vibe.music.map(m => {
    const info = getLicenseInfo(m, 'music');
    return `
      <div class="music-item">
        <div class="music-info">
          <div class="music-name">${escapeHtml(m.name)}</div>
          <div class="music-meta">${escapeHtml(m.artist)} · ${escapeHtml(m.genre)} · ${escapeHtml(String(m.bpm))} BPM</div>
          <div class="license-hint ${info.tone}">${escapeHtml(info.label)}</div>
        </div>
        <span class="music-license">${escapeHtml(m.license)}</span>
        <a href="${escapeHtml(m.url)}" target="_blank" rel="noopener noreferrer">
          <div class="play-btn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </a>
      </div>
    `;
  }).join('');

  const sfx = document.getElementById('detailSfx');
  sfx.innerHTML = vibe.sfx.map(s => {
    const info = getLicenseInfo(s, 'sfx');
    return `
      <div class="sfx-item">
        <div>
          <div class="sfx-name">${escapeHtml(s.name)}</div>
          <div class="sfx-cat">${escapeHtml(s.category)} · ${escapeHtml(s.source)}</div>
          <div class="license-hint ${info.tone}">${escapeHtml(info.label)}</div>
        </div>
        <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">
          <div class="sfx-play">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </a>
      </div>
    `;
  }).join('');

  const refs = document.getElementById('detailRefs');
  refs.innerHTML = vibe.refs.map(r => `
    <div class="ref-img"><img src="${escapeHtml(r)}" alt="Visual reference" loading="lazy"/></div>
  `).join('');

  const related = vibes
    .filter(v => v.id !== vibe.id && v.genre === vibe.genre)
    .slice(0, 3);
  if (related.length < 3) {
    const extra = vibes.filter(v => v.id !== vibe.id && v.mood === vibe.mood && !related.find(r => r.id === v.id));
    related.push(...extra.slice(0, 3 - related.length));
  }

  const relatedEl = document.getElementById('detailRelated');
  relatedEl.innerHTML = related.length
    ? related.map(v => `
      <div class="related-vibe-card" onclick="openDetail(vibes.find(x => x.id === '${escapeHtml(v.id)}'))">
        <img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.name)}" loading="lazy"/>
        <div class="related-vibe-card-label">
          <div class="related-vibe-card-name">${escapeHtml(v.name.toUpperCase())}</div>
        </div>
      </div>`).join('')
    : '<p style="font-size:13px;color:var(--muted);">No related vibes found.</p>';

  syncDetailButtons();
  overlay.scrollTop = 0;
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentDetailId = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('detailOverlay')) closeDetail();
}

// ===========================================
// COMPARE VIEW
// ===========================================
function openCompareView() {
  const vibesToCompare = getCompareVibes();
  if (vibesToCompare.length < 2) {
    showToast('Pick at least 2 vibes to compare');
    return;
  }

  const table = document.getElementById('compareTable');
  table.style.setProperty('--compare-cols', String(vibesToCompare.length));

  table.innerHTML = `
    <div class="compare-row compare-row--header">
      ${vibesToCompare.map(v => `<div class="compare-cell compare-cell--hero"><img src="${escapeHtml(v.image)}" alt="${escapeHtml(v.name)}"/><h4>${escapeHtml(v.name)}</h4></div>`).join('')}
    </div>
    <div class="compare-row">${vibesToCompare.map(v => `<div class="compare-cell"><strong>Genre:</strong> ${escapeHtml(v.genre)}<br/><strong>Mood:</strong> ${escapeHtml(v.mood)}<br/><strong>Energy:</strong> ${escapeHtml(v.energy)}</div>`).join('')}</div>
    <div class="compare-row">${vibesToCompare.map(v => `<div class="compare-cell"><strong>Tempo:</strong> ${escapeHtml(v.tempoBpm)}</div>`).join('')}</div>
    <div class="compare-row">${vibesToCompare.map(v => `<div class="compare-cell"><div class="compare-palette">${v.colors.map(c => `<span style="background:${escapeHtml(c)}"></span>`).join('')}</div></div>`).join('')}</div>
    <div class="compare-row">${vibesToCompare.map(v => `<div class="compare-cell"><strong>Music:</strong><br/>${escapeHtml(v.music.map(m => `${m.name} (${m.license})`).join(', '))}</div>`).join('')}</div>
    <div class="compare-row">${vibesToCompare.map(v => `<div class="compare-cell"><strong>SFX Sources:</strong><br/>${escapeHtml(v.sfx.map(s => s.source).join(', '))}</div>`).join('')}</div>
    <div class="compare-row">${vibesToCompare.map(v => `<div class="compare-cell"><strong>License:</strong> ${isCommercialSafeVibe(v) ? 'Commercial-safe' : 'Check asset licenses'}</div>`).join('')}</div>
    <div class="compare-row">${vibesToCompare.map(v => `<div class="compare-cell"><strong>Why it works:</strong><br/>${escapeHtml(getWhyThisWorks(v))}</div>`).join('')}</div>
  `;

  document.getElementById('compareOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCompareView() {
  document.getElementById('compareOverlay').classList.remove('open');
  if (!document.getElementById('detailOverlay').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function handleCompareOverlayClick(e) {
  if (e.target === document.getElementById('compareOverlay')) closeCompareView();
}

// ===========================================
// EXPORTS
// ===========================================
function triggerDownload(name, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildProjectMarkdown(list) {
  const lines = [
    '# FrameVibes Project Pack',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    '',
  ];

  list.forEach((vibe, index) => {
    lines.push(`## ${index + 1}. ${vibe.name}`);
    lines.push(`- Genre: ${vibe.genre}`);
    lines.push(`- Mood: ${vibe.mood}`);
    lines.push(`- Energy: ${vibe.energy}`);
    lines.push(`- Tempo: ${vibe.tempoBpm}`);
    lines.push(`- Commercial-safe: ${isCommercialSafeVibe(vibe) ? 'Likely yes' : 'Needs manual check'}`);
    lines.push(`- Colors: ${vibe.colors.join(', ')}`);
    if (noteMap[vibe.id]) lines.push(`- Project note: ${noteMap[vibe.id]}`);
    lines.push('- Music:');
    vibe.music.forEach(m => lines.push(`  - ${m.name} (${m.license}) -> ${m.url}`));
    lines.push('- SFX:');
    vibe.sfx.forEach(s => lines.push(`  - ${s.name} (${s.source}) -> ${s.url}`));
    lines.push('');
  });

  return lines.join('\n');
}

function exportProject() {
  const projectVibes = getProjectVibes();
  if (!projectVibes.length) {
    showToast('Save at least one vibe before exporting');
    return;
  }
  triggerDownload('framevibes-project.md', buildProjectMarkdown(projectVibes));
  showToast('Project markdown exported');
}

function exportCompare() {
  const compareVibes = getCompareVibes();
  if (compareVibes.length < 2) {
    showToast('Compare export needs at least 2 vibes');
    return;
  }
  triggerDownload('framevibes-compare.md', buildProjectMarkdown(compareVibes));
  showToast('Compare markdown exported');
}

// ===========================================
// COPY HEX
// ===========================================
function copyHex(hex, el) {
  const onSuccess = () => {
    el.classList.add('just-copied');
    showToast(`Copied ${hex}`);
    setTimeout(() => el.classList.remove('just-copied'), 1200);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(hex).then(onSuccess).catch(() => { fallbackCopy(hex); onSuccess(); });
  } else {
    fallbackCopy(hex);
    onSuccess();
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ===========================================
// NAVIGATION
// ===========================================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  window.scrollTo(0, 0);
  return false;
}

// ===========================================
// FILTERS
// ===========================================
function filterByGenre(genre, btn) {
  document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const filtered = genre === 'all' ? vibes : vibes.filter(v => v.genre === genre);
  renderGrid('vibesGrid', filtered.slice(0, FEATURED_LIMIT));
}

function applyFilters() {
  const genre = document.getElementById('filterGenre')?.value || 'all';
  const mood = document.getElementById('filterMood')?.value || 'all';
  const energy = document.getElementById('filterEnergy')?.value || 'all';
  const tempo = document.getElementById('filterTempo')?.value || 'all';

  const includeRaw = (document.getElementById('filterInclude')?.value || '').toLowerCase().trim();
  const excludeRaw = (document.getElementById('filterExclude')?.value || '').toLowerCase().trim();
  const commercialOnly = !!document.getElementById('filterCommercial')?.checked;

  const includeTerms = includeRaw ? includeRaw.split(/\s+/).filter(Boolean) : [];
  const excludeTerms = excludeRaw ? excludeRaw.split(/\s+/).filter(Boolean) : [];

  const filtered = vibes.filter(v => {
    const blob = [v.name, v.genre, v.mood, v.energy, v.tempo, v.description, v.emotion].join(' ').toLowerCase();

    return (genre === 'all' || v.genre === genre)
      && (mood === 'all' || v.mood === mood)
      && (energy === 'all' || v.energy === energy)
      && (tempo === 'all' || v.tempo === tempo)
      && (!commercialOnly || isCommercialSafeVibe(v))
      && includeTerms.every(term => blob.includes(term))
      && excludeTerms.every(term => !blob.includes(term));
  });

  renderGrid('browseGrid', filtered);
  renderWorkspaceStats();
}

// ===========================================
// SEARCH
// ===========================================
function handleSearch(e) {
  if (e.key !== 'Enter') return;
  const q = e.target.value.toLowerCase().trim();
  if (!q) return;

  const results = vibes.filter(v => {
    const note = (noteMap[v.id] || '').toLowerCase();
    return v.name.toLowerCase().includes(q)
      || v.genre.toLowerCase().includes(q)
      || v.mood.toLowerCase().includes(q)
      || v.emotion.toLowerCase().includes(q)
      || v.description.toLowerCase().includes(q)
      || note.includes(q);
  });

  document.getElementById('searchQueryDisplay').textContent = '"' + e.target.value + '"';
  document.getElementById('searchCountDisplay').textContent = results.length + ' vibe' + (results.length !== 1 ? 's' : '') + ' found';
  renderGrid('searchGrid', results);
  navigate('search');
}

// ===========================================
// EVENTS + INIT
// ===========================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCompareView();
    closeDetail();
  }
});

initDynamicFilterOptions();
renderAll();

(function heroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();
