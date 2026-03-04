// ===========================================
// RENDER FUNCTIONS
// ===========================================

function createCard(vibe) {
  const card = document.createElement('div');
  card.className = 'vibe-card';
  card.onclick = () => openDetail(vibe);
  card.innerHTML = `
    <img class="vibe-card-img" src="${vibe.image}" alt="${vibe.name}" loading="lazy"/>
    <div class="vibe-card-overlay">
      <div class="vibe-card-overlay-btn">Explore Vibe</div>
    </div>
    <div class="vibe-card-bottom">
      <div class="vibe-card-name">${vibe.name.toUpperCase()}</div>
      <div class="vibe-card-tags">
        <span class="vibe-tag">${vibe.genre}</span>
        <span class="vibe-tag">${vibe.mood}</span>
        <span class="vibe-tag">${vibe.energy}</span>
      </div>
    </div>
    <div class="vibe-card-colors">
      ${vibe.colors.slice(0,6).map(c => `<span style="background:${c}"></span>`).join('')}
    </div>
  `;
  return card;
}

function renderGrid(containerId, vibeList) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  vibeList.forEach(v => container.appendChild(createCard(v)));
}

function renderAll() {
  renderGrid('vibesGrid', vibes);
  renderGrid('browseGrid', vibes);
}

// ===========================================
// DETAIL MODAL
// ===========================================

function openDetail(vibe) {
  const overlay = document.getElementById('detailOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('detailImg').src = vibe.image;
  document.getElementById('detailTitle').textContent = vibe.name.toUpperCase();

  // Color bar
  const bar = document.getElementById('detailColorBar');
  bar.innerHTML = vibe.colors.map(c => `<span style="background:${c}"></span>`).join('');

  // Tags
  const tags = document.getElementById('detailTags');
  tags.innerHTML = `
    <span class="detail-tag active">${vibe.genre}</span>
    <span class="detail-tag active">${vibe.mood}</span>
    <span class="detail-tag">${vibe.energy} energy</span>
    <span class="detail-tag">${vibe.tempoBpm}</span>
    <span class="detail-tag" style="font-style:italic; color:var(--text-dim);">${vibe.emotion}</span>
  `;

  // Description
  document.getElementById('detailDescription').textContent = vibe.description;

  // Swatches
  const swatches = document.getElementById('detailSwatches');
  swatches.innerHTML = vibe.colors.map(hex => `
    <div class="swatch" onclick="copyHex('${hex}', this)">
      <div class="swatch-color" style="background:${hex}">
        <div class="swatch-copied">✓</div>
      </div>
      <span class="swatch-hex">${hex}</span>
    </div>
  `).join('');

  // Music
  const music = document.getElementById('detailMusic');
  music.innerHTML = vibe.music.map(m => `
    <div class="music-item">
      <div class="music-info">
        <div class="music-name">${m.name}</div>
        <div class="music-meta">${m.artist} · ${m.genre} · ${m.bpm} BPM</div>
      </div>
      <span class="music-license">${m.license}</span>
      <a href="${m.url}" target="_blank">
        <div class="play-btn">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </a>
    </div>
  `).join('');

  // SFX
  const sfx = document.getElementById('detailSfx');
  sfx.innerHTML = vibe.sfx.map(s => `
    <div class="sfx-item">
      <div>
        <div class="sfx-name">${s.name}</div>
        <div class="sfx-cat">${s.category} · ${s.source}</div>
      </div>
      <a href="${s.url}" target="_blank">
        <div class="sfx-play">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </a>
    </div>
  `).join('');

  // Refs
  const refs = document.getElementById('detailRefs');
  refs.innerHTML = vibe.refs.map(r => `
    <div class="ref-img"><img src="${r}" alt="Visual reference" loading="lazy"/></div>
  `).join('');

  // Related vibes — same genre first, fallback to same mood
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
      <div class="related-vibe-card" onclick="openDetail(vibes.find(x => x.id === '${v.id}'))">
        <img src="${v.image}" alt="${v.name}" loading="lazy"/>
        <div class="related-vibe-card-label">
          <div class="related-vibe-card-name">${v.name.toUpperCase()}</div>
        </div>
      </div>`).join('')
    : '<p style="font-size:13px;color:var(--muted);">No related vibes found.</p>';

  // Scroll modal to top on open
  overlay.scrollTop = 0;
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('detailOverlay')) closeDetail();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

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
    fallbackCopy(hex); onSuccess();
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
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ===========================================
// NAVIGATION
// ===========================================
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  window.scrollTo(0, 0);
  return false;
}

// ===========================================
// GENRE FILTER (HOMEPAGE)
// ===========================================
function filterByGenre(genre, btn) {
  document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const filtered = genre === 'all' ? vibes : vibes.filter(v => v.genre === genre);
  renderGrid('vibesGrid', filtered);
}

// ===========================================
// BROWSE FILTERS
// ===========================================
function applyFilters() {
  const genre  = document.getElementById('filterGenre').value;
  const mood   = document.getElementById('filterMood').value;
  const energy = document.getElementById('filterEnergy').value;
  const tempo  = document.getElementById('filterTempo').value;

  const filtered = vibes.filter(v => {
    return (genre  === 'all' || v.genre  === genre)
        && (mood   === 'all' || v.mood   === mood)
        && (energy === 'all' || v.energy === energy)
        && (tempo  === 'all' || v.tempo  === tempo);
  });

  renderGrid('browseGrid', filtered);
}

// ===========================================
// SEARCH
// ===========================================
function handleSearch(e) {
  if (e.key !== 'Enter') return;
  const q = e.target.value.toLowerCase().trim();
  if (!q) return;
  const results = vibes.filter(v =>
    v.name.toLowerCase().includes(q) ||
    v.genre.toLowerCase().includes(q) ||
    v.mood.toLowerCase().includes(q) ||
    v.emotion.toLowerCase().includes(q) ||
    v.description.toLowerCase().includes(q)
  );
  document.getElementById('searchQueryDisplay').textContent = '"' + e.target.value + '"';
  document.getElementById('searchCountDisplay').textContent = results.length + ' vibe' + (results.length !== 1 ? 's' : '') + ' found';
  renderGrid('searchGrid', results);
  navigate('search');
}

// ===========================================
// INIT
// ===========================================
renderAll();

// Hero background image cycler
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();
