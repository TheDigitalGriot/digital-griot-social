const DATA_URL = 'data/socials.json';
const state = { platforms: [], filter: 'all' };

async function init() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    state.platforms = data.platforms || [];
    state.brand = data.brand;
    state.lastUpdated = data.last_updated;
    render();
  } catch (err) {
    document.getElementById('grid').innerHTML = `<p class="empty">Couldn't load data: ${err.message}. Check that <code>data/socials.json</code> exists and is valid JSON.</p>`;
  }
}

function render() {
  renderStats();
  renderGrid();
  bindFilters();
}

function renderStats() {
  const total = state.platforms.length;
  const claimed = state.platforms.filter(p => p.status === 'claimed' || p.status === 'renamed').length;
  const pending = state.platforms.filter(p => p.status === 'pending').length;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-claimed').textContent = claimed;
  document.getElementById('stat-pending').textContent = pending;
  const pct = total ? Math.round((claimed / total) * 100) : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('last-updated').textContent = state.lastUpdated || '—';
  if (state.brand) document.getElementById('brand-name').textContent = state.brand;
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const tmpl = document.getElementById('card-template');
  const items = state.platforms.filter(matchesFilter);

  grid.innerHTML = '';
  if (items.length === 0) { empty.hidden = false; return; }
  empty.hidden = true;

  items.sort((a, b) => (a.priority || 9) - (b.priority || 9));

  for (const p of items) {
    const card = tmpl.content.cloneNode(true);
    card.querySelector('.card-name').textContent = p.name;
    card.querySelector('.card-handle').textContent = p.handle || '';

    const status = card.querySelector('.status');
    status.textContent = labelStatus(p.status);
    status.dataset.status = p.status;

    const setup = card.querySelector('.setup-type');
    if (p.setup_type) {
      setup.textContent = labelSetup(p.setup_type);
    } else {
      setup.hidden = true;
    }

    const pri = card.querySelector('.priority');
    if (p.priority) {
      pri.textContent = 'P' + p.priority;
    } else {
      pri.hidden = true;
    }

    card.querySelector('.card-notes').textContent = p.notes || '';

    const signupBtn = card.querySelector('.signup-link');
    const profileBtn = card.querySelector('.profile-link');
    if (p.signup_url && (p.status === 'pending' || p.status === 'blocked')) {
      signupBtn.href = p.signup_url;
      signupBtn.textContent = p.status === 'blocked' ? 'Open signup' : 'Sign up';
    } else {
      signupBtn.hidden = true;
    }
    if (p.profile_url) {
      profileBtn.href = p.profile_url;
    } else {
      profileBtn.hidden = true;
    }

    grid.appendChild(card);
  }
}

function matchesFilter(p) {
  switch (state.filter) {
    case 'all': return true;
    case 'priority-1': return p.priority === 1;
    case 'pending': return p.status === 'pending';
    case 'claimed': return p.status === 'claimed';
    case 'renamed': return p.status === 'renamed';
    case 'blocked': return p.status === 'blocked';
    default: return true;
  }
}

function labelStatus(s) {
  return { claimed: 'Claimed', renamed: 'Renamed', pending: 'Pending', blocked: 'Blocked', skipped: 'Skipped' }[s] || s;
}
function labelSetup(s) {
  return { fresh: 'Fresh signup', rename: 'Rename existing', either: 'Audit existing first', org: 'New org' }[s] || s;
}

function bindFilters() {
  for (const btn of document.querySelectorAll('.filter')) {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      for (const b of document.querySelectorAll('.filter')) b.classList.toggle('active', b === btn);
      renderGrid();
    });
  }
}

init();
