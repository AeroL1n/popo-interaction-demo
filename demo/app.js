const categories = [
  { key: 'trending', label: '正在冒泡' },
  { key: 'hackathon', label: 'HACKATHON', variant: 'hackathon' },
  { key: 'team', label: '团队协作' },
  { key: 'report', label: '交互报告' },
  { key: 'inspiration', label: '灵感作品' },
  { key: 'template', label: '精选模板' },
  { key: 'tool', label: '即用工具' },
  { key: 'personal', label: '个人应用' },
];

const works = [
  { id: '7188', title: '小红书舆情监控·百度地图', owner: 'nova', likes: 0, category: 'report' },
  { id: '2453', title: '反馈分析综合报告-问题', owner: 'arjun', likes: 0, category: 'report' },
  { id: '8611', title: '合规链路监控报告 - 8775', owner: 'matteo', likes: 0, category: 'team' },
  { id: '8495', title: '百度教育 · 开学加油季', owner: 'arc', likes: 2, category: 'inspiration' },
  { id: '8700', title: '监控报警配置统计看板', owner: 'evelyn', likes: 0, category: 'tool' },
  { id: '8879', title: '爱奇艺高优_2026_01_15标注报告', owner: 'ben', likes: 0, category: 'report' },
  { id: '261', title: '内容数据报告', owner: 'sebastian', likes: 0, category: 'template' },
  { id: '8874', title: '视频生成结果浏览', owner: 'void', likes: 0, category: 'tool' },
  { id: '6968', title: '海洋放生 · 画一只海洋生物', owner: 'valentina', likes: 4, category: 'inspiration' },
  { id: '4100', title: 'GSB 评测对比 副本（问诊282子集）', owner: 'mia', likes: 1, category: 'team' },
  { id: '2436', title: '反馈分析综合报告', owner: 'arjun', likes: 0, category: 'report' },
  { id: '5100', title: '旅游行业百家号专项数据看板', owner: 'polar', likes: 0, category: 'report' },
  { id: '2995', title: 'LD 8级路覆盖率看板', owner: 'union', likes: 0, category: 'tool' },
  { id: '2230', title: '任务配置方案对比', owner: 'elise', likes: 0, category: 'team' },
  { id: '781', title: '管理会议纪要整理', owner: 'priyanka', likes: 0, category: 'team' },
  { id: '6206', title: '言值·吃瓜判官', owner: 'noah', likes: 1, category: 'personal' },
  { id: '198', title: '群山演示', owner: 'nolan', likes: 0, category: 'inspiration' },
  { id: '3547', title: 'PM 推荐书单', owner: 'westbridge', likes: 22, category: 'template' },
  { id: '2229', title: '任务配置 · 方案对比', owner: 'elise', likes: 0, category: 'team' },
  { id: '4597', title: '百度小程序外链核心数据看板', owner: 'bubblecat', likes: 0, category: 'personal' },
];

const DEMO_DETAIL_COVER_IDS = new Set(works.map((work) => work.id));

// Homepage works use their own captured page as the local preview source. The
// explicit mapping prevents unrelated generic templates from being selected by
// similar words in a title (for example, every "报告" becoming the same page).
const LOCAL_PREVIEW_CONFIG = {
  '7188': { kind: 'sentiment-map', theme: 'light', background: '#f5f1ff' },
  '2453': { kind: 'feedback-diagnosis', theme: 'light', background: '#f7f3ec' },
  '8611': { kind: 'compliance-ops', theme: 'dark', background: '#07110e' },
  '8495': { kind: 'campaign', theme: 'light', background: '#ffffff' },
  '8700': { kind: 'report', theme: 'dark', background: '#0e1422' },
  '8879': { kind: 'media', theme: 'dark', background: '#111214' },
  '261': { kind: 'report', theme: 'light', background: '#f8eddc' },
  '8874': { kind: 'media', theme: 'dark', background: '#111214' },
  '6968': { kind: 'campaign', theme: 'dark', background: '#001623' },
  '4100': { kind: 'report', theme: 'light', background: '#f7f8fa' },
  '2436': { kind: 'report', theme: 'light', background: '#f5f7fb' },
  '5100': { kind: 'report', theme: 'light', background: '#eef2f8' },
  '2995': { kind: 'report', theme: 'light', background: '#eef3fa' },
  '2230': { kind: 'board', theme: 'light', background: '#f8f6f0' },
  '781': { kind: 'app', theme: 'light', background: '#f7f9fc' },
  '6206': { kind: 'app', theme: 'dark', background: '#090817' },
  '198': { kind: 'campaign', theme: 'light', background: '#f6f4ef' },
  '3547': { kind: 'editorial', theme: 'light', background: '#f7f7f2' },
  '2229': { kind: 'board', theme: 'light', background: '#fbf9f4' },
  '4597': { kind: 'report', theme: 'dark', background: '#0b1118' },
};

const aspectRatios = [1.58, 1.34, 1.08, 0.9, 1.42, 1.18, 0.82];
const placeholders = [
  '今天想搜点什么?',
  '海量泡泡，搜一个?',
  '捞捞看，有什么宝藏泡泡',
  '泡泡那么多，翻翻看?',
  '想找什么宝藏泡泡?',
  '今天的快乐，从一个泡泡开始',
];

const state = {
  activeCategory: 'trending',
  query: '',
  visibleCount: 12,
  loading: false,
  openShareId: null,
  homeScrollY: 0,
  liked: new Map(),
};

const grid = document.querySelector('#worksGrid');
const tabs = document.querySelector('#categoryTabs');
const emptyState = document.querySelector('#emptyState');
const loadMore = document.querySelector('#loadMore');
const toast = document.querySelector('#toast');
let toastTimer;
let searchTimer;
let avatarGuideTimer;
let homeOnboardingFailsafeTimer;
let homeOnboardingHideTimer;
let homeOnboardingRevealing = false;
let profileVisibilityTransitionTimer;
let profileVisibilityIndicatorFrame;
let homeActionTooltipTimer;
let homeActionTooltipTrigger = null;
let homeActionTooltipHiddenAt = 0;

const homeActionTooltip = document.querySelector('#homeActionTooltip');

const AVATAR_GUIDE_SEEN_KEY = 'pop:topbar-avatar-guide-seen:v1';
const HOME_ONBOARDING_SEEN_KEY = 'pop:home-onboarding-seen:v1';
const ONBOARDING_FADE_LEAD_SECONDS = 1.45;
const ONBOARDING_REVEAL_MS = 1500;
const ONBOARDING_FAILSAFE_MS = 11000;

function markHomeOnboardingSeen() {
  try { window.localStorage.setItem(HOME_ONBOARDING_SEEN_KEY, '1'); } catch {}
}

function hasSeenHomeOnboarding() {
  try { return window.localStorage.getItem(HOME_ONBOARDING_SEEN_KEY) === '1'; } catch { return false; }
}

function shouldReduceHomeOnboardingMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function clearHomeOnboardingTimers() {
  window.clearTimeout(homeOnboardingFailsafeTimer);
  window.clearTimeout(homeOnboardingHideTimer);
}

function finishHomeOnboarding() {
  const overlay = document.querySelector('[data-home-onboarding]');
  clearHomeOnboardingTimers();
  markHomeOnboardingSeen();
  if (overlay) overlay.hidden = true;
  document.documentElement.classList.remove('home-onboarding-active', 'home-onboarding-revealing');
  homeOnboardingRevealing = false;
  if (currentRoute() === '/') initAvatarGuide({ immediate: true });
}

function startHomeOnboardingReveal() {
  const overlay = document.querySelector('[data-home-onboarding]');
  if (!overlay || overlay.hidden || homeOnboardingRevealing) return;
  homeOnboardingRevealing = true;
  overlay.classList.add('home-onboarding-overlay--revealing');
  document.documentElement.classList.add('home-onboarding-revealing');
  window.clearTimeout(homeOnboardingHideTimer);
  homeOnboardingHideTimer = window.setTimeout(finishHomeOnboarding, ONBOARDING_REVEAL_MS);
}

function initHomeOnboarding() {
  const overlay = document.querySelector('[data-home-onboarding]');
  const video = document.querySelector('[data-home-onboarding-video]');
  if (!overlay || !video || currentRoute() !== '/') return false;
  if (hasSeenHomeOnboarding() || shouldReduceHomeOnboardingMotion()) {
    if (shouldReduceHomeOnboardingMotion()) markHomeOnboardingSeen();
    overlay.hidden = true;
    return false;
  }

  clearHomeOnboardingTimers();
  window.clearTimeout(avatarGuideTimer);
  homeOnboardingRevealing = false;
  overlay.hidden = false;
  overlay.classList.remove('home-onboarding-overlay--revealing');
  document.documentElement.classList.add('home-onboarding-active');
  document.documentElement.classList.remove('home-onboarding-revealing');

  video.currentTime = 0;
  const playResult = video.play();
  playResult?.catch(startHomeOnboardingReveal);
  homeOnboardingFailsafeTimer = window.setTimeout(startHomeOnboardingReveal, ONBOARDING_FAILSAFE_MS);
  return true;
}

function initAvatarGuide({ immediate = false } = {}) {
  const glow = document.querySelector('.topbar-avatar-glow');
  const guide = document.querySelector('[data-avatar-guide]');
  let seen = false;
  try { seen = window.localStorage.getItem(AVATAR_GUIDE_SEEN_KEY) === '1'; } catch {}
  if (document.documentElement.classList.contains('home-onboarding-active')) return;
  if (seen) {
    if (glow) glow.hidden = true;
    return;
  }
  window.clearTimeout(avatarGuideTimer);
  const showGuide = () => {
    try { window.localStorage.setItem(AVATAR_GUIDE_SEEN_KEY, '1'); } catch {}
    if (guide) guide.hidden = false;
  };
  if (immediate) {
    showGuide();
    return;
  }
  avatarGuideTimer = window.setTimeout(showGuide, 2000);
}

function replayHomeFirstVisitExperience() {
  const guide = document.querySelector('[data-avatar-guide]');
  const glow = document.querySelector('.topbar-avatar-glow');

  clearHomeOnboardingTimers();
  window.clearTimeout(avatarGuideTimer);
  try {
    window.localStorage.removeItem(HOME_ONBOARDING_SEEN_KEY);
    window.localStorage.removeItem(AVATAR_GUIDE_SEEN_KEY);
  } catch {}

  if (guide) guide.hidden = true;
  if (glow) glow.hidden = false;
  document.documentElement.classList.remove('home-is-sticky');
  window.scrollTo({ top: 0, behavior: 'auto' });

  if (!initHomeOnboarding()) initAvatarGuide();
}

function stableAspect(work) {
  const input = `${work.id}:${work.owner}:demo`;
  let checksum = 0;
  for (let index = 0; index < input.length; index += 1) {
    checksum = (checksum + input.charCodeAt(index) * (index + 1)) % aspectRatios.length;
  }
  return aspectRatios[checksum];
}

function demoCoverSrc(work, variant = 'portrait') {
  const id = work.coverId ?? work.id;
  if (DEMO_DETAIL_COVER_IDS.has(id)) {
    return `./assets/detail-covers/${id}-${variant}.png?v=20260912d`;
  }
  return `./assets/covers/${id}.webp`;
}

function visibleWorks() {
  const query = state.query.trim().toLocaleLowerCase('zh-CN');
  return works.filter((work) => {
    const categoryMatch = state.activeCategory === 'trending' || work.category === state.activeCategory;
    const queryMatch = !query || `${work.title} ${work.owner}`.toLocaleLowerCase('zh-CN').includes(query);
    return categoryMatch && queryMatch;
  });
}

function refreshVisibleWorks() {
  state.visibleCount = 12;
  state.openShareId = null;
  const firstWork = works.shift();
  if (firstWork) works.push(firstWork);
  renderWorks();
  showToast('作品已刷新');
}

function renderTabs() {
  tabs.innerHTML = categories
    .map(
      (category) => `
        <button
          class="category-tab${category.variant === 'hackathon' ? ' category-tab-hackathon' : ''}"
          type="button"
          role="tab"
          data-category="${category.key}"
          aria-selected="${state.activeCategory === category.key}"
        >${category.variant === 'hackathon' ? `<img class="hackathon-default" src="./assets/home/hackathon-label.png" alt="HACKATHON" /><img class="hackathon-hover" src="./assets/home/hackathon-label-hover.png" alt="HACKATHON" /><img class="hackathon-active" src="./assets/home/hackathon-label-active.png" alt="HACKATHON" />` : category.label}</button>
      `,
    )
    .join('');
}

function renderCard(work) {
  const likeState = state.liked.get(work.id);
  const liked = likeState?.liked ?? false;
  const count = likeState?.count ?? work.likes;
  const shareOpen = state.openShareId === work.id;

  return `
    <article class="work-card home-work-card${shareOpen ? ' share-open home-work-card-share-popover-open' : ''}" data-work-id="${work.id}">
      <div class="work-card-inner">
        <button class="work-link" type="button" data-open-work="${work.id}" aria-label="${work.title}">
          <div class="cover-frame" style="aspect-ratio:${stableAspect(work)}">
            <img src="${demoCoverSrc(work)}" alt="${work.title}" loading="lazy" />
          </div>
          <p class="work-title">${work.title}</p>
        </button>
        <div class="work-meta">
          <div class="work-owner">
            <img src="./assets/avatars/${work.owner}.jpg" alt="${work.owner}" loading="lazy" />
            <span>${work.owner}</span>
          </div>
          <div class="work-actions">
            <button class="icon-button share-button" type="button" data-share="${work.id}" aria-label="分享泡泡">
              <span class="home-action-tooltip-anchor share-icon-wrap" data-tooltip="分享泡泡"><span class="share-icon-frame"><img class="home-action-icon home-action-icon-default" src="./assets/icons/home-share.svg" alt="" /><img class="home-action-icon home-action-icon-active" src="./assets/icons/home-share-active.svg" alt="" /></span></span>
            </button>
            <button class="icon-button like-button${liked ? ' liked' : ''}" type="button" data-like="${work.id}" aria-label="${liked ? '取消点赞' : '点赞'}" aria-pressed="${liked}">
              <span class="like-icon-wrap home-action-tooltip-anchor" data-tooltip="给泡泡打气"><span class="like-icon-frame"><img class="home-action-icon home-action-icon-default" src="./assets/icons/home-like.svg" alt="" /><img class="home-action-icon home-action-icon-active" src="./assets/icons/home-like-active.svg" alt="" /></span></span><span class="like-count">${count}</span>
            </button>
            ${
              shareOpen
                ? `<div class="share-menu">
                    <button type="button" data-copy-link="${work.id}">复制链接</button>
                    <button type="button" data-infoflow="${work.id}">分享到如流</button>
                  </div>`
                : ''
            }
          </div>
        </div>
      </div>
    </article>
  `;
}

const HOME_CARD_LAYOUT = {
  desktopGutter: 24,
  desktopGutterScale: 0.9,
  extraWideBreakpoint: 1440,
  mobileBreakpoint: 640,
  mobileGutter: 8,
  mobileMinTwoColumns: 280,
  wideBreakpoint: 920,
};

let masonryLayoutFrame = 0;
let masonryObservedWidth = -1;
let pendingHomeScrollY = null;

function restorePendingHomeScroll() {
  if (pendingHomeScrollY === null) return;
  const targetScrollY = pendingHomeScrollY;
  pendingHomeScrollY = null;
  window.requestAnimationFrame(() => {
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: Math.min(targetScrollY, maxScrollY), behavior: 'auto' });
  });
}

function getHomeMasonryColumns(width) {
  if (width < HOME_CARD_LAYOUT.mobileBreakpoint) {
    const columnCount = width >= HOME_CARD_LAYOUT.mobileMinTwoColumns ? 2 : 1;
    return {
      columnCount,
      columnGutter: columnCount > 1 ? HOME_CARD_LAYOUT.mobileGutter : 0,
      rowGutter: HOME_CARD_LAYOUT.mobileGutter,
    };
  }

  return {
    columnCount:
      width >= HOME_CARD_LAYOUT.extraWideBreakpoint
        ? 5
        : width >= HOME_CARD_LAYOUT.wideBreakpoint
          ? 4
          : 3,
    columnGutter: Math.round(
      HOME_CARD_LAYOUT.desktopGutter * HOME_CARD_LAYOUT.desktopGutterScale,
    ),
    rowGutter: Math.round(
      HOME_CARD_LAYOUT.desktopGutter * HOME_CARD_LAYOUT.desktopGutterScale,
    ),
  };
}

function layoutHomeMasonry() {
  masonryLayoutFrame = 0;
  const cards = [...grid.querySelectorAll('.work-card')];
  const containerWidth = grid.clientWidth;

  if (grid.hidden || cards.length === 0 || containerWidth === 0) {
    grid.style.height = '0px';
    grid.dataset.layoutReady = 'true';
    restorePendingHomeScroll();
    return;
  }

  const { columnCount, columnGutter, rowGutter } = getHomeMasonryColumns(containerWidth);
  const columnWidth = Math.floor(
    (containerWidth - columnGutter * (columnCount - 1)) / columnCount,
  );
  const layoutWidth = columnWidth * columnCount + columnGutter * (columnCount - 1);
  const layoutOffset = (containerWidth - layoutWidth) / 2;
  const columnHeights = Array(columnCount).fill(0);

  cards.forEach((card) => {
    let targetColumn = 0;
    for (let index = 1; index < columnHeights.length; index += 1) {
      if (columnHeights[index] < columnHeights[targetColumn]) targetColumn = index;
    }

    card.style.width = `${columnWidth}px`;
    card.style.left = `${layoutOffset + targetColumn * (columnWidth + columnGutter)}px`;
    card.style.top = `${columnHeights[targetColumn]}px`;
    columnHeights[targetColumn] += card.getBoundingClientRect().height + rowGutter;
  });

  grid.style.height = `${Math.max(...columnHeights) - rowGutter}px`;
  grid.dataset.columns = String(columnCount);
  grid.dataset.layoutReady = 'true';
  restorePendingHomeScroll();
}

function requestHomeMasonryLayout() {
  if (masonryLayoutFrame) window.cancelAnimationFrame(masonryLayoutFrame);
  masonryLayoutFrame = window.requestAnimationFrame(layoutHomeMasonry);
}

function renderWorks() {
  if (homeActionTooltipTrigger) hideHomeActionTooltip();
  const filtered = visibleWorks();
  const current = filtered.slice(0, state.visibleCount);
  delete grid.dataset.layoutReady;
  grid.innerHTML = current.map(renderCard).join('');
  emptyState.hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
  loadMore.hidden = filtered.length === 0 || current.length >= filtered.length;
  if (!loadMore.hidden) loadMore.textContent = state.loading ? '加载中...' : '';
  requestHomeMasonryLayout();
}

function createSearch(variant) {
  const container = document.querySelector(`[data-search-container="${variant}"]`);
  const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
  container.innerHTML = `
    <div class="search-shell ${variant}">
      ${
        variant === 'hero'
          ? `<img class="search-left-character" src="./assets/home/search-character-green.png" alt="" aria-hidden="true" />
             <div class="search-ip-group">
               <button class="search-entry-button" type="button" aria-label="来逛逛泡泡">
                 <span class="search-entry-copy">
                   <span>来逛逛泡泡</span>
                   <img class="search-entry-arrow" src="./assets/home/right-small.svg" alt="" aria-hidden="true" />
                 </span>
               </button>
               <img class="search-ip search-ip-one" src="./assets/home/search-character-one.png" alt="" aria-hidden="true" />
               <img class="search-ip search-ip-two" src="./assets/home/search-character-two.png" alt="" aria-hidden="true" />
             </div>`
          : ''
      }
      <label class="search-control">
        <img class="search-icon" src="./assets/icons/search-icon.svg" alt="" />
        <input type="search" aria-label="检索作品" placeholder="${placeholder}" autocomplete="off" />
        <button class="search-clear" type="button" title="清空搜索" aria-label="清空搜索" hidden>×</button>
      </label>
    </div>
  `;
}

function positionHomeActionTooltip(trigger) {
  if (!homeActionTooltip || !trigger?.isConnected) return;
  homeActionTooltip.textContent = trigger.dataset.tooltip ?? '';
  homeActionTooltip.dataset.open = 'measuring';
  homeActionTooltip.setAttribute('aria-hidden', 'false');

  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = homeActionTooltip.getBoundingClientRect();
  const center = triggerRect.left + triggerRect.width / 2;
  const collisionPadding = 12;
  const topCollisionPadding = 80;
  let side = 'top';
  let top = triggerRect.top - tooltipRect.height - 8;

  if (top < topCollisionPadding) {
    side = 'bottom';
    top = triggerRect.bottom + 8;
  }

  const left = Math.min(
    window.innerWidth - collisionPadding - tooltipRect.width,
    Math.max(collisionPadding, center - tooltipRect.width / 2),
  );
  homeActionTooltip.style.left = `${Math.round(left)}px`;
  homeActionTooltip.style.top = `${Math.round(top)}px`;
  homeActionTooltip.dataset.side = side;
  window.requestAnimationFrame(() => {
    if (homeActionTooltipTrigger === trigger) homeActionTooltip.dataset.open = 'true';
  });
}

function hideHomeActionTooltip() {
  window.clearTimeout(homeActionTooltipTimer);
  homeActionTooltipTrigger = null;
  homeActionTooltipHiddenAt = performance.now();
  if (!homeActionTooltip) return;
  homeActionTooltip.dataset.open = 'false';
  homeActionTooltip.setAttribute('aria-hidden', 'true');
}

function syncSearchInputs(value) {
  document.querySelectorAll('.search-control input').forEach((input) => {
    if (input.value !== value) input.value = value;
    input.nextElementSibling.hidden = value.length === 0;
  });
}

function submitSearch(value) {
  state.query = value;
  state.visibleCount = 12;
  state.openShareId = null;
  syncSearchInputs(value);
  renderWorks();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 1800);
}

function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add('modal-open');
}

function closeModal(modal) {
  modal.hidden = true;
  if (!document.querySelector('.modal-backdrop:not([hidden])')) document.body.classList.remove('modal-open');
}

function openPlaza() {
  const modal = document.querySelector('#plazaModal');
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('plaza-open');
  modal.querySelector('[data-close-plaza]')?.focus({ preventScroll: true });
}

function closePlaza() {
  const modal = document.querySelector('#plazaModal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('plaza-open');
  document.querySelector('.search-entry-button')?.focus({ preventScroll: true });
}

function openWork(workId) {
  const work = works.find((item) => item.id === workId);
  if (!work) return;
  state.homeScrollY = window.scrollY;
  navigateRoute(`/works/${work.id}`);
}

createSearch('hero');
createSearch('compact');
renderTabs();
renderWorks();

const homeOnboardingVideo = document.querySelector('[data-home-onboarding-video]');
homeOnboardingVideo?.addEventListener('canplay', () => {
  const playResult = homeOnboardingVideo.play();
  playResult?.catch(startHomeOnboardingReveal);
});
homeOnboardingVideo?.addEventListener('timeupdate', () => {
  if (!Number.isFinite(homeOnboardingVideo.duration) || homeOnboardingVideo.duration <= 0) return;
  if (homeOnboardingVideo.duration - homeOnboardingVideo.currentTime <= ONBOARDING_FADE_LEAD_SECONDS) {
    startHomeOnboardingReveal();
  }
});
homeOnboardingVideo?.addEventListener('ended', startHomeOnboardingReveal);
homeOnboardingVideo?.addEventListener('error', startHomeOnboardingReveal);

document.addEventListener('pointerover', (event) => {
  const trigger = event.target.closest?.('.home-action-tooltip-anchor[data-tooltip]');
  if (!trigger || trigger === homeActionTooltipTrigger) return;
  window.clearTimeout(homeActionTooltipTimer);
  homeActionTooltipTrigger = trigger;
  const delay = performance.now() - homeActionTooltipHiddenAt <= 80 ? 0 : 180;
  homeActionTooltipTimer = window.setTimeout(() => positionHomeActionTooltip(trigger), delay);
});

document.addEventListener('pointerout', (event) => {
  const trigger = event.target.closest?.('.home-action-tooltip-anchor[data-tooltip]');
  if (!trigger || trigger.contains(event.relatedTarget)) return;
  hideHomeActionTooltip();
});

window.addEventListener('scroll', hideHomeActionTooltip, { passive: true });
window.addEventListener('resize', hideHomeActionTooltip);
window.addEventListener('resize', syncProfileSettingsScrollIndicator);

const masonryResizeObserver = new ResizeObserver(([entry]) => {
  const nextWidth = entry.contentRect.width;
  if (Math.abs(nextWidth - masonryObservedWidth) < 0.5) return;
  masonryObservedWidth = nextWidth;
  requestHomeMasonryLayout();
});
masonryResizeObserver.observe(grid);
document.fonts?.ready.then(requestHomeMasonryLayout);

document.addEventListener('input', (event) => {
  if (!event.target.matches('.search-control input')) return;
  const value = event.target.value;
  syncSearchInputs(value);
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => submitSearch(value), 300);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.target.matches('.search-control input')) {
    window.clearTimeout(searchTimer);
    submitSearch(event.target.value);
  }
  if (event.key === 'Escape') {
    closePlaza();
    document.querySelectorAll('.modal-backdrop:not([hidden])').forEach(closeModal);
    if (state.openShareId) {
      state.openShareId = null;
      renderWorks();
    }
  }
});

document.addEventListener('click', async (event) => {
  const searchEntryButton = event.target.closest('.search-entry-button');
  if (searchEntryButton) {
    openPlaza();
    return;
  }

  if (event.target.closest('[data-close-plaza]') || event.target.matches('.plaza-backdrop')) {
    closePlaza();
    return;
  }

  const plazaAction = event.target.closest('[data-plaza-action]')?.dataset.plazaAction;
  if (plazaAction) {
    const messages = {
      wish: '许愿池功能正在搭建中',
      new: '冒泡上新功能正在搭建中',
      qa: '有问必答功能正在搭建中',
      group: '群号 13001998，欢迎进群冒泡',
    };
    showToast(messages[plazaAction]);
    return;
  }

  if (event.target.closest('[data-close-avatar-guide]')) {
    document.querySelector('[data-avatar-guide]').hidden = true;
    const glow = document.querySelector('.topbar-avatar-glow');
    if (glow) glow.hidden = true;
    return;
  }
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    state.activeCategory = categoryButton.dataset.category;
    state.visibleCount = 12;
    state.openShareId = null;
    renderTabs();
    renderWorks();
    return;
  }

  const clearButton = event.target.closest('.search-clear');
  if (clearButton) {
    submitSearch('');
    document.querySelector('[data-search-container="hero"] input')?.focus();
    return;
  }

  const workButton = event.target.closest('[data-open-work]');
  if (workButton) {
    openWork(workButton.dataset.openWork);
    return;
  }

  const shareButton = event.target.closest('[data-share]');
  if (shareButton) {
    event.stopPropagation();
    state.openShareId = state.openShareId === shareButton.dataset.share ? null : shareButton.dataset.share;
    renderWorks();
    return;
  }

  const likeButton = event.target.closest('[data-like]');
  if (likeButton) {
    const work = works.find((item) => item.id === likeButton.dataset.like);
    const current = state.liked.get(work.id) ?? { liked: false, count: work.likes };
    state.liked.set(work.id, { liked: !current.liked, count: current.count + (current.liked ? -1 : 1) });
    renderWorks();
    return;
  }

  const copyButton = event.target.closest('[data-copy-link]');
  if (copyButton) {
    const url = `${window.location.origin}${window.location.pathname}#works-${copyButton.dataset.copyLink}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('链接已复制');
    } catch {
      showToast('复制失败，请重试');
    }
    state.openShareId = null;
    renderWorks();
    return;
  }

  const infoflowButton = event.target.closest('[data-infoflow]');
  if (infoflowButton) {
    showToast('已生成如流分享卡片');
    state.openShareId = null;
    renderWorks();
    return;
  }

  if (!event.target.closest('.share-menu')) {
    if (state.openShareId) {
      state.openShareId = null;
      renderWorks();
    }
  }

  const closeButton = event.target.closest('[data-close-modal]');
  if (closeButton) closeModal(closeButton.closest('.modal-backdrop'));
});

document.querySelectorAll('.modal-backdrop').forEach((modal) => {
  modal.addEventListener('mousedown', (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.querySelector('#publishButton').addEventListener('click', () => openModal(document.querySelector('#publishModal')));
const bubbleFileInput = document.querySelector('#bubbleFileInput');
const bubbleDropZone = document.querySelector('[data-bubble-file-trigger]');
const bubblePrompt = document.querySelector('#bubblePrompt');
const bubbleSubmit = document.querySelector('[data-bubble-submit]');
const bubbleDialog = document.querySelector('.bubble-compose-dialog');

function updateBubbleSubmitState() {
  const hasFile = Boolean(bubbleDropZone?.classList.contains('has-files'));
  const hasPrompt = Boolean(bubblePrompt?.value.trim());
  bubbleDialog?.classList.toggle('has-bubble-content', hasFile || hasPrompt);
}

function setBubbleFiles(files) {
  const selectedFiles = [...(files ?? [])];
  if (!selectedFiles.length || !bubbleDropZone) {
    bubbleDropZone?.classList.remove('has-files');
    updateBubbleSubmitState();
    return;
  }
  const fileNames = selectedFiles.map((file) => file.name).join('、');
  bubbleDropZone.classList.add('has-files');
  bubbleDropZone.querySelector('strong').textContent = selectedFiles.length === 1 ? fileNames : `${selectedFiles.length} 个文件已加入`;
  bubbleDropZone.querySelector('span:last-child').textContent = '继续输入一句话，或直接点击发个泡泡';
  updateBubbleSubmitState();
}

bubbleDropZone?.addEventListener('click', () => bubbleFileInput?.click());
bubbleFileInput?.addEventListener('change', (event) => setBubbleFiles(event.target.files));
bubblePrompt?.addEventListener('input', updateBubbleSubmitState);
bubbleDialog?.addEventListener('dragover', (event) => {
  event.preventDefault();
  bubbleDialog.classList.add('is-dragging');
});
bubbleDialog?.addEventListener('dragleave', (event) => {
  if (!bubbleDialog.contains(event.relatedTarget)) bubbleDialog.classList.remove('is-dragging');
});
bubbleDialog?.addEventListener('drop', (event) => {
  event.preventDefault();
  bubbleDialog.classList.remove('is-dragging');
  setBubbleFiles(event.dataTransfer?.files);
});
bubbleSubmit?.addEventListener('click', () => {
  const hasFile = Boolean(bubbleDropZone?.classList.contains('has-files'));
  const hasPrompt = Boolean(bubblePrompt?.value.trim());
  if (!hasFile && !hasPrompt) {
    bubblePrompt?.focus();
    showToast('先拖入文件或输入一句话吧');
    return;
  }
  showToast('泡泡正在生成中');
});
updateBubbleSubmitState();
document.querySelector('[data-bubble-other]')?.addEventListener('click', () => {
  closeModal(document.querySelector('#publishModal'));
  openModal(document.querySelector('#legacyPublishModal'));
});
document.querySelector('#profileButton').addEventListener('click', () => navigateRoute('/profile'));
document.querySelector('.brand-button').addEventListener('click', () => {
  if (currentRoute() !== '/') {
    navigateRoute('/');
    return;
  }
  replayHomeFirstVisitExperience();
});
document.querySelector('#backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelector('#refreshWorks').addEventListener('click', refreshVisibleWorks);

window.addEventListener(
  'scroll',
  () => {
    document.documentElement.classList.toggle('home-is-sticky', window.scrollY > 360);
    document.querySelector('#backToTop').classList.toggle('visible', window.scrollY > window.innerHeight * 1.25);
  },
  { passive: true },
);

const loadObserver = new IntersectionObserver(
  (entries) => {
    if (!entries.some((entry) => entry.isIntersecting) || state.loading) return;
    const filtered = visibleWorks();
    if (state.visibleCount >= filtered.length) return;
    state.loading = true;
    loadMore.textContent = '加载中...';
    window.setTimeout(() => {
      state.visibleCount += 8;
      state.loading = false;
      renderWorks();
    }, 450);
  },
  { rootMargin: '0px 0px 120px 0px' },
);

loadObserver.observe(loadMore);

// Multi-page demo data. User-facing mutations are simulated locally and never call source APIs.
const demoVisibility = ['specified', 'internal', 'private', 'internal', 'specified', 'internal'];
const demoTagSets = [
  ['数据分析', '报告'],
  ['交互报告', '反馈'],
  ['团队协作', '监控'],
  ['活动', '教育'],
  ['即用工具', '看板'],
  ['AI', '质检'],
  ['模板', '内容'],
  ['视频', '工具'],
  ['灵感', '公益'],
  ['评测', '团队'],
];

const DEMO_DEFAULT_PROXY_CONFIG = `import { useEffect, useState } from 'react';

function TimerComponent() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('组件已挂载 - 执行初始化逻辑');
    setMounted(true);
  }, []);
}`;

const DEMO_SETTINGS_TAGS = [
  'agent-link', 'agent', 'agentO端', 'agent接入', 'AI', 'HDC',
  'ClaudeCode', 'code review', 'comate', 'demo', 'dodo', 'vibe code',
  '工具', '追踪提醒', '流程协同', '数据分析', '交互报告', '团队协作',
];

const DEMO_PERMISSION_USERS = [
  { id: 'user:linyuhang', type: 'user', label: 'linyuhang', username: 'linyuhang', email: 'linyuhang@gmail.com', avatar: './assets/avatars/linyuhang.jpg' },
  { id: 'user:nova', type: 'user', label: 'nova', username: 'nova', email: 'nova@gmail.com', avatar: './assets/avatars/nova.jpg' },
  { id: 'user:arjun', type: 'user', label: 'arjun', username: 'arjun', email: 'arjun@gmail.com', avatar: './assets/avatars/arjun.jpg' },
  { id: 'user:matteo', type: 'user', label: 'matteo', username: 'matteo', email: 'matteo@gmail.com', avatar: './assets/avatars/matteo.jpg' },
  { id: 'user:arc', type: 'user', label: 'arc', username: 'arc', email: 'arc@gmail.com', avatar: './assets/avatars/arc.jpg' },
  { id: 'user:evelyn', type: 'user', label: 'evelyn', username: 'evelyn', email: 'evelyn@gmail.com', avatar: './assets/avatars/evelyn.jpg' },
  { id: 'user:ben', type: 'user', label: 'ben', username: 'ben', email: 'ben@gmail.com', avatar: './assets/avatars/ben.jpg' },
  { id: 'user:sebastian', type: 'user', label: 'sebastian', username: 'sebastian', email: 'sebastian@gmail.com', avatar: './assets/avatars/sebastian.jpg' },
  { id: 'user:void', type: 'user', label: 'void', username: 'void', email: 'void@gmail.com', avatar: './assets/avatars/void.jpg' },
  { id: 'user:valentina', type: 'user', label: 'valentina', username: 'valentina', email: 'valentina@gmail.com', avatar: './assets/avatars/valentina.jpg' },
  { id: 'user:mia', type: 'user', label: 'mia', username: 'mia', email: 'mia@gmail.com', avatar: './assets/avatars/mia.jpg' },
  { id: 'user:polar', type: 'user', label: 'polar', username: 'polar', email: 'polar@gmail.com', avatar: './assets/avatars/polar.jpg' },
  { id: 'user:union', type: 'user', label: 'union', username: 'union', email: 'union@gmail.com', avatar: './assets/avatars/union.jpg' },
  { id: 'user:elise', type: 'user', label: 'elise', username: 'elise', email: 'elise@gmail.com', avatar: './assets/avatars/elise.jpg' },
  { id: 'user:priyanka', type: 'user', label: 'priyanka', username: 'priyanka', email: 'priyanka@gmail.com', avatar: './assets/avatars/priyanka.jpg' },
  { id: 'user:noah', type: 'user', label: 'noah', username: 'noah', email: 'noah@gmail.com', avatar: './assets/avatars/noah.jpg' },
  { id: 'user:nolan', type: 'user', label: 'nolan', username: 'nolan', email: 'nolan@gmail.com', avatar: './assets/avatars/nolan.jpg' },
  { id: 'user:westbridge', type: 'user', label: 'westbridge', username: 'westbridge', email: 'westbridge@gmail.com', avatar: './assets/avatars/westbridge.jpg' },
  { id: 'user:bubblecat', type: 'user', label: 'bubblecat', username: 'bubblecat', email: 'bubblecat@gmail.com', avatar: './assets/avatars/bubblecat.jpg' },
];

const DEMO_PERMISSION_GROUPS = [
  { id: 'group:orbit-studio', type: 'group', label: 'Orbit Studio', members: 653, avatar: './assets/groups/orbit-studio.png' },
  { id: 'group:lumen-labs', type: 'group', label: 'Lumen Labs', members: 26, avatar: './assets/groups/lumen-labs.png' },
  { id: 'group:glyph-collective', type: 'group', label: 'Glyph Collective', members: 15, avatar: './assets/groups/glyph-collective.png' },
  { id: 'group:ember-works', type: 'group', label: 'Ember Works', members: 6, avatar: './assets/groups/ember-works.png' },
  { id: 'group:signal-foundry', type: 'group', label: 'Signal Foundry', members: 1600, avatar: './assets/groups/signal-foundry.png' },
];

const DEMO_PERMISSION_DIRECTORY = [...DEMO_PERMISSION_USERS, ...DEMO_PERMISSION_GROUPS];

const demoWorks = works.map((work, index) => ({
  ...work,
  coverId: work.id,
  visibility: demoVisibility[index % demoVisibility.length],
  tags: [...demoTagSets[index % demoTagSets.length]],
  shareCount: (index * 3 + 2) % 11,
  viewCount: 126 + index * 47,
  onlineAt: `2026-08-${String(Math.max(1, 8 - (index % 8))).padStart(2, '0')}`,
  slug: `popo-demo-${work.id}`,
  grants: index % 2 === 0 ? ['user:priyanka', 'group:lumen-labs'] : ['user:nova'],
  toolbarHidden: false,
  proxyConfig: DEMO_DEFAULT_PROXY_CONFIG,
  deleted: false,
}));

const demoUser = {
  username: 'linyuhang',
  nickname: '林宇航',
  email: 'linyuhang@baidu.com',
  avatar: './assets/avatars/linyuhang.jpg',
};

const DEMO_COMMENT_PROFILES = [
  'linyuhang',
  'arjun',
  'priyanka',
  'nova',
  'elise',
  'evelyn',
  'valentina',
  'westbridge',
  'ben',
  'mia',
  'polar',
  'noah',
].map((username) => ({ username, avatar: `./assets/avatars/${username}.jpg` }));

const DEMO_EMPTY_COMMENT_WORKS = new Set(['8495', '261', '198', '4597']);
const DEMO_COMMENT_STORAGE_VERSION = 'v4';
const DEMO_COMMENT_TIMES = ['8 分钟前', '36 分钟前', '2 小时前', '昨天', '3 天前', '上周'];
const DEMO_REPLY_TEXTS = [
  '收到，这个点很有价值，我补到下一版里。',
  '同感，我也会优先关注这里的变化。',
  '已经补充了口径说明，可以再看一下。',
  '这个建议不错，交互上还能再收敛一步。',
  '数据来源是同一批次，时间窗口保持一致。',
  '先记录下来，后面会和其他反馈一起调整。',
];

const DEMO_COMMENT_TEXTS = {
  report: [
    '整体信息层级很清楚，核心结论能快速扫到。',
    '趋势图的信息量刚好，建议给异常波动补一条原因说明。',
    '对比维度很实用，如果能保留筛选条件会更方便复盘。',
    '指标口径可以再明确一点，尤其是环比时间范围。',
    '这版报告比之前更聚焦，结论和数据之间的对应关系也更清楚。',
  ],
  media: [
    '批次和状态的区分很直观，浏览大量结果时不会迷路。',
    '希望支持把两个结果固定在一起对比细节。',
    '缩略图密度合适，选中态可以再明显一点。',
    '素材状态一眼能看懂，适合评审时快速过稿。',
  ],
  campaign: [
    '主题氛围很完整，首屏进入故事的节奏很好。',
    '互动反馈自然，继续往下探索的动机比较强。',
    '文案和画面结合得很顺，可以再强化最后的行动入口。',
    '移动端也很期待看到这一套体验。',
  ],
  board: [
    '任务状态和负责人都很好扫读，协作信息比较聚焦。',
    '如果能按负责人快速筛选，日常跟进会更高效。',
    '看板密度控制得不错，长标题也没有打乱节奏。',
    '建议给阻塞中的任务增加更明确的提示。',
  ],
  app: [
    '操作路径很顺，常用入口都在预期的位置。',
    '工作台信息比较完整，空状态也可以补一个快捷动作。',
    '整体很克制，重复使用时不会觉得有负担。',
    '建议记住上一次打开的模块，回来时能直接继续。',
  ],
  editorial: [
    '内容节奏舒服，标题和摘要之间的层级很明确。',
    '归档结构适合持续更新，后续查找也方便。',
    '可以增加按主题浏览的入口，长周期阅读会更顺。',
    '排版很耐看，信息密度和留白控制得很好。',
  ],
};

const demoVersions = [
  { id: 'v5', versionNo: 5, status: 'ready', createdAt: '2026-08-08 18:42', size: '4.8 MB', files: 28 },
  { id: 'v4', versionNo: 4, status: 'ready', createdAt: '2026-08-07 15:16', size: '4.6 MB', files: 27 },
  { id: 'v3', versionNo: 3, status: 'failed', createdAt: '2026-08-06 21:09', size: '0 B', files: 0 },
  { id: 'v2', versionNo: 2, status: 'ready', createdAt: '2026-08-05 10:34', size: '3.9 MB', files: 23 },
  { id: 'v1', versionNo: 1, status: 'ready', createdAt: '2026-08-03 09:20', size: '3.2 MB', files: 19 },
];

const demoAdminUsers = [
  { username: 'linyuhang', note: '当前用户', createdAt: '2026-07-18', createdBy: 'system' },
  { username: 'priyanka', note: '数据运营', createdAt: '2026-07-22', createdBy: 'linyuhang' },
  { username: 'arjun', note: '内容管理', createdAt: '2026-07-29', createdBy: 'linyuhang' },
];

let demoAnnouncements = [
  { title: '个人主页管理能力升级', content: '现在可以直接管理作品标签、可见范围和历史版本。' },
  { title: '数据看板新增转化分析', content: '支持按时间范围查看访问、互动和有效作品趋势。' },
];

const demoPageState = {
  profileVisibility: '',
  profileTag: '',
  profileManaging: false,
  selectedVersionId: 'v5',
  currentVersionId: 'v5',
  dashboardRange: '7',
  rankKey: 'visitors',
  dashboardAdminOpen: false,
  announcementNotice: '',
};

let profileSettingsUi = null;

const demoAnchorCommentsByWork = new Map();
const demoWorkCommentsByWork = new Map();
const demoCommentTotalsByWork = new Map();
const demoCommentUi = {
  workId: null,
  tab: 'work',
  loading: false,
  loaded: false,
  sending: false,
  loadTimer: 0,
  pendingAnchor: null,
  replyTarget: null,
  selectedId: null,
  orphanIds: new Set(),
  expandedIds: new Set(),
  deleteTarget: null,
};
let demoAnchorCommentSequence = 0;
let demoWorkCommentSequence = 0;
let demoReplySequence = 0;

const routePage = document.querySelector('#routePage');
const homePage = document.querySelector('.home-page');
let lastRenderedRoute = null;

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

function currentRoute() {
  const route = window.location.hash.replace(/^#/, '');
  return route.startsWith('/') ? route : '/';
}

function navigateRoute(route) {
  const normalized = route.startsWith('/') ? route : `/${route}`;
  if (currentRoute() === normalized) {
    renderRoute();
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  window.location.hash = normalized;
}

function findDemoWork(id) {
  return demoWorks.find((work) => work.id === String(id) && !work.deleted);
}

function visibilityLabel(value) {
  return { internal: '公开', specified: '指定人可见', private: '私有' }[value] ?? value;
}

function formatPublishedDate(value) {
  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) return value;
  return `${year}/${Number(month)}/${day.padStart(2, '0')}`;
}

function safeText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pageTopbar({ onColor = false } = {}) {
  return `
    <header class="page-topbar${onColor ? ' on-color' : ''}">
      <button class="page-brand" type="button" data-route="/" aria-label="popo 首页">
        <img src="./assets/home/logo.png" alt="popo" />
      </button>
      <div class="page-actions">
        <button class="publish-button" type="button" data-open-publish><img class="corner corner-top" src="./assets/icons/corner-bracket.svg" alt="" /><span class="publish-button-label">发个泡泡</span><img class="corner corner-bottom" src="./assets/icons/corner-bracket.svg" alt="" /><span class="publish-new-badge" aria-label="新功能">NEW</span></button>
        <div class="topbar-avatar-area avatar-mailbox-root">
          <button class="page-avatar" type="button" data-route="/profile" title="个人中心" aria-label="个人中心">
            <span class="avatar-status-ring" aria-hidden="true"></span>
            <img src="${demoUser.avatar}" alt="${demoUser.username}" />
            <span class="avatar-status-badge" aria-label="28 条未读消息">28</span>
          </button>
          <div class="avatar-mailbox-popover" aria-label="消息通知">
            <iframe src="./inbox-prototype/weekly-default.html?embed=1&amp;v=20260912bj" title="消息通知" loading="eager"></iframe>
          </div>
        </div>
      </div>
    </header>
  `;
}

function resetInboxPopover(popover) {
  const frame = popover?.querySelector('iframe');
  const targetOrigin = window.location.protocol === 'file:' ? '*' : window.location.origin;
  frame?.contentWindow?.postMessage({ source: 'popo-inbox-host', action: 'reset-to-messages' }, targetOrigin);
}

document.addEventListener('pointerover', (event) => {
  const mailbox = event.target.closest?.('.avatar-mailbox-root');
  if (!mailbox || mailbox.contains(event.relatedTarget)) return;
  resetInboxPopover(mailbox.querySelector('.avatar-mailbox-popover'));
});

document.addEventListener('focusin', (event) => {
  const mailbox = event.target.closest?.('.avatar-mailbox-root');
  if (!mailbox || mailbox.dataset.inboxFocusOpen === 'true') return;
  mailbox.dataset.inboxFocusOpen = 'true';
  resetInboxPopover(mailbox.querySelector('.avatar-mailbox-popover'));
});

document.addEventListener('focusout', (event) => {
  const mailbox = event.target.closest?.('.avatar-mailbox-root');
  if (!mailbox) return;
  window.setTimeout(() => {
    if (!mailbox.contains(document.activeElement)) delete mailbox.dataset.inboxFocusOpen;
  }, 0);
});

function appShell(content, active = '') {
  return `
    <div class="app-shell">
      <header class="app-header">
        <div class="app-header-inner">
          <button class="app-wordmark" type="button" data-route="/" aria-label="popo 首页"><img src="./assets/home/logo.png" alt="popo" /></button>
          <nav class="app-nav" aria-label="主要导航">
            <button type="button" data-route="/" class="${active === 'home' ? 'active' : ''}">首页</button>
            <button type="button" data-route="/works" class="${active === 'works' ? 'active' : ''}">作品</button>
            <button type="button" data-route="/profile" class="${active === 'profile' ? 'active' : ''}">个人中心</button>
            <button type="button" data-route="/admin" class="${active === 'admin' ? 'active' : ''}">后台</button>
          </nav>
        </div>
      </header>
      <main class="app-content">${content}</main>
    </div>
  `;
}

function openDemoModal(title, content, { wide = false } = {}) {
  document.querySelector('#dynamicDemoModal')?.remove();
  profileSettingsUi = null;
  const modal = document.createElement('div');
  modal.id = 'dynamicDemoModal';
  modal.className = 'demo-modal-backdrop';
  modal.innerHTML = `
    <section class="demo-dialog${wide ? ' wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="dynamicModalTitle">
      <button class="drawer-close demo-dialog-close" type="button" data-demo-close title="关闭" aria-label="关闭">×</button>
      <h2 id="dynamicModalTitle">${safeText(title)}</h2>
      ${content}
    </section>
  `;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
}

function closeDemoModal() {
  document.querySelector('#dynamicDemoModal')?.remove();
  profileSettingsUi = null;
  document.body.classList.remove('modal-open');
}

function profileSettingsTabsMarkup(activeTab) {
  return `<nav class="profile-settings-tabs" role="tablist" aria-label="作品设置">
    ${[
      ['basic', '基本信息'],
      ['permission', '权限管理'],
      ['advanced', '高级设置'],
    ].map(([value, label]) => `<button class="${activeTab === value ? 'active' : ''}" type="button" role="tab" aria-selected="${activeTab === value}" data-profile-settings-tab="${value}">${label}</button>`).join('')}
  </nav>`;
}

function profileSettingsPreviewMarkup(work) {
  const liked = state.liked.get(work.id);
  const likeCount = liked?.count ?? work.likes;
  const previewTags = work.tags.slice(0, 4);
  const overflowTags = Math.max(0, work.tags.length - previewTags.length);
  const coverTheme = LOCAL_PREVIEW_CONFIG[work.coverId ?? work.id]?.theme ?? 'light';
  return `<article class="profile-settings-preview" data-profile-settings-preview>
    <div class="profile-settings-preview-cover">
      <img src="${demoCoverSrc(work, 'landscape')}" alt="" />
      <span class="profile-work-card-visibility-badge profile-work-card-visibility-badge-${coverTheme}">${visibilityLabel(work.visibility)}</span>
    </div>
    <strong title="${safeText(work.title)}">${safeText(work.title)}</strong>
    <div class="profile-settings-preview-tags">
      ${previewTags.map((tag) => `<span title="${safeText(tag)}">${safeText(tag)}</span>`).join('')}
      ${overflowTags ? `<span>${overflowTags}+</span>` : ''}
    </div>
    <footer><span><img src="./assets/icons/bubble-like.svg" alt="" />${likeCount}</span><span><img src="./assets/icons/view.svg" alt="" />${work.viewCount}</span><time>更新于 ${formatPublishedDate(work.onlineAt)}</time></footer>
  </article>`;
}

function profileSettingsTagListMarkup(work) {
  if (!work.tags.length) return '<span class="profile-settings-empty-note">暂未添加标签</span>';
  return work.tags.map((tag, index) => `<button class="profile-settings-tag" type="button" data-settings-remove-tag="${index}" title="移除 ${safeText(tag)}"><span>${safeText(tag)}</span><span aria-hidden="true"></span></button>`).join('');
}

function profileSettingsBasicMarkup(work) {
  return `<section class="profile-settings-basic-panel" role="tabpanel">
    <div class="profile-settings-basic-form">
      <div class="profile-settings-field profile-settings-title-field">
        <label for="profileSettingsTitle">作品名称</label>
        <div class="profile-settings-input-shell${work.title ? '' : ' is-error'}">
          <input id="profileSettingsTitle" data-settings-title="${work.id}" maxlength="50" value="${safeText(work.title)}" autocomplete="off" />
          <span data-settings-title-count>${work.title.length}/50</span>
        </div>
        <p class="profile-settings-error" data-settings-title-error${work.title ? ' hidden' : ''}>作品名字不能为空</p>
      </div>
      <div class="profile-settings-field profile-settings-tag-field">
        <label for="profileSettingsTagInput">添加标签</label>
        <div class="profile-settings-tag-composer">
          <input id="profileSettingsTagInput" data-settings-tag-input placeholder="请输入标签名" autocomplete="off" />
          <button type="button" data-settings-add-tag>添加</button>
          <div class="profile-settings-tag-suggestions" data-settings-tag-suggestions hidden></div>
        </div>
      </div>
      <div class="profile-settings-tag-list" data-settings-tag-list>${profileSettingsTagListMarkup(work)}</div>
      <button class="profile-settings-delete-button" type="button" data-profile-delete-request="${work.id}">删除作品</button>
    </div>
    <div class="profile-settings-preview-divider" aria-hidden="true"></div>
    ${profileSettingsPreviewMarkup(work)}
  </section>`;
}

function profilePermissionEntry(id) {
  return DEMO_PERMISSION_DIRECTORY.find((entry) => entry.id === id);
}

function profilePermissionChipMarkup(entry, index) {
  if (!entry) return '';
  return `<span class="profile-settings-grant-chip">
    <img src="${entry.avatar}" alt="" />
    <span>${safeText(entry.type === 'group' ? `${entry.label} (${entry.members}人)` : entry.username)}</span>
    <button type="button" data-settings-remove-grant="${index}" aria-label="移除 ${safeText(entry.label)}"></button>
  </span>`;
}

function profileSettingsPermissionMarkup(work) {
  const specified = work.visibility === 'specified';
  return `<section class="profile-settings-permission-panel" role="tabpanel">
    <div class="profile-settings-permission-row">
      <span class="profile-settings-field-label">发布类型</span>
      <div class="profile-settings-radio-group" role="radiogroup" aria-label="发布类型">
        ${[
          ['private', '私有'],
          ['internal', '公开'],
          ['specified', '指定人可见'],
        ].map(([value, label]) => `<label><input type="radio" name="profileSettingsVisibility" value="${value}" data-settings-visibility="${work.id}" ${work.visibility === value ? 'checked' : ''} /><span>${label}</span></label>`).join('')}
      </div>
    </div>
    <div class="profile-settings-permission-content" data-settings-permission-content ${specified ? '' : 'hidden'}>
      <div class="profile-settings-permission-row profile-settings-grant-row">
        <label class="profile-settings-field-label" for="profileSettingsGrantSearch">添加授权</label>
        <div class="profile-settings-grant-composer">
          <input id="profileSettingsGrantSearch" data-settings-grant-search value="${safeText(profileSettingsUi?.searchQuery ?? '')}" placeholder="输入用户名或群组名，例如 nova" autocomplete="off" />
          <div class="profile-settings-search-results" data-settings-search-results hidden></div>
        </div>
      </div>
      <div class="profile-settings-grant-list" data-settings-grant-list>
        ${(work.grants ?? []).map((id, index) => profilePermissionChipMarkup(profilePermissionEntry(id), index)).join('') || '<span class="profile-settings-empty-note">暂未添加授权对象</span>'}
      </div>
    </div>
  </section>`;
}

function profileSettingsAdvancedMarkup() {
  const draft = profileSettingsUi.advancedDraft;
  return `<section class="profile-settings-advanced-panel" role="tabpanel">
    <div class="profile-settings-advanced-row">
      <span class="profile-settings-advanced-label">在作品详情页显示工具栏 <button class="profile-settings-help" type="button" aria-label="工具栏说明" data-tooltip="保存后控制作品详情页右侧工具栏是否显示"><img src="./assets/icons/help.svg" alt="" /></button></span>
      <label class="profile-settings-switch"><input type="checkbox" data-settings-toolbar-draft ${draft.toolbarHidden ? '' : 'checked'} /><span></span></label>
    </div>
    <div class="profile-settings-proxy-row">
      <label class="profile-settings-advanced-label" for="profileSettingsProxy">代理配置 <button class="profile-settings-help" type="button" aria-label="代理配置说明" data-tooltip="仅校验配置文本格式，不会执行其中代码"><img src="./assets/icons/help.svg" alt="" /></button></label>
      <div class="profile-settings-proxy-editor" data-settings-proxy-editor>
        <textarea id="profileSettingsProxy" data-settings-proxy-draft spellcheck="false" placeholder="请输入代理配置">${safeText(draft.proxyConfig)}</textarea>
        <span class="profile-settings-resize-mark" aria-hidden="true">⌟</span>
        <p class="profile-settings-error" data-settings-proxy-error hidden></p>
      </div>
    </div>
    <div class="profile-settings-advanced-actions">
      <button class="profile-settings-cancel" type="button" data-demo-close>取消</button>
      <button class="profile-settings-save" type="button" data-settings-save-advanced>保存</button>
    </div>
  </section>`;
}

function profileSettingsPanelMarkup(work, tab) {
  if (tab === 'permission') return profileSettingsPermissionMarkup(work);
  if (tab === 'advanced') return profileSettingsAdvancedMarkup(work);
  return profileSettingsBasicMarkup(work);
}

function syncProfileSettingsScrollIndicator() {
  const form = document.querySelector('.profile-settings-basic-form');
  const indicator = document.querySelector('.profile-settings-preview-divider');
  if (!form || !indicator) return;
  const maxScroll = Math.max(0, form.scrollHeight - form.clientHeight);
  const deleteButton = form.querySelector('.profile-settings-delete-button');
  const deletePushedOut = Boolean(deleteButton && deleteButton.offsetTop >= form.clientHeight);
  const scrollable = maxScroll > 1 && deletePushedOut;
  indicator.classList.toggle('is-scrollable', scrollable);
  if (!scrollable) {
    indicator.style.setProperty('--profile-settings-scroll-y', '0px');
    return;
  }
  const thumbHeight = Math.min(168, indicator.clientHeight);
  const maxThumbTravel = Math.max(0, indicator.clientHeight - thumbHeight);
  const thumbY = maxScroll ? (form.scrollTop / maxScroll) * maxThumbTravel : 0;
  indicator.style.setProperty('--profile-settings-scroll-y', `${thumbY}px`);
}

function renderProfileSettingsPanel({ focusSelector = '' } = {}) {
  const work = findDemoWork(profileSettingsUi?.workId);
  const dialog = document.querySelector('[data-profile-settings-dialog]');
  if (!work || !dialog) return;
  dialog.querySelector('[data-profile-settings-tabs]').innerHTML = profileSettingsTabsMarkup(profileSettingsUi.tab);
  dialog.querySelector('[data-profile-settings-body]').innerHTML = profileSettingsPanelMarkup(work, profileSettingsUi.tab);
  const basicForm = dialog.querySelector('.profile-settings-basic-form');
  basicForm?.addEventListener('scroll', syncProfileSettingsScrollIndicator, { passive: true });
  window.requestAnimationFrame(syncProfileSettingsScrollIndicator);
  if (profileSettingsUi.tab === 'permission' && profileSettingsUi.searchQuery) renderProfilePermissionSearchResults();
  if (focusSelector) window.setTimeout(() => dialog.querySelector(focusSelector)?.focus(), 0);
}

function openProfileSettingsModal(work, initialTab = 'basic', { focusTags = false } = {}) {
  document.querySelector('#dynamicDemoModal')?.remove();
  profileSettingsUi = {
    workId: work.id,
    tab: initialTab,
    searchQuery: '',
    searchTab: 'user',
    advancedDraft: {
      toolbarHidden: work.toolbarHidden === true,
      proxyConfig: work.proxyConfig ?? '',
    },
  };
  const modal = document.createElement('div');
  modal.id = 'dynamicDemoModal';
  modal.className = 'demo-modal-backdrop profile-settings-backdrop';
  modal.innerHTML = `<section class="profile-settings-dialog" role="dialog" aria-modal="true" aria-labelledby="profileSettingsTitleLabel" data-profile-settings-dialog>
    <header class="profile-settings-header">
      <h2 id="profileSettingsTitleLabel">设置</h2>
      <button type="button" data-demo-close aria-label="关闭设置"><img src="./assets/sidebar/icon-close.svg" alt="" /></button>
    </header>
    <div class="profile-settings-tabs-slot" data-profile-settings-tabs></div>
    <div class="profile-settings-body" data-profile-settings-body></div>
  </section>`;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
  renderProfileSettingsPanel({ focusSelector: focusTags ? '[data-settings-tag-input]' : '' });
}

function openProfileDeleteConfirm(work) {
  document.querySelector('#dynamicDemoModal')?.remove();
  profileSettingsUi = null;
  const modal = document.createElement('div');
  modal.id = 'dynamicDemoModal';
  modal.className = 'demo-modal-backdrop profile-delete-confirm-backdrop';
  modal.innerHTML = `<section class="profile-delete-confirm" role="alertdialog" aria-modal="true" aria-labelledby="profileDeleteConfirmTitle">
    <div class="profile-delete-confirm-title"><img src="./assets/sidebar/icon-warning.svg" alt="" /><h2 id="profileDeleteConfirmTitle">确认删除该作品?</h2></div>
    <div class="profile-delete-confirm-actions"><button type="button" data-demo-close>取消</button><button type="button" data-confirm-delete="${work.id}">确认</button></div>
  </section>`;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
}

function syncProfileSettingsPresentation(work) {
  const card = [...document.querySelectorAll('[data-profile-work]')].find((item) => item.dataset.profileWork === work.id);
  if (card) card.outerHTML = profileCardMarkup(work);
  const preview = document.querySelector('[data-profile-settings-preview]');
  if (preview) preview.outerHTML = profileSettingsPreviewMarkup(work);
}

function renderProfileSettingsTagList(work) {
  const list = document.querySelector('[data-settings-tag-list]');
  if (list) list.innerHTML = profileSettingsTagListMarkup(work);
  window.requestAnimationFrame(syncProfileSettingsScrollIndicator);
}

function profileSettingsTagSuggestions(query, work = findDemoWork(profileSettingsUi?.workId)) {
  const normalized = query.trim().toLocaleLowerCase('zh-CN');
  const usedTags = new Set((work?.tags ?? []).map((tag) => tag.toLocaleLowerCase('zh-CN')));
  const availableTags = DEMO_SETTINGS_TAGS.filter((tag) => !usedTags.has(tag.toLocaleLowerCase('zh-CN')));
  if (!normalized) return availableTags.slice(0, 10);
  return availableTags
    .filter((tag) => tag.toLocaleLowerCase('zh-CN').includes(normalized))
    .sort((a, b) => Number(!a.toLocaleLowerCase('zh-CN').startsWith(normalized)) - Number(!b.toLocaleLowerCase('zh-CN').startsWith(normalized)))
    .slice(0, 12);
}

function renderProfileTagSuggestions(input = document.querySelector('[data-settings-tag-input]')) {
  const suggestions = document.querySelector('[data-settings-tag-suggestions]');
  if (!input || !suggestions) return;
  const tags = profileSettingsTagSuggestions(input.value);
  suggestions.innerHTML = tags.length
    ? `<span class="profile-settings-suggestion-heading">${input.value.trim() ? '联想' : '推荐'}</span><div>${tags.map((tag) => `<button type="button" data-settings-tag-suggestion="${safeText(tag)}">${safeText(tag)}</button>`).join('')}</div>`
    : '<span class="profile-settings-empty-note">没有匹配的推荐标签</span>';
  suggestions.hidden = false;
}

function addProfileSettingsTag(value) {
  const work = findDemoWork(profileSettingsUi?.workId);
  const input = document.querySelector('[data-settings-tag-input]');
  const nextTag = String(value ?? input?.value ?? '').trim();
  if (!work || !nextTag) return;
  work.tags.push(nextTag);
  if (input) input.value = '';
  renderProfileSettingsTagList(work);
  syncProfileSettingsPresentation(work);
  renderProfileTagSuggestions(input);
}

function permissionSearchScore(entry, query) {
  const searchable = entry.type === 'group'
    ? `${entry.label}`
    : `${entry.label} ${entry.username}`;
  const value = searchable.toLocaleLowerCase('zh-CN');
  if (value.startsWith(query)) return 0;
  if (entry.username?.toLocaleLowerCase('zh-CN').startsWith(query)) return 1;
  return 2;
}

function permissionSearchEntries(tab, query) {
  const source = tab === 'group' ? DEMO_PERMISSION_GROUPS : DEMO_PERMISSION_USERS;
  return source
    .filter((entry) => `${entry.label} ${entry.username ?? ''}`.toLocaleLowerCase('zh-CN').includes(query))
    .sort((a, b) => permissionSearchScore(a, query) - permissionSearchScore(b, query));
}

function profilePermissionSearchResults() {
  const query = (profileSettingsUi?.searchQuery ?? '').trim().toLocaleLowerCase('zh-CN');
  if (!query) return [];
  const userResults = permissionSearchEntries('user', query);
  const groupResults = permissionSearchEntries('group', query);
  if (profileSettingsUi.searchTab === 'user' && userResults.length === 0 && groupResults.length > 0) {
    profileSettingsUi.searchTab = 'group';
  } else if (profileSettingsUi.searchTab === 'group' && groupResults.length === 0 && userResults.length > 0) {
    profileSettingsUi.searchTab = 'user';
  }
  return profileSettingsUi.searchTab === 'group' ? groupResults : userResults;
}

function profilePermissionSearchResultMarkup(entry, selected) {
  const meta = entry.type === 'group' ? `(${entry.members}人)` : entry.email;
  return `<button class="profile-settings-search-result${selected ? ' is-selected' : ''}" type="button" data-settings-select-grant="${entry.id}" ${selected ? 'disabled' : ''}>
    <span><img src="${entry.avatar}" alt="" /><strong>${safeText(entry.type === 'group' ? entry.label : entry.username)}</strong><small>${safeText(meta)}</small></span>
    ${selected ? '<em>已添加</em>' : ''}
  </button>`;
}

function renderProfilePermissionSearchResults() {
  const results = document.querySelector('[data-settings-search-results]');
  const work = findDemoWork(profileSettingsUi?.workId);
  if (!results || !work) return;
  const query = profileSettingsUi.searchQuery.trim();
  if (!query) {
    results.hidden = true;
    results.innerHTML = '';
    return;
  }
  const entries = profilePermissionSearchResults();
  results.innerHTML = `<div class="profile-settings-search-tabs">
      <button class="${profileSettingsUi.searchTab === 'user' ? 'active' : ''}" type="button" data-settings-search-tab="user">用户</button>
      <button class="${profileSettingsUi.searchTab === 'group' ? 'active' : ''}" type="button" data-settings-search-tab="group">群组</button>
    </div>
    <div class="profile-settings-search-list">
      ${entries.length ? entries.map((entry) => profilePermissionSearchResultMarkup(entry, work.grants.includes(entry.id))).join('') : `<div class="profile-settings-search-empty"><img src="./assets/home/popo-avatar.svg" alt="" /><span>暂未找到相关${profileSettingsUi.searchTab === 'group' ? '群组' : '用户'}</span></div>`}
    </div>`;
  results.hidden = false;
}

function renderProfileGrantList(work) {
  const list = document.querySelector('[data-settings-grant-list]');
  if (list) list.innerHTML = work.grants.map((id, index) => profilePermissionChipMarkup(profilePermissionEntry(id), index)).join('') || '<span class="profile-settings-empty-note">暂未添加授权对象</span>';
}

function validateProfileProxyFormat(value) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  let quote = '';
  let escaped = false;
  for (const character of value) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\' && quote) {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }
    if (character === '(' || character === '[' || character === '{') stack.push(character);
    if (pairs[character] && stack.pop() !== pairs[character]) return '配置格式错误，请检查括号是否正确闭合';
  }
  if (quote) return '配置格式错误，请检查字符串引号是否闭合';
  if (stack.length) return '配置格式错误，请检查括号是否正确闭合';
  return '';
}

function renderRoute() {
  cleanupDemoAnchorCommentUi();
  const route = currentRoute();
  const shouldRestoreHomeScroll = route === '/'
    && /^\/works\/[^/]+$/.test(lastRenderedRoute ?? '');
  closeDemoModal();
  document.querySelectorAll('.modal-backdrop').forEach((modal) => {
    modal.hidden = true;
  });
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('home-is-sticky');

  if (route === '/') {
    pendingHomeScrollY = shouldRestoreHomeScroll ? state.homeScrollY : null;
    routePage.hidden = true;
    homePage.hidden = false;
    document.title = 'popo';
    renderWorks();
    if (!initHomeOnboarding()) initAvatarGuide();
  } else {
    const onboardingOverlay = document.querySelector('[data-home-onboarding]');
    if (onboardingOverlay && !onboardingOverlay.hidden) finishHomeOnboarding();
    pendingHomeScrollY = null;
    document.querySelector('.demo-announcement')?.remove();
    homePage.hidden = true;
    routePage.hidden = false;
    routePage.innerHTML = routeMarkup(route);
    if (route === '/profile') requestAnimationFrame(initProfileVisibilityIndicator);
  }

  if (!shouldRestoreHomeScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  lastRenderedRoute = route;
}

function routeMarkup(route) {
  if (route === '/profile') return profileMarkup();
  if (route === '/works') return worksManagementMarkup();
  if (route === '/dashboard') return dashboardMarkup();
  if (route === '/works/proxy-setup') return proxySetupMarkup();
  if (route === '/admin') return adminMarkup();
  if (route === '/admin/announcements') return announcementsMarkup();

  const versionsMatch = route.match(/^\/works\/([^/]+)\/versions$/);
  if (versionsMatch) return versionsMarkup(versionsMatch[1]);

  const workMatch = route.match(/^\/works\/([^/]+)$/);
  if (workMatch) return workPreviewMarkup(workMatch[1]);

  const profileMatch = route.match(/^\/profile\/([^/]+)$/);
  if (profileMatch) return publicProfileMarkup(profileMatch[1]);

  return notFoundMarkup();
}

function profileCardMarkup(work, { editable = true } = {}) {
  const liked = state.liked.get(work.id);
  const likeCount = liked?.count ?? work.likes;
  const coverTheme = LOCAL_PREVIEW_CONFIG[work.coverId ?? work.id]?.theme ?? 'light';
  if (!editable) {
    return `
      <article class="public-profile-work-card">
        <button type="button" data-route="/works/${work.id}" aria-label="打开 ${safeText(work.title)}">
          <span class="public-profile-work-cover"><img src="${demoCoverSrc(work, 'landscape')}" alt="${safeText(work.title)}" loading="lazy" /></span>
          <span class="public-profile-work-copy">
            <strong title="${safeText(work.title)}">${safeText(work.title)}</strong>
            ${work.tags.length ? `<span class="public-profile-work-tags">${work.tags.slice(0, 3).map((tag) => `<span>${safeText(tag)}</span>`).join('')}</span>` : ''}
          </span>
        </button>
      </article>
    `;
  }
  const visibleTags = work.tags.slice(0, 4);
  const overflowTags = Math.max(0, work.tags.length - visibleTags.length);
  return `
    <article class="profile-work-card profile-work-card-desktop-device${demoPageState.profileManaging ? ' profile-work-card-managing' : ''}" data-profile-work="${work.id}">
      <div class="profile-work-card-body">
        <button class="profile-work-card-cover-link" type="button" data-route="/works/${work.id}" aria-label="打开 ${safeText(work.title)}">
          <span class="profile-work-card-cover-frame"><img class="profile-work-card-cover-image" src="${demoCoverSrc(work, 'landscape')}" alt="${safeText(work.title)}" loading="lazy" /></span>
          <span class="profile-work-card-visibility-badge profile-work-card-visibility-badge-${coverTheme}">${visibilityLabel(work.visibility)}</span>
        </button>
        <div class="profile-work-card-content">
          <div class="profile-work-card-title-row">
            <div class="profile-work-card-title" title="${safeText(work.title)}">${safeText(work.title)}</div>
          </div>
          <div class="profile-tag-row">
            ${visibleTags.map((tag) => `<span class="profile-tag-chip"><span class="profile-tag-chip-label">${safeText(tag)}</span><button class="profile-tag-chip-remove" type="button" data-profile-remove-tag="${safeText(tag)}" data-id="${work.id}" aria-label="删除标签 ${safeText(tag)}"><span aria-hidden="true">×</span></button></span>`).join('')}
            ${overflowTags ? `<button class="profile-tag-row-more-button" type="button" data-profile-action="tags" data-id="${work.id}" title="查看全部标签">${overflowTags}+</button>` : ''}
            ${editable ? `<button class="profile-tag-row-add-button" type="button" data-profile-action="tags" data-id="${work.id}" aria-label="添加标签"><img src="./assets/icons/plus-default.svg" alt="" /></button>` : ''}
          </div>
          <div class="profile-work-card-info-slot">
            <div class="profile-work-card-info-container">
              <div class="profile-work-card-stats"><span class="profile-work-card-stat"><img src="./assets/icons/bubble-like.svg" alt="" />${likeCount}</span><span class="profile-work-card-stat"><img src="./assets/icons/view.svg" alt="" />${work.viewCount}</span></div>
              <span class="profile-work-card-updated-date">发布于 ${formatPublishedDate(work.onlineAt)}</span>
            </div>
            ${editable ? `<div class="profile-work-card-desktop-actions"><button type="button" data-route="/works/${work.id}/versions">版本</button><button class="danger" type="button" data-profile-action="delete" data-id="${work.id}">删除</button><button type="button" data-profile-action="permission" data-id="${work.id}">权限</button><button type="button" data-profile-action="share" data-id="${work.id}">分享</button></div>` : ''}
          </div>
        </div>
      </div>
    </article>
  `;
}

function profileMarkup() {
  document.title = '个人中心 · popo';
  const visibleWorks = demoWorks.filter((work) => {
    if (work.deleted) return false;
    const visibilityMatch = !demoPageState.profileVisibility || work.visibility === demoPageState.profileVisibility;
    const tagMatch = !demoPageState.profileTag || work.tags.includes(demoPageState.profileTag);
    return visibilityMatch && tagMatch;
  });
  const allTags = [...new Set(demoWorks.filter((work) => !work.deleted).flatMap((work) => work.tags))];
  const totalLikes = demoWorks.filter((work) => !work.deleted).reduce((sum, work) => sum + (state.liked.get(work.id)?.count ?? work.likes), 0);
  const workCount = demoWorks.filter((work) => !work.deleted).length;

  return `
    <div class="profile-page">
      <section class="profile-hero">
        ${pageTopbar({ onColor: true })}
        <div class="profile-hero-inner">
          <img class="profile-decor" src="./assets/profile/profile-decor.png" alt="" />
          <div class="profile-identity">
            <img src="${demoUser.avatar}" alt="${demoUser.username}" />
            <div><div class="profile-name">${demoUser.nickname}</div><div class="profile-email">${demoUser.email}</div></div>
            <div class="profile-mobile-quote"><span class="profile-mobile-quote-line">安静积累的日子，<img src="./assets/profile/quote-decor.png" alt="" /></span><span>终会变成被看见的瞬间。</span></div>
          </div>
          <div class="profile-quote"><span>安静积累的日子，终会变成被看见的瞬间。</span><img src="./assets/profile/quote-decor.png" alt="" /></div>
        </div>
      </section>
      <main class="profile-content">
        <div class="profile-tools">
          <div class="segment-control" role="tablist" aria-label="作品可见范围">
            ${[
              ['', '全部'],
              ['internal', '公开'],
              ['specified', '指定人可见'],
              ['private', '私有'],
            ].map(([value, label]) => `<button type="button" class="${demoPageState.profileVisibility === value ? 'active' : ''}" role="tab" aria-selected="${demoPageState.profileVisibility === value}" data-profile-visibility="${value}">${label}</button>`).join('')}
          </div>
          <div class="profile-stats-row">
            <div class="stat-pair"><strong>${totalLikes}</strong><span>打气数</span></div>
            <div class="stat-pair"><strong>${workCount}</strong><span>作品</span></div>
          </div>
        </div>
        <div class="tag-filter-row">
          <button class="tag-chip ${!demoPageState.profileTag ? 'active' : ''}" type="button" data-profile-tag="">全部</button>
          ${allTags.slice(0, 10).map((tag) => `<button class="tag-chip ${demoPageState.profileTag === tag ? 'active' : ''}" type="button" data-profile-tag="${safeText(tag)}">${safeText(tag)}</button>`).join('')}
        </div>
        <div class="profile-manage-row">
          <button class="page-secondary" type="button" data-toggle-manage>${demoPageState.profileManaging ? '完成' : '管理'}</button>
        </div>
        ${visibleWorks.length > 0
          ? `<div class="profile-grid">${visibleWorks.map((work) => profileCardMarkup(work)).join('')}</div>`
          : '<div class="profile-empty"><img src="./assets/home/empty-bubble.png" alt="" aria-hidden="true" /><p>这里还没有泡泡</p></div>'}
      </main>
    </div>
  `;
}

function publicProfileMarkup(username) {
  document.title = `${username} · popo`;
  const publicWorks = demoWorks.filter((work) => !work.deleted && work.visibility === 'internal').slice(0, 8);
  const displayName = username === 'linyuhang' ? demoUser.nickname : username;
  const avatar = demoWorks.some((work) => work.owner === username)
    ? `./assets/avatars/${username}.jpg`
    : demoUser.avatar;
  return `
    <div class="profile-page">
      <section class="profile-hero">
        ${pageTopbar({ onColor: true })}
        <div class="profile-hero-inner">
          <img class="profile-decor" src="./assets/profile/profile-decor.png" alt="" />
          <div class="profile-identity">
            <img src="${avatar}" alt="${safeText(username)}" />
            <div><div class="profile-name">${safeText(displayName)}</div><div class="profile-email">${safeText(username)}@baidu.com</div></div>
            <div class="profile-mobile-quote"><span class="profile-mobile-quote-line">让作品替你说话。<img src="./assets/profile/quote-decor.png" alt="" /></span></div>
          </div>
          <div class="profile-quote"><span>让作品替你说话。</span><img src="./assets/profile/quote-decor.png" alt="" /></div>
        </div>
      </section>
      <main class="profile-content">
        <div class="profile-stats-row" style="margin-bottom:24px">
          <div class="stat-pair"><strong>${publicWorks.reduce((sum, work) => sum + work.likes, 0)}</strong><span>打气数</span></div>
          <div class="stat-pair"><strong>${publicWorks.length}</strong><span>作品</span></div>
        </div>
        <div class="profile-section-head"><h2>公开作品</h2></div>
        <div class="public-profile-grid">${publicWorks.map((work) => profileCardMarkup(work, { editable: false })).join('')}</div>
      </main>
    </div>
  `;
}

function openProfileAction(action, id) {
  const work = findDemoWork(id);
  if (!work) return;

  if (action === 'share') {
    openDemoModal('分享作品', `
      <div class="dialog-section">
        <label>分享链接</label>
        <div class="dialog-link-box"><code>${window.location.origin}${window.location.pathname}#/works/${work.id}</code><button class="page-primary" type="button" data-copy-demo-link="${work.id}">复制分享链接</button></div>
        <p class="page-subtitle">在如流中打开可自动获得访问权限，适合发给个人或群聊。</p>
      </div>
      <div class="dialog-section">
        <label>作品专属域名</label>
        <div class="dialog-link-box"><code>https://${work.slug}.popo.baidu-int.com</code><button class="page-secondary" type="button" data-copy-demo-domain="${work.id}">复制专属域名</button></div>
      </div>
      <button class="page-primary" style="width:100%" type="button" data-share-infoflow="${work.id}">分享到如流</button>
    `, { wide: true });
    return;
  }

  if (action === 'settings') {
    openProfileSettingsModal(work, 'basic');
    return;
  }

  if (action === 'permission') {
    openProfileSettingsModal(work, 'permission');
    return;
  }

  if (action === 'tags') {
    openProfileSettingsModal(work, 'basic', { focusTags: true });
    return;
  }

  if (action === 'delete') {
    openProfileDeleteConfirm(work);
  }
}

function worksManagementMarkup() {
  document.title = '作品管理 · popo';
  const activeWorks = demoWorks.filter((work) => !work.deleted);
  return appShell(`
    <div class="page-heading-row">
      <div><h1>作品</h1><p>查看作品状态、访问量和版本，快速进入管理流程。</p></div>
      <button class="page-primary" type="button" data-create-work>新建作品</button>
    </div>
    <div class="tool-row">
      <input class="demo-input" data-work-search placeholder="搜索作品名称或作者" />
      <select class="demo-select" data-work-visibility-filter><option value="">全部可见范围</option><option value="internal">公开</option><option value="specified">指定人可见</option><option value="private">私有</option></select>
      <button class="page-secondary" type="button" data-reset-work-filters>重置</button>
    </div>
    <section class="data-panel">
      <div class="data-table-wrap"><table class="data-table"><thead><tr><th>预览</th><th>作品</th><th>可见范围</th><th>访问</th><th>互动</th><th style="text-align:right">操作</th></tr></thead>
      <tbody data-works-table>${activeWorks.map((work) => worksTableRow(work)).join('')}</tbody></table></div>
    </section>
  `, 'works');
}

function worksTableRow(work) {
  return `<tr data-work-row="${work.id}" data-title="${safeText(`${work.title} ${work.owner}`).toLowerCase()}" data-visibility="${work.visibility}">
    <td><img class="works-thumb" src="${demoCoverSrc(work)}" alt="" /></td>
    <td class="title-cell">${safeText(work.title)}<br /><small style="color:#90918e;font-weight:400">${safeText(work.owner)} · ${work.onlineAt}</small></td>
    <td><span class="visibility-pill ${work.visibility}">${visibilityLabel(work.visibility)}</span></td>
    <td>${work.viewCount}</td><td>${work.likes} 赞 · ${work.shareCount} 分享</td>
    <td><div class="table-actions"><button type="button" data-route="/works/${work.id}">预览</button><button type="button" data-route="/works/${work.id}/versions">版本</button><button type="button" data-profile-action="permission" data-id="${work.id}">权限</button></div></td>
  </tr>`;
}

function workPreviewMarkup(id) {
  const work = findDemoWork(id);
  if (!work) return notFoundMarkup('作品不存在', '该作品可能已被删除或链接有误。');
  document.title = `${work.title} · popo`;
  const liked = state.liked.get(work.id)?.liked ?? false;
  const count = state.liked.get(work.id)?.count ?? work.likes;
  const commentCount = countDemoComments(work.id);
  demoCommentTotalsByWork.set(work.id, commentCount);
  const anchorComments = getDemoAnchorComments(work.id);
  demoCommentUi.workId = work.id;
  demoCommentUi.tab = anchorComments.length > 0 ? 'anchor' : 'work';
  demoCommentUi.loading = false;
  demoCommentUi.loaded = false;
  demoCommentUi.sending = false;
  demoCommentUi.pendingAnchor = null;
  demoCommentUi.selectedId = null;
  const toolbarTheme = workPreviewTheme(work);
  const coverRender = new URLSearchParams(window.location.search).get('cover');
  const coverClass = coverRender === 'portrait' || coverRender === 'landscape' ? ' cover-render' : '';
  return `
    <main class="work-browser-page${coverClass}" data-work-browser="${work.id}" data-work-theme="${toolbarTheme}">
      ${localWorkSiteMarkup(work)}
      ${work.toolbarHidden ? '' : workToolbarMarkup(work, { liked, count, commentCount, theme: toolbarTheme })}
      ${workCommentsMarkup(work, commentCount)}
    </main>
  `;
}

function localPreviewKind(work) {
  const configuredKind = LOCAL_PREVIEW_CONFIG[work.coverId ?? work.id]?.kind;
  if (configuredKind) return configuredKind;
  if (/视频/.test(work.title)) return 'media';
  if (/海洋|群山|教育/.test(work.title)) return 'campaign';
  if (/书单|会议纪要/.test(work.title)) return 'editorial';
  if (/任务|合规/.test(work.title)) return 'board';
  if (/监控|看板|数据|报告|评测|覆盖率|舆情/.test(work.title)) return 'report';
  return 'app';
}

function workPreviewTheme(work) {
  if (work.previewTheme === 'dark' || work.previewTheme === 'light') return work.previewTheme;
  const configuredTheme = LOCAL_PREVIEW_CONFIG[work.coverId ?? work.id]?.theme;
  if (configuredTheme) return configuredTheme;
  return localPreviewKind(work) === 'media' ? 'dark' : 'light';
}

function sentimentMapMarkup(work) {
  const cities = [
    ['北京', '朝阳区新品发布讨论升温', '1,842', 'hot'],
    ['上海', '通勤与门店体验成为焦点', '1,209', 'warm'],
    ['成都', '周末路线内容持续增长', '864', 'warm'],
    ['杭州', '新品体验笔记集中出现', '632', 'calm'],
  ];
  return `<article class="local-site sentiment-map-site" data-anchor-root data-preview-kind="sentiment-map">
    <header class="sm-nav"><div class="sm-brand"><i></i><strong>PULSE MAP</strong><span>舆情态势中心</span></div><div class="sm-nav-actions"><span>数据更新于 10:42</span><button type="button">生成简报</button><img src="./assets/avatars/${work.owner}.jpg" alt="${safeText(work.owner)}" /></div></header>
    <main class="sm-main">
      <section class="sm-heading"><div><span class="sm-kicker">SOCIAL LISTENING · LIVE</span><h1>${safeText(work.title)}</h1><p>追踪城市热点、情绪变化与正在扩散的风险事件。</p></div><div class="sm-live"><i></i>实时监测中</div></section>
      <section class="sm-overview">
        <div class="sm-map-panel"><div class="sm-panel-head"><div><small>地域声量</small><h2>城市热点分布</h2></div><button type="button">近 24 小时⌄</button></div><div class="sm-map" aria-label="城市舆情热点地图"><span class="sm-map-line l1"></span><span class="sm-map-line l2"></span><span class="sm-map-line l3"></span><span class="sm-map-line l4"></span>${[['北京',72,23,'hot'],['上海',79,59,'hot'],['成都',37,62,'warm'],['杭州',71,67,'warm'],['广州',61,82,'calm'],['武汉',57,56,'calm']].map(([name,x,y,tone]) => `<span class="sm-pin ${tone}" style="--x:${x}%;--y:${y}%"><i></i><b>${name}</b></span>`).join('')}<div class="sm-map-legend"><span><i class="hot"></i>高热</span><span><i class="warm"></i>关注</span><span><i class="calm"></i>平稳</span></div></div></div>
        <div class="sm-side"><article class="sm-total"><span>今日总声量</span><strong>18,642</strong><small>↗ 24.8% 较昨日</small><div class="sm-spark">${[35,48,42,64,53,76,69,88,74,92,84,96].map((v,i)=>`<i style="--h:${v}%;--d:${i}"></i>`).join('')}</div></article><article class="sm-sentiment"><div><span>正向情绪</span><strong>72%</strong></div><div class="sm-ring"><span>稳定</span></div><ul><li><i class="positive"></i>正向 <b>72%</b></li><li><i class="neutral"></i>中性 <b>19%</b></li><li><i class="negative"></i>负向 <b>9%</b></li></ul></article></div>
      </section>
      <section class="sm-lower"><article class="sm-topic"><div class="sm-panel-head"><div><small>传播趋势</small><h2>热词声量变化</h2></div><span class="sm-tabs"><b>声量</b><i>情绪</i></span></div><div class="sm-trend"><span class="sm-gridline g1"></span><span class="sm-gridline g2"></span><span class="sm-gridline g3"></span><svg viewBox="0 0 600 170" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="smArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7655ff" stop-opacity=".28"/><stop offset="1" stop-color="#7655ff" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0 142 C58 131 75 109 130 118 S220 77 278 92 S350 45 410 65 S508 24 600 35 L600 170 L0 170Z"/><path class="line" d="M0 142 C58 131 75 109 130 118 S220 77 278 92 S350 45 410 65 S508 24 600 35"/></svg><div class="sm-axis"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span></div></div></article><article class="sm-events"><div class="sm-panel-head"><div><small>重点关注</small><h2>热点事件流</h2></div><em>4 个事件</em></div><div class="sm-event-list">${cities.map(([city,title,count,tone],index)=>`<div><span class="sm-event-rank ${tone}">0${index+1}</span><p><b>${title}</b><small>${city} · ${index+1}2 分钟前</small></p><strong>${count}</strong></div>`).join('')}</div></article></section>
    </main>
  </article>`;
}

function feedbackDiagnosisMarkup(work) {
  const issues = [['支付路径中断','高优先级','128 条反馈','critical'],['会员权益说明不清','需本周处理','96 条反馈','high'],['下载入口难以发现','体验优化','71 条反馈','medium'],['搜索结果相关性偏低','持续观察','54 条反馈','low']];
  return `<article class="local-site feedback-diagnosis-site" data-anchor-root data-preview-kind="feedback-diagnosis">
    <header class="fd-nav"><div><strong>FIELD NOTES</strong><span>/ 用户反馈诊断</span></div><nav><button class="active">诊断报告</button><button>问题库</button><button>行动清单</button></nav><img src="./assets/avatars/${work.owner}.jpg" alt="${safeText(work.owner)}" /></header>
    <main class="fd-main"><section class="fd-cover"><div class="fd-cover-copy"><span>WEEK 25 · CUSTOMER EXPERIENCE</span><h1>${safeText(work.title)}</h1><p>从 872 条真实反馈中识别高影响问题，并将观察转化为可执行的改进任务。</p><div><button type="button">下载完整报告</button><small>分析周期<br/><b>06.15 — 06.21</b></small></div></div><aside class="fd-priority"><span>本周优先处理</span><strong>01</strong><h2>支付链路的中断反馈持续上升</h2><p>集中发生在优惠券使用后的确认环节，影响新用户首次转化。</p><div><i></i><span>高影响</span><b>+31%</b></div></aside></section>
      <section class="fd-summary"><article><span>收录反馈</span><strong>872</strong><small>较上周 −17.8%</small></article><article><span>关键问题</span><strong>12</strong><small>3 项需要立即处理</small></article><article><span>已进入计划</span><strong>68%</strong><small>8 / 12 已有负责人</small></article><p><span>研究员结论</span><b>反馈总量下降，但核心链路的高严重度问题占比上升。建议本周资源优先投入支付和会员权益说明。</b></p></section>
      <section class="fd-analysis"><article class="fd-matrix-card"><div class="fd-section-title"><span>01</span><div><small>IMPACT × FREQUENCY</small><h2>问题严重度矩阵</h2></div></div><div class="fd-matrix"><span class="fd-y">影响程度</span><span class="fd-x">出现频率</span><i class="fd-mid-v"></i><i class="fd-mid-h"></i><em class="zone z1">优先处理</em><em class="zone z2">持续观察</em>${[['支付中断',77,25,'critical'],['会员说明',66,40,'high'],['下载入口',45,56,'medium'],['搜索相关性',57,68,'medium'],['页面卡顿',28,73,'low']].map(([label,x,y,tone])=>`<button class="fd-dot ${tone}" style="--x:${x}%;--y:${y}%"><i></i><span>${label}</span></button>`).join('')}</div></article><article class="fd-sources"><div class="fd-section-title"><span>02</span><div><small>FEEDBACK SOURCE</small><h2>反馈来源</h2></div></div><div class="fd-source-ring"><strong>872<small>条反馈</small></strong></div><ul><li><i></i>在线客服 <b>42%</b></li><li><i></i>应用商店 <b>26%</b></li><li><i></i>用户访谈 <b>18%</b></li><li><i></i>社交媒体 <b>14%</b></li></ul><div class="fd-keywords"><span>加载失败</span><span>会员权益</span><span>找不到入口</span><span>重复扣费</span></div></article></section>
      <section class="fd-action"><div class="fd-section-title"><span>03</span><div><small>NEXT ACTION</small><h2>问题与改进行动</h2></div><button type="button">查看全部 12 项 →</button></div><div class="fd-issue-list">${issues.map(([name,status,count,tone],index)=>`<article><span class="fd-issue-num">${String(index+1).padStart(2,'0')}</span><div><h3>${name}</h3><p>${index===0?'定位优惠券确认后的状态回写，并补充失败恢复入口。':index===1?'重写权益说明与到期提示，减少用户理解成本。':index===2?'调整信息层级，在核心任务之后提供明确下载入口。':'优化召回策略并增加无结果时的推荐路径。'}</p></div><em class="${tone}">${status}</em><strong>${count}</strong><button type="button">→</button></article>`).join('')}</div></section>
    </main>
  </article>`;
}

function complianceOpsMarkup(work) {
  const nodes = [['API Gateway',13,48,'ok'],['Risk Engine',36,28,'ok'],['Identity',37,69,'warn'],['Policy Hub',61,49,'ok'],['Audit Store',84,26,'ok'],['Alert Center',84,72,'error']];
  return `<article class="local-site compliance-ops-site local-site-dark" data-anchor-root data-preview-kind="compliance-ops">
    <header class="co-nav"><div class="co-brand"><i></i><strong>CHAINWATCH</strong><span>合规链路监控</span></div><div class="co-system"><span><i></i>系统运行正常</span><b>UTC+8 · 10:42:18</b><img src="./assets/avatars/${work.owner}.jpg" alt="${safeText(work.owner)}" /></div></header>
    <main class="co-main"><section class="co-heading"><div><span>REAL-TIME OPERATIONS</span><h1>${safeText(work.title)}</h1></div><div><button type="button">过去 24 小时⌄</button><button class="primary" type="button">+ 新建检查</button></div></section>
      <section class="co-status"><article><span>整体合规率 <i class="ok"></i></span><strong>99.87<small>%</small></strong><em>↑ 0.12% / 24h</em></article><article><span>在线链路 <i class="ok"></i></span><strong>42<small>/ 42</small></strong><em>全部在线</em></article><article><span>活动告警 <i class="warn"></i></span><strong>3</strong><em class="warn">1 项需要处理</em></article><article><span>最后同步 <i class="ok"></i></span><strong>18<small>s</small></strong><em>数据延迟正常</em></article></section>
      <section class="co-grid"><article class="co-topology-card"><div class="co-panel-head"><div><span>LIVE TOPOLOGY</span><h2>链路健康状态</h2></div><div><i class="ok"></i>正常 40 <i class="warn"></i>警告 1 <i class="error"></i>异常 1</div></div><div class="co-topology"><svg viewBox="0 0 900 400" preserveAspectRatio="none" aria-hidden="true"><path d="M115 195 C210 195 200 105 325 105 M115 195 C215 195 205 275 330 275 M360 105 C455 105 440 195 545 195 M365 275 C455 275 445 195 545 195 M575 195 C685 195 675 100 755 100 M575 195 C680 195 675 285 755 285"/></svg>${nodes.map(([label,x,y,tone])=>`<button class="co-node ${tone}" style="--x:${x}%;--y:${y}%"><i></i><span>${label}</span><small>${tone==='ok'?'HEALTHY':tone==='warn'?'LATENCY':'ALERT'}</small></button>`).join('')}<div class="co-pulse" aria-hidden="true"></div></div></article><article class="co-sla"><div class="co-panel-head"><div><span>COMPLIANCE SLA</span><h2>合规检查</h2></div><em>本月</em></div><div class="co-gauge"><strong>99.87<small>%</small></strong><span>目标 99.50%</span></div><div class="co-checks"><p><i class="ok"></i><span>身份校验</span><b>100%</b></p><p><i class="ok"></i><span>策略命中</span><b>99.9%</b></p><p><i class="warn"></i><span>审计完整性</span><b>98.7%</b></p></div></article></section>
      <section class="co-bottom"><article class="co-alerts"><div class="co-panel-head"><div><span>INCIDENT STREAM</span><h2>实时告警</h2></div><button type="button">查看全部</button></div>${[['10:38:24','Alert Center','审计事件写入延迟超过 800ms','error'],['10:26:08','Identity','第三方凭证刷新接近阈值','warn'],['09:51:42','Policy Hub','策略包 v4.28 已完成同步','ok'],['09:32:19','Risk Engine','风险规则自检通过','ok']].map(([time,source,msg,tone])=>`<div class="co-alert-row"><time>${time}</time><i class="${tone}"></i><b>${source}</b><span>${msg}</span><em class="${tone}">${tone==='error'?'P1':tone==='warn'?'P2':'INFO'}</em></div>`).join('')}</article><article class="co-log"><div class="co-panel-head"><div><span>SYSTEM LOG</span><h2>检查日志</h2></div><i class="co-log-live">LIVE</i></div><code><span>10:42:17</span> policy.evaluate <b>PASS</b><br/><span>10:42:16</span> audit.commit <b>PASS</b><br/><span>10:42:14</span> identity.refresh <em>WARN</em><br/><span>10:42:12</span> route.health <b>PASS</b><br/><span>10:42:10</span> chain.snapshot <b>PASS</b></code></article></section>
    </main>
  </article>`;
}

function localWorkSiteMarkup(work) {
  const previewConfig = LOCAL_PREVIEW_CONFIG[work.coverId ?? work.id];
  const kind = localPreviewKind(work);
  const theme = previewConfig?.theme ?? workPreviewTheme(work);
  const themeClass = theme === 'dark' ? ' local-site-dark' : '';
  const seed = Number.parseInt(work.id.replace(/\D/g, '').slice(-3), 10) || 128;
  const metricA = (seed * 7 + 329).toLocaleString('zh-CN');
  const metricB = (seed * 3 + 1042).toLocaleString('zh-CN');
  const metricC = (seed % 47) + 12;

  if (kind === 'sentiment-map') return sentimentMapMarkup(work);
  if (kind === 'feedback-diagnosis') return feedbackDiagnosisMarkup(work);
  if (kind === 'compliance-ops') return complianceOpsMarkup(work);

  if (kind === 'media') {
    return `<article class="local-site local-media-site${themeClass}" data-anchor-root data-preview-kind="media">
      <header class="local-site-nav"><strong>FRAME INDEX</strong><span>${safeText(work.owner)} / 2026</span></header>
      <section class="media-intro"><span>GENERATIVE MEDIA ARCHIVE</span><h1>${safeText(work.title)}</h1><p>把生成结果按批次、风格和状态聚合，快速比较并选出可用素材。</p></section>
      <section class="media-grid">${Array.from({ length: 8 }, (_, index) => `<button type="button" class="media-tile" style="--tile-hue:${index * 32}deg"><span class="media-tile-visual"><b>${String(index + 1).padStart(2, '0')}</b><i></i><em>${['动态排版', '界面动效', '光影实验', '内容切片'][index % 4]}</em></span><span>Batch ${String(index + 1).padStart(2, '0')}</span><small>${index % 3 === 0 ? 'Ready' : 'Reviewing'}</small></button>`).join('')}</section>
    </article>`;
  }

  if (kind === 'campaign') {
    return `<article class="local-site local-campaign-site${themeClass}" data-anchor-root data-preview-kind="campaign">
      <header class="campaign-nav"><strong>popo LAB</strong><nav><a href="#story">项目</a><a href="#gallery">图集</a><a href="#about">关于</a></nav></header>
      <section class="campaign-hero"><div><span>2026 / CREATIVE EXPERIMENT</span><h1>${safeText(work.title)}</h1><p>让灵感从屏幕里浮出来，成为一段可以探索、收藏和分享的体验。</p><button type="button">开始探索 →</button></div><div class="campaign-art" aria-label="${safeText(work.title)}创意场景"><span>IDEA</span><strong>${String(metricC).padStart(2, '0')}</strong><i></i><b>EXPLORE<br />THE STORY</b></div></section>
      <section class="campaign-stats" id="story"><div><strong>${metricC}</strong><span>创意场景</span></div><div><strong>${metricA}</strong><span>参与互动</span></div><div><strong>4.9</strong><span>体验评分</span></div></section>
      <section class="campaign-story"><span>BEHIND THE WORK</span><h2>把一个简单想法，做成可以进入的世界</h2><p>页面以真实作品主题为线索，保留清晰的浏览节奏与互动入口。向下滚动可以继续查看创作过程和精选画面。</p></section>
    </article>`;
  }

  if (kind === 'editorial') {
    return `<article class="local-site local-editorial-site${themeClass}" data-anchor-root data-preview-kind="editorial">
      <header class="editorial-nav"><span>— DAILY DIGEST</span><strong>${safeText(work.owner)}</strong></header>
      <section class="editorial-hero"><h1>${safeText(work.title)}</h1><p>精选值得保存的内容，把零散信息整理成可以持续阅读的知识档案。</p><button type="button">查看今日内容 →</button></section>
      <section class="editorial-archive"><div class="archive-head"><strong>ARCHIVE</strong><span>6 issues</span></div>${['2026年8月8日', '2026年8月7日', '2026年8月6日', '2026年8月5日', '2026年8月4日'].map((date, index) => `<article><div><strong>${date}</strong><p>${safeText(work.title)} · 第 ${index + 1} 期精选内容，包含趋势观察、案例和行动建议。</p></div><span>→</span></article>`).join('')}</section>
    </article>`;
  }

  if (kind === 'board') {
    return `<article class="local-site local-board-site${themeClass}" data-anchor-root data-preview-kind="board">
      <header class="board-top"><div><span>团队工作区 / 方案</span><h1>${safeText(work.title)}</h1></div><div class="board-avatars"><img src="./assets/avatars/${work.owner}.jpg" alt="" /><span>+4</span></div></header>
      <section class="board-summary"><div><span>进行中</span><strong>${metricC}</strong></div><div><span>本周完成</span><strong>${metricC + 7}</strong></div><div><span>成员</span><strong>8</strong></div><button type="button">+ 新建任务</button></section>
      <section class="kanban-board">${[['待处理', 4], ['进行中', 3], ['待验收', 3], ['已完成', 4]].map(([title, total], column) => `<div class="kanban-column"><header><strong>${title}</strong><span>${total}</span></header>${Array.from({ length: total }, (_, index) => `<article><span class="kanban-label ${column % 2 ? 'blue' : ''}">${column % 2 ? '协作' : '产品'}</span><h3>${['梳理目标与交付范围', '完成关键路径验证', '同步设计与开发方案', '整理上线检查清单'][(index + column) % 4]}</h3><footer><img src="./assets/avatars/${work.owner}.jpg" alt="" /><span>${8 + index * 3} 条讨论</span></footer></article>`).join('')}</div>`).join('')}</section>
    </article>`;
  }

  if (kind === 'app') {
    return `<article class="local-site local-app-site${themeClass}" data-anchor-root data-preview-kind="app">
      <aside class="app-preview-sidebar"><strong>泡泡应用</strong><nav><button class="active">总览</button><button>工作台</button><button>收藏</button><button>设置</button></nav><div><img src="./assets/avatars/${work.owner}.jpg" alt="" /><span>${safeText(work.owner)}</span></div></aside>
      <section class="app-preview-main"><header><div><span>个人应用</span><h1>${safeText(work.title)}</h1></div><button type="button">新建记录</button></header><div class="app-metrics"><article><span>今日处理</span><strong>${metricC}</strong><small>+12.4%</small></article><article><span>累计记录</span><strong>${metricA}</strong><small>+8.1%</small></article><article><span>自动化任务</span><strong>18</strong><small>运行正常</small></article></div><div class="app-workspace"><section><h2>最近活动</h2>${['完成一次内容评审', '新增三条待办', '同步团队数据', '生成周度摘要'].map((item, index) => `<div class="activity-row"><i></i><div><strong>${item}</strong><span>${index + 1} 小时前</span></div><em>查看</em></div>`).join('')}</section><section><h2>进度概览</h2><div class="donut"><strong>76%</strong></div><p>本周目标完成度</p></section></div></section>
    </article>`;
  }

  const isFeedbackReport = String(work.coverId ?? work.id) === '2453';
  const reportTitle = isFeedbackReport ? '问题反馈整体报告' : safeText(work.title);
  const currentMetric = isFeedbackReport ? '872.9' : metricA;
  const previousMetric = isFeedbackReport ? '1,062.6' : metricB;
  const moduleMetric = isFeedbackReport ? 29 : metricC;
  const metricChange = isFeedbackReport ? '-189.7 / -17.85%' : '+17.85%';
  return `<article class="local-site local-report-site${themeClass}" data-anchor-root data-preview-kind="report">
    <header class="report-nav"><div><strong>INSIGHT</strong><span>数据分析中心</span></div><nav><button>概览</button><button>趋势</button><button>明细</button><img src="./assets/avatars/${work.owner}.jpg" alt="${safeText(work.owner)}" /></nav></header>
    <main class="report-main"><div class="report-heading"><div><span>${isFeedbackReport ? '自动生成报告 · 问题反馈' : '自动生成报告 · 最新数据'}</span><h1>${reportTitle}</h1><p>${isFeedbackReport ? '周均对比 · 分析周期：2026-03-30 — 2026-06-21 · 生成时间：2026-06-29 13:54:32' : '分析周期：2026-07-01 — 2026-08-08 · 更新时间 18:42'}</p></div><button type="button">导出报告</button></div><section class="executive-summary"><h2>Executive Summary</h2><ul>${isFeedbackReport ? '<li><b>问题反馈下降。</b> 本期 872.9，上期 1,062.6，变化 <em>-189.7 / -17.85%</em>。</li><li><b>最大上升模块：</b>运营活动，变化 +9。</li><li><b>最大回落模块：</b>会员，变化 -78.7。</li>' : '<li>核心指标保持稳定增长，整体表现优于上一周期。</li><li>主要增量来自高活跃模块，贡献率达到 42.8%。</li><li>建议继续关注异常波动并优化低转化路径。</li>'}</ul></section><section><h2>整体概览</h2><div class="report-metrics"><article><span>${isFeedbackReport ? '本期问题反馈' : '本期数据'}</span><strong>${currentMetric}</strong><small>${metricChange}</small></article><article><span>上一周期</span><strong>${previousMetric}</strong><small>对比基线</small></article><article><span>变化模块</span><strong>${moduleMetric}</strong><small>按绝对变化排序</small></article></div></section><section class="report-chart"><h2>整体反馈量趋势</h2><div class="bar-chart">${[62, 78, 55, 69, 49, 58, 66, 42, 71, 76, 81, 54].map((value, index) => `<i style="--bar:${value}%"><span>${620 + value * 7}</span><small>${String(index + 1).padStart(2, '0')}/08</small></i>`).join('')}</div></section><section class="module-ranking"><h2>模块变化排名</h2>${['会员', '上传下载', '账号', 'AI 搜索', '播放', '视频图片', '站长中心', '运营活动'].map((label, index) => `<div><span>${label}</span><i><b style="width:${92 - index * 8}%"></b></i><em>${index === 7 ? '+9' : `-${(78.7 - index * 8.2).toFixed(1)}`}</em></div>`).join('')}</section></main>
  </article>`;
}

function toolbarHoverBubblesMarkup() {
  return `<span class="pop-widget-hover-bubbles" aria-hidden="true">${Array.from({ length: 9 }, () => '<span><i></i></span>').join('')}</span>`;
}

function toolbarMotionIconMarkup(kind, theme) {
  const paths = {
    comment: '<path d="M17.0679 8.90276C16.7232 5.00139 13.4457 1.95134 9.4109 2.36591C5.71812 2.53189 2.73264 5.8555 2.90772 9.50252C2.98285 11.3687 3.80986 13.1272 5.20363 14.3842C5.68825 14.8189 6.35417 15.2616 6.9474 15.5381V17.7238C8.05534 17.7238 9.13006 17.6048 10.2213 17.4044C11.2107 17.1665 12.054 16.8945 12.9594 16.4117C15.7937 14.9001 17.3487 12.0797 17.0679 8.90276Z"/><path class="outline-only" d="M11.5625 11.4297C11.103 11.7871 10.0308 12.3487 8.49908 11.4297"/>',
    share: '<path fill-rule="evenodd" clip-rule="evenodd" d="M1.66683 17.0149C3.70562 14.5262 5.51612 13.114 7.09833 12.7783C8.68054 12.4425 10.187 12.3918 11.6176 12.6261V17.0832L18.3335 9.81038L11.6176 2.9165V7.15275C8.97237 7.17367 6.72358 8.12267 4.8712 9.99984C3.01879 11.877 1.9507 14.2153 1.66683 17.0149Z"/>',
    like: '<path d="M11.6448 19.1646C15.3017 19.1646 18.2662 16.2001 18.2662 12.5433C18.2662 8.88637 15.3017 5.92188 11.6448 5.92188C7.98793 5.92188 5.02344 8.88637 5.02344 12.5433C5.02344 16.2001 7.98793 19.1646 11.6448 19.1646Z"/><path class="outline-only" d="M13.0156 9C13.5543 9.06735 14.6318 9.40404 15.0358 11.0202"/><path d="M5.13389 6.25996C6.4138 6.25996 7.45137 5.22239 7.45137 3.94248C7.45137 2.66257 6.4138 1.625 5.13389 1.625C3.85398 1.625 2.81641 2.66257 2.81641 3.94248C2.81641 5.22239 3.85398 6.25996 5.13389 6.25996Z"/>',
  };
  const iconRoot = `./assets/toolbar-motion/${theme}`;
  return `<span class="pop-widget-icon-layer" aria-hidden="true"><span class="pop-widget-icon-well"></span><span class="pop-widget-icon-motion"><img class="pop-widget-base-icon" src="${iconRoot}/icon-${kind}.svg" alt="" /><svg class="pop-widget-active-icon" viewBox="0 0 20 20">${paths[kind]}</svg></span></span>`;
}

function workToolbarMarkup(work, { liked, count, commentCount, theme }) {
  const motionRoot = `./assets/toolbar-motion/${theme}`;
  return `<div class="pop-widget pop-widget-${theme}" data-toolbar-theme="${theme}" data-folded="false" data-comments-open="false">
    <div class="pop-widget-strip">
      <span class="pop-widget-glass" aria-hidden="true"></span>
      <span class="pop-widget-gradient" aria-hidden="true"></span>
      <button class="pop-widget-fold" type="button" data-widget-fold aria-label="收起操作栏" aria-expanded="true"><svg class="pop-widget-fold-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 12.5 10 7.5l5 5" /></svg></button>
      <div class="pop-widget-avatar"><button type="button" data-route="/profile/${safeText(work.owner)}"><img src="./assets/avatars/${work.owner}.jpg" alt="${safeText(work.owner)}" /></button><span title="${safeText(work.owner)}">${safeText(work.owner)}</span></div>
      <div class="pop-widget-buttons">
        <button class="pop-widget-btn pop-widget-comment" type="button" data-widget-comments data-active="false" aria-label="评论" aria-pressed="false">${toolbarHoverBubblesMarkup()}${toolbarMotionIconMarkup('comment', theme)}<span class="pop-widget-badge" data-comment-count>${commentCount > 99 ? '99+' : commentCount}</span></button>
        <div class="pop-widget-share-wrap"><button class="pop-widget-btn pop-widget-share" type="button" data-widget-share data-active="false" aria-label="分享" aria-pressed="false">${toolbarHoverBubblesMarkup()}${toolbarMotionIconMarkup('share', theme)}</button><div class="pop-widget-share-menu" hidden><button type="button" data-widget-copy="${work.id}"><span>⌁</span>复制链接</button><button type="button" data-widget-infoflow><img src="./assets/sidebar/icon-infoflow.png" alt="" />分享到如流</button></div></div>
        <button class="pop-widget-btn pop-widget-like ${liked ? 'liked' : ''}" type="button" data-widget-like="${work.id}" data-active="${liked}" aria-label="点赞" aria-pressed="${liked}">${toolbarHoverBubblesMarkup()}${toolbarMotionIconMarkup('like', theme)}<span class="pop-widget-badge" data-widget-like-count>${count}</span></button>
      </div>
      <div class="pop-widget-divider"></div>
      <button class="pop-widget-home" type="button" data-route="/" data-widget-home aria-label="回泡泡"><img src="${motionRoot}/assistant.svg" alt="" /><span class="pop-widget-assistant-bubbles" aria-hidden="true"></span></button>
    </div>
    <button class="pop-widget-folded" type="button" data-widget-unfold aria-label="展开操作栏" tabindex="-1"><span class="pop-widget-folded-visual" aria-hidden="true"><img class="pop-widget-folded-underlay" src="${motionRoot}/collapse-figma.svg?v=20260809q" alt="" /><span class="pop-widget-folded-glass"></span><span class="pop-widget-folded-gradient"></span><svg class="pop-widget-folded-icon" viewBox="0 0 20 20"><path d="M5 8 10 13 15 8" /></svg></span></button>
  </div>`;
}

function workCommentsMarkup(work, total) {
  const anchorComments = getDemoAnchorComments(work.id);
  const workComments = getDemoWorkComments(work.id);
  const showTabs = anchorComments.length > 0;
  const activeTab = showTabs ? demoCommentUi.tab : 'work';
  return `<div class="pop-c-confirm-mask" data-comment-confirm hidden>
    <div class="pop-c-confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="commentDeleteTitle" data-comment-confirm-card>
      <div class="pop-c-confirm-head"><img class="pop-c-confirm-icon" src="./assets/sidebar/icon-warning.svg" width="20" height="20" alt="" /><span class="pop-c-confirm-title" id="commentDeleteTitle">确认删除此评论？</span></div>
      <div class="pop-c-confirm-foot"><button class="pop-c-confirm-cancel" type="button" data-comment-delete-cancel>取消</button><button class="pop-c-confirm-ok" type="button" data-comment-delete-confirm>确认</button></div>
    </div>
  </div>
  <aside class="work-comments-drawer" data-comments-drawer data-open="false" hidden>
    <img class="pop-c-logo" src="./assets/sidebar/comment-logo.png" alt="" aria-hidden="true" />
    <header class="pop-c-header${showTabs ? ' tabs-centered' : ''}">
      <div class="pop-c-count" data-comment-count-title${showTabs ? ' hidden' : ''}>共 <b data-drawer-comment-count>${total}</b> 条评论</div>
      <div class="pop-c-tabs" data-comment-tabs${showTabs ? '' : ' hidden'} role="tablist" aria-label="评论分类">
        <button class="pop-c-tab${activeTab === 'anchor' ? ' active' : ''}" type="button" data-comment-tab="anchor">锚点评论 <span data-anchor-comment-count>${anchorComments.length}</span></button>
        <button class="pop-c-tab${activeTab === 'work' ? ' active' : ''}" type="button" data-comment-tab="work">整体评论 <span data-work-comment-count>${workComments.length}</span></button>
      </div>
      <button class="pop-c-close" type="button" data-close-comments aria-label="关闭"><img src="./assets/sidebar/icon-close.svg" width="16" height="16" alt="" /></button>
    </header>
    <div class="pop-c-list" data-comments-list>
      <div class="pop-c-view" data-comment-view="anchor"${activeTab === 'anchor' ? '' : ' hidden'}>${anchorCommentsMarkup(anchorComments)}</div>
      <div class="pop-c-view" data-comment-view="work"${activeTab === 'work' ? '' : ' hidden'}>${workCommentListMarkup(workComments)}</div>
    </div>
    <footer class="pop-c-input collapsed" data-comment-composer>
      <img class="pop-c-input-glow" src="./assets/sidebar/comment-input-glow.png" alt="" aria-hidden="true" />
      <div class="pop-c-ctx pop-c-ctx-anchor" data-anchor-comment-context hidden><span class="pop-c-ctx-txt" data-anchor-context-text></span><button class="pop-c-ctx-cancel" type="button" data-anchor-cancel aria-label="取消锚点"><img src="./assets/sidebar/icon-comment-anchor-cancel.svg" width="12" height="12" alt="" /></button></div>
      <div class="pop-c-ctx pop-c-ctx-reply" data-reply-comment-context hidden><span class="pop-c-ctx-label">回复</span><span class="pop-c-ctx-name" data-reply-context-name></span><span class="pop-c-ctx-txt" data-reply-context-text></span></div>
      <textarea class="pop-c-textarea" data-comment-input maxlength="2000" placeholder="来评论区冒个泡吧"></textarea>
      <div class="pop-c-actions">
        <button class="pop-c-cancel" type="button" data-comment-cancel>取消</button>
        <span class="pop-c-send-wrap"><button class="pop-c-send" type="button" data-submit-comment data-work="${work.id}" disabled>发送</button><img class="pop-c-send-arc tl" src="./assets/sidebar/send-arc-tl.png" alt="" aria-hidden="true" /><img class="pop-c-send-arc br" src="./assets/sidebar/send-arc-br.png" alt="" aria-hidden="true" /></span>
      </div>
    </footer>
  </aside>`;
}

function demoCommentStorageKey(workId) {
  return `popo:demo-comments:${DEMO_COMMENT_STORAGE_VERSION}:${workId}`;
}

function demoCommentSeed(work) {
  return [...`${work.id}:${work.title}`].reduce(
    (total, character, index) => (total + character.charCodeAt(0) * (index + 1)) % 997,
    0,
  );
}

function demoCommentProfile(username) {
  return DEMO_COMMENT_PROFILES.find((profile) => profile.username === username)
    ?? { username, avatar: `./assets/avatars/${username}.jpg` };
}

function demoAnchorTexts(work) {
  const kind = LOCAL_PREVIEW_CONFIG[work.id]?.kind ?? 'report';
  const secondary = {
    report: 'Executive Summary',
    'sentiment-map': '城市热点分布',
    'feedback-diagnosis': '问题严重度矩阵',
    'compliance-ops': '链路健康状态',
    media: 'GENERATIVE MEDIA ARCHIVE',
    campaign: '开始探索 →',
    board: '团队工作区 / 方案',
    app: '泡泡应用',
    editorial: 'ARCHIVE',
  }[kind];
  return [work.title, secondary];
}

function makeDemoStoredAnchor(exact) {
  return { exact, prefix: '', suffix: '', start: -1, end: -1 };
}

function makeDemoReply(work, thread, seed, replyIndex) {
  const previous = thread.replies[replyIndex - 1];
  const author = replyIndex === 0
    ? demoCommentProfile(work.owner)
    : DEMO_COMMENT_PROFILES[(seed + replyIndex * 5) % DEMO_COMMENT_PROFILES.length];
  return {
    id: `seed-${work.id}-reply-${thread.id}-${replyIndex}`,
    author: author.username,
    avatar: author.avatar,
    body: DEMO_REPLY_TEXTS[(seed + replyIndex) % DEMO_REPLY_TEXTS.length],
    time: replyIndex === 0 ? '18 分钟前' : '刚刚',
    replyToName: previous?.author ?? thread.author,
    canDelete: author.username === demoUser.username,
    deleted: false,
  };
}

function makeDemoThread(work, type, index, seed) {
  const kind = LOCAL_PREVIEW_CONFIG[work.id]?.kind ?? 'report';
  const texts = type === 'anchor'
    ? [
        '这里是理解结论的关键，建议把依据再写得具体一点。',
        '这段信息很有帮助，定位到原文后讨论效率高很多。',
        '这里的表述和下方数据能够对应上，阅读体验不错。',
      ]
    : (DEMO_COMMENT_TEXTS[kind] ?? DEMO_COMMENT_TEXTS.report);
  const author = index === 0 && seed % 2 === 0
    ? demoCommentProfile(demoUser.username)
    : DEMO_COMMENT_PROFILES[(seed + index * 3 + (type === 'anchor' ? 2 : 0)) % DEMO_COMMENT_PROFILES.length];
  const thread = {
    id: `seed-${work.id}-${type}-${index}`,
    author: author.username,
    avatar: author.avatar,
    body: texts[(seed + index) % texts.length],
    time: DEMO_COMMENT_TIMES[index % DEMO_COMMENT_TIMES.length],
    anchor: null,
    canDelete: author.username === demoUser.username,
    deleted: false,
    replies: [],
  };

  if (type === 'anchor') {
    const anchorTexts = demoAnchorTexts(work);
    const shouldBeOrphan = index === 0 && seed % 5 === 0;
    thread.anchor = makeDemoStoredAnchor(
      shouldBeOrphan ? `旧版中的「${work.title}」指标说明` : anchorTexts[index % anchorTexts.length],
    );
  }

  const replyCount = (seed + index * 3 + (type === 'anchor' ? 1 : 0)) % 4 === 0
    ? 2
    : ((seed + index) % 3 === 0 ? 1 : 0);
  for (let replyIndex = 0; replyIndex < replyCount; replyIndex += 1) {
    thread.replies.push(makeDemoReply(work, thread, seed + index, replyIndex));
  }
  thread.replyCount = thread.replies.length;
  return thread;
}

function generateDemoComments(work) {
  if (DEMO_EMPTY_COMMENT_WORKS.has(work.id)) return { work: [], anchor: [] };
  const seed = demoCommentSeed(work);
  const workCount = 1 + (seed % 4);
  const anchorCount = seed % 3 === 0 ? 2 : seed % 2;
  const workComments = Array.from({ length: workCount }, (_, index) => makeDemoThread(work, 'work', index, seed));
  const anchorComments = Array.from({ length: anchorCount }, (_, index) => makeDemoThread(work, 'anchor', index, seed + 7));

  if (seed % 5 === 0 && workComments.length > 0) {
    const deletedParent = workComments[workComments.length - 1];
    if (deletedParent.replies.length === 0) {
      deletedParent.replies.push(makeDemoReply(work, deletedParent, seed + 11, 0));
    }
    deletedParent.deleted = true;
    deletedParent.body = '';
    deletedParent.canDelete = false;
    deletedParent.replyCount = deletedParent.replies.length;
  }

  return { work: workComments, anchor: anchorComments };
}

function persistDemoComments(workId) {
  const key = String(workId);
  try {
    window.localStorage.setItem(
      demoCommentStorageKey(key),
      JSON.stringify({ work: demoWorkCommentsByWork.get(key) ?? [], anchor: demoAnchorCommentsByWork.get(key) ?? [] }),
    );
  } catch {}
}

function ensureDemoComments(workId) {
  const key = String(workId);
  if (demoWorkCommentsByWork.has(key) && demoAnchorCommentsByWork.has(key)) return;
  let stored = null;
  try { stored = JSON.parse(window.localStorage.getItem(demoCommentStorageKey(key)) || 'null'); } catch {}
  if (stored && Array.isArray(stored.work) && Array.isArray(stored.anchor)) {
    demoWorkCommentsByWork.set(key, stored.work);
    demoAnchorCommentsByWork.set(key, stored.anchor);
    return;
  }
  const work = demoWorks.find((item) => item.id === key);
  const generated = work ? generateDemoComments(work) : { work: [], anchor: [] };
  demoWorkCommentsByWork.set(key, generated.work);
  demoAnchorCommentsByWork.set(key, generated.anchor);
  persistDemoComments(key);
}

function getDemoWorkComments(workId) {
  const key = String(workId);
  ensureDemoComments(key);
  return demoWorkCommentsByWork.get(key);
}

function getDemoAnchorComments(workId) {
  const key = String(workId);
  ensureDemoComments(key);
  return demoAnchorCommentsByWork.get(key);
}

function countDemoComments(workId) {
  ensureDemoComments(workId);
  return getDemoWorkComments(workId).length + getDemoAnchorComments(workId).length;
}

function demoMoreMenuMarkup(threadId, replyId = '') {
  return `<div class="pop-c-more" data-comment-more-wrap><button class="pop-c-more-btn" type="button" data-comment-more aria-label="更多"><img src="./assets/sidebar/icon-more.svg" width="20" height="20" alt="" /></button><div class="pop-c-menu"><button class="pop-c-menu-item pop-c-menu-del" type="button" data-delete-comment data-thread-id="${threadId}"${replyId ? ` data-reply-id="${replyId}"` : ''}><img class="pop-c-menu-icon" src="./assets/sidebar/icon-delete.svg" width="16" height="16" alt="" />删除</button></div></div>`;
}

function demoReplyButtonMarkup(threadId, targetId, targetName, targetBody) {
  return `<button class="pop-c-reply-btn" type="button" data-comment-reply data-thread-id="${threadId}" data-target-id="${targetId}" data-target-name="${safeText(targetName)}" data-target-body="${safeText(targetBody)}"><img class="pop-c-reply-icon" src="./assets/sidebar/icon-comment-reply.svg" width="20" height="20" alt="" /><span>回复</span></button>`;
}

function demoReplyMarkup(thread, reply, { orphan = false } = {}) {
  const replyTo = reply.replyToName ? `<span class="pop-c-reply-to"> 回复 ${safeText(reply.replyToName)}</span>` : '';
  const replyButton = orphan ? '' : demoReplyButtonMarkup(thread.id, reply.id, reply.author, reply.body);
  return `<div class="pop-c-reply" data-comment-reply-item="${reply.id}"><img class="pop-c-avatar" src="${reply.avatar}" alt="" width="32" height="32" /><div class="pop-c-main"><div class="pop-c-namerow"><span class="pop-c-name">${safeText(reply.author)}${replyTo}</span>${reply.canDelete && !reply.deleted ? demoMoreMenuMarkup(thread.id, reply.id) : ''}</div>${reply.deleted ? '<div class="pop-c-deleted">该评论已删除</div>' : `<div class="pop-c-body">${safeText(reply.body)}</div><div class="pop-c-foot">${replyButton}<span class="pop-c-time">${safeText(reply.time)}</span></div>`}</div></div>`;
}

function demoCommentMarkup(comment, { orphan = false } = {}) {
  const selected = demoCommentUi.selectedId === comment.id;
  const expanded = demoCommentUi.expandedIds.has(comment.id);
  const folded = comment.replies.length > 1 && !expanded;
  const shownReplies = folded ? comment.replies.slice(0, 1) : comment.replies;
  const quoteText = comment.anchor ? `${orphan ? '原文已改动 “' : '“'}${safeText(comment.anchor.exact)}”` : '';
  const quote = comment.anchor ? (orphan ? `<div class="pop-c-quote orphan"><span class="pop-c-quote-txt">${quoteText}</span></div>` : `<button class="pop-c-quote${selected ? ' selected' : ''}" type="button" data-anchor-jump="${comment.id}"><span class="pop-c-quote-txt">${quoteText}</span></button>`) : '';
  const more = comment.canDelete && !comment.deleted ? demoMoreMenuMarkup(comment.id) : '';
  const replyButton = orphan ? '' : demoReplyButtonMarkup(comment.id, comment.id, comment.author, comment.body);
  const content = `${quote}${comment.deleted ? '<div class="pop-c-deleted">该评论已删除</div>' : `<div class="pop-c-body">${safeText(comment.body)}</div><div class="pop-c-foot">${replyButton}<span class="pop-c-time">${safeText(comment.time)}</span></div>`}`;
  const replies = comment.replies.length > 0 ? `<div class="pop-c-replies">${shownReplies.map((reply) => demoReplyMarkup(comment, reply, { orphan })).join('')}${comment.replies.length > 1 ? `<button class="pop-c-expand${expanded ? ' is-expanded' : ''}" type="button" data-comment-expand="${comment.id}"><span>${folded ? `展开 ${comment.replies.length - 1} 条回复` : '收起'}</span><i class="pop-c-expand-icon${folded ? '' : ' up'}" aria-hidden="true"></i></button>` : ''}</div>` : '';
  return `<article class="pop-c-item${orphan ? ' orphan' : ''}" data-comment-thread="${comment.id}"><img class="pop-c-avatar" src="${comment.avatar}" alt="" width="32" height="32" /><div class="pop-c-main"><div class="pop-c-namerow"><span class="pop-c-name">${safeText(comment.author)}</span>${more}</div>${content}${replies}</div></article>`;
}

function anchorCommentsMarkup(comments) {
  if (comments.length === 0) {
    return `<div class="pop-c-empty"><img class="pop-c-empty-img" src="./assets/sidebar/comment-empty.png" alt="" /><div class="pop-c-empty-text">还没有锚点评论，选中正文里的文字来发表第一条吧</div></div>`;
  }
  const active = comments.filter((comment) => !demoCommentUi.orphanIds.has(comment.id));
  const orphan = comments.filter((comment) => demoCommentUi.orphanIds.has(comment.id));
  return `${active.map((comment) => demoCommentMarkup(comment)).join('')}${orphan.length ? `<div class="pop-c-group-title">原文已改动 · ${orphan.length} 条（无法在页面定位）</div>${orphan.map((comment) => demoCommentMarkup(comment, { orphan: true })).join('')}` : ''}`;
}

function workCommentListMarkup(comments) {
  if (comments.length === 0) {
    return `<div class="pop-c-empty"><img class="pop-c-empty-img" src="./assets/sidebar/comment-empty.png" alt="" /><div class="pop-c-empty-text">还没有评论，来冒个泡吧</div></div>`;
  }
  return comments.map((comment) => demoCommentMarkup(comment)).join('');
}

function findDemoCommentThread(threadId) {
  return [...getDemoWorkComments(demoCommentUi.workId), ...getDemoAnchorComments(demoCommentUi.workId)].find((comment) => comment.id === threadId) ?? null;
}

function demoAnchorRoot() {
  return document.querySelector('.work-browser-page [data-anchor-root]');
}

function clearDemoAnchorBubble() {
  document.querySelector('[data-anchor-comment-bubble]')?.remove();
}

function clearDemoAnchorHoverTip() {
  document.querySelector('[data-anchor-hover-tip]')?.remove();
}

function clearDemoAnchorHighlights() {
  const root = demoAnchorRoot();
  if (!root) return;
  root.querySelectorAll('mark.pop-hl').forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });
}

function cleanupDemoAnchorCommentUi() {
  window.clearTimeout(demoCommentUi.loadTimer);
  clearDemoAnchorBubble();
  clearDemoAnchorHoverTip();
  clearDemoAnchorHighlights();
  demoCommentUi.workId = null;
  demoCommentUi.tab = 'work';
  demoCommentUi.loading = false;
  demoCommentUi.loaded = false;
  demoCommentUi.sending = false;
  demoCommentUi.loadTimer = 0;
  demoCommentUi.pendingAnchor = null;
  demoCommentUi.replyTarget = null;
  demoCommentUi.selectedId = null;
  demoCommentUi.orphanIds.clear();
  demoCommentUi.expandedIds.clear();
  demoCommentUi.deleteTarget = null;
}

function demoRangeOffsets(root, range) {
  const before = document.createRange();
  before.selectNodeContents(root);
  before.setEnd(range.startContainer, range.startOffset);
  const start = before.toString().length;
  return { start, end: start + range.toString().length };
}

function buildDemoCommentAnchor(root, range) {
  const exact = range.toString();
  if (!exact.trim() || exact.length > 2000) return null;
  const { start, end } = demoRangeOffsets(root, range);
  const text = root.textContent ?? '';
  return {
    exact,
    prefix: text.slice(Math.max(0, start - 32), start),
    suffix: text.slice(end, end + 32),
    start,
    end,
  };
}

function locateDemoCommentAnchor(root, anchor) {
  const text = root.textContent ?? '';
  if (!anchor.exact) return null;
  if (text.slice(anchor.start, anchor.end) === anchor.exact) {
    return { start: anchor.start, end: anchor.end };
  }
  const hits = [];
  for (let index = text.indexOf(anchor.exact); index >= 0; index = text.indexOf(anchor.exact, index + 1)) {
    hits.push(index);
  }
  if (hits.length === 0) return null;
  if (hits.length === 1) return { start: hits[0], end: hits[0] + anchor.exact.length };

  let best = hits[0];
  let bestScore = -1;
  hits.forEach((hit) => {
    let score = 0;
    if (anchor.prefix && text.slice(Math.max(0, hit - anchor.prefix.length), hit).endsWith(anchor.prefix)) score += 2;
    if (anchor.suffix && text.slice(hit + anchor.exact.length, hit + anchor.exact.length + anchor.suffix.length).startsWith(anchor.suffix)) score += 2;
    if (score > bestScore) {
      best = hit;
      bestScore = score;
    }
  });
  return { start: best, end: best + anchor.exact.length };
}

function wrapDemoAnchorOffsets(root, start, end, commentId) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const hits = [];
  let offset = 0;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const length = node.nodeValue?.length ?? 0;
    const nodeEnd = offset + length;
    if (nodeEnd > start && offset < end) {
      hits.push({ node, start: Math.max(0, start - offset), end: Math.min(length, end - offset) });
    }
    offset = nodeEnd;
  }
  hits.reverse().forEach((hit) => {
    const range = document.createRange();
    range.setStart(hit.node, hit.start);
    range.setEnd(hit.node, hit.end);
    const mark = document.createElement('mark');
    mark.className = `pop-hl${demoCommentUi.selectedId === commentId ? ' is-active' : ''}`;
    mark.dataset.popCid = commentId;
    try { range.surroundContents(mark); } catch {}
  });
}

function renderDemoAnchorHighlights() {
  clearDemoAnchorHighlights();
  const drawer = document.querySelector('[data-comments-drawer]');
  const root = demoAnchorRoot();
  if (!root || !drawer || drawer.dataset.open !== 'true') return;
  const items = getDemoAnchorComments(demoCommentUi.workId)
    .filter((comment) => !comment.deleted && comment.anchor)
    .map((comment) => ({ id: comment.id, anchor: comment.anchor }));
  if (demoCommentUi.pendingAnchor) items.push({ id: '__pop_pending_hl', anchor: demoCommentUi.pendingAnchor });
  items.forEach((item) => {
    const offsets = locateDemoCommentAnchor(root, item.anchor);
    if (offsets) wrapDemoAnchorOffsets(root, offsets.start, offsets.end, item.id);
  });
}

function updateDemoCommentTotal() {
  if (!demoCommentUi.workId) return;
  const nextTotal = countDemoComments(demoCommentUi.workId);
  demoCommentTotalsByWork.set(demoCommentUi.workId, nextTotal);
  persistDemoComments(demoCommentUi.workId);
  document.querySelectorAll('[data-comment-count]').forEach((element) => {
    element.textContent = nextTotal > 99 ? '99+' : String(nextTotal);
  });
  document.querySelectorAll('[data-drawer-comment-count]').forEach((element) => {
    element.textContent = String(nextTotal);
  });
  return nextTotal;
}

function updateDemoCommentsPanel() {
  const drawer = document.querySelector('[data-comments-drawer]');
  if (!drawer || !demoCommentUi.workId) return;
  const comments = getDemoAnchorComments(demoCommentUi.workId);
  const workComments = getDemoWorkComments(demoCommentUi.workId);
  const anchorRoot = demoAnchorRoot();
  demoCommentUi.orphanIds.clear();
  comments.forEach((comment) => {
    if (!anchorRoot || !locateDemoCommentAnchor(anchorRoot, comment.anchor)) demoCommentUi.orphanIds.add(comment.id);
  });
  const showTabs = Boolean(demoCommentUi.pendingAnchor) || (!demoCommentUi.loading && comments.length > 0);
  if (!showTabs) demoCommentUi.tab = 'work';

  const header = drawer.querySelector('.pop-c-header');
  header.classList.toggle('tabs-centered', showTabs);
  drawer.querySelector('[data-comment-count-title]').hidden = showTabs;
  drawer.querySelector('[data-comment-tabs]').hidden = !showTabs;
  drawer.querySelector('[data-anchor-comment-count]').textContent = String(comments.length);
  drawer.querySelector('[data-work-comment-count]').textContent = String(workComments.length);
  drawer.querySelectorAll('[data-comment-tab]').forEach((button) => {
    button.classList.toggle('active', button.dataset.commentTab === demoCommentUi.tab);
  });
  drawer.querySelectorAll('[data-comment-view]').forEach((view) => {
    view.hidden = view.dataset.commentView !== demoCommentUi.tab;
  });
  const loadingMarkup = '<div class="pop-c-empty">加载中…</div>';
  drawer.querySelector('[data-comment-view="anchor"]').innerHTML = demoCommentUi.loading
    ? loadingMarkup
    : anchorCommentsMarkup(comments);
  drawer.querySelector('[data-comment-view="work"]').innerHTML = demoCommentUi.loading
    ? loadingMarkup
    : workCommentListMarkup(workComments);

  const composer = drawer.querySelector('[data-comment-composer]');
  const anchorContext = drawer.querySelector('[data-anchor-comment-context]');
  const replyContext = drawer.querySelector('[data-reply-comment-context]');
  const input = drawer.querySelector('[data-comment-input]');
  if (demoCommentUi.pendingAnchor) {
    anchorContext.hidden = false;
    replyContext.hidden = true;
    anchorContext.querySelector('[data-anchor-context-text]').textContent = demoCommentUi.pendingAnchor.exact;
    composer.classList.add('composing');
    composer.classList.remove('collapsed');
    input.placeholder = '写下你的评论…';
  } else if (demoCommentUi.replyTarget) {
    anchorContext.hidden = true;
    replyContext.hidden = false;
    replyContext.querySelector('[data-reply-context-name]').textContent = demoCommentUi.replyTarget.name;
    replyContext.querySelector('[data-reply-context-text]').textContent = `“${demoCommentUi.replyTarget.body}”`;
    composer.classList.add('composing');
    composer.classList.remove('collapsed');
    input.placeholder = `回复 @${demoCommentUi.replyTarget.name}…`;
  } else {
    anchorContext.hidden = true;
    replyContext.hidden = true;
    composer.classList.remove('composing');
    input.placeholder = '来评论区冒个泡吧';
  }
  drawer.querySelector('[data-submit-comment]').disabled = demoCommentUi.sending || !input.value.trim();
  const activeComments = demoCommentUi.tab === 'anchor' ? comments : workComments;
  drawer.classList.toggle('empty', !demoCommentUi.loading && activeComments.length === 0);
  drawer.setAttribute('aria-busy', String(demoCommentUi.loading));
  window.requestAnimationFrame(renderDemoAnchorHighlights);
}

function openDemoCommentsPanel(tab = null) {
  const drawer = document.querySelector('[data-comments-drawer]');
  if (!drawer) return;
  if (tab) demoCommentUi.tab = tab;
  const widget = document.querySelector('.pop-widget');
  const commentButton = widget?.querySelector('[data-widget-comments]');
  if (commentButton) setWidgetActionActive(commentButton, true);
  drawer.hidden = false;
  if (!demoCommentUi.loaded && !demoCommentUi.loading) {
    demoCommentUi.loading = true;
    const loadingWorkId = demoCommentUi.workId;
    demoCommentUi.loadTimer = window.setTimeout(() => {
      if (demoCommentUi.workId !== loadingWorkId) return;
      demoCommentUi.loading = false;
      demoCommentUi.loaded = true;
      demoCommentUi.loadTimer = 0;
      if (!demoCommentUi.pendingAnchor) {
        demoCommentUi.tab = getDemoAnchorComments(loadingWorkId).length > 0 ? 'anchor' : 'work';
      }
      updateDemoCommentsPanel();
    }, 260);
  }
  updateDemoCommentsPanel();
  window.requestAnimationFrame(() => {
    drawer.dataset.open = 'true';
    if (widget) widget.dataset.commentsOpen = 'true';
    renderDemoAnchorHighlights();
  });
}

function closeDemoCommentsPanel() {
  const drawer = document.querySelector('[data-comments-drawer]');
  if (!drawer) return;
  drawer.dataset.open = 'false';
  window.setTimeout(() => {
    if (drawer.dataset.open === 'false') drawer.hidden = true;
  }, 280);
  const widget = document.querySelector('.pop-widget');
  if (widget) {
    widget.dataset.commentsOpen = 'false';
    setWidgetActionActive(widget.querySelector('[data-widget-comments]'), false);
  }
  demoCommentUi.selectedId = null;
  demoCommentUi.deleteTarget = null;
  document.querySelector('[data-comment-confirm]')?.setAttribute('hidden', '');
  document.querySelectorAll('[data-comment-more-wrap][data-open="true"]').forEach((menu) => menu.removeAttribute('data-open'));
  clearDemoAnchorHoverTip();
  clearDemoAnchorHighlights();
}

function isDemoAnchorCommentMobile() {
  if (typeof navigator.userAgentData?.mobile === 'boolean') return navigator.userAgentData.mobile;
  return /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent);
}

function showDemoAnchorBubble(anchor, selectionRect) {
  clearDemoAnchorBubble();
  const bubble = document.createElement('button');
  bubble.type = 'button';
  bubble.className = 'pop-c-bubble';
  bubble.dataset.anchorCommentBubble = 'true';
  bubble.innerHTML = '<img class="pop-c-bubble-icon" src="./assets/sidebar/icon-comment-bubble.svg" width="20" height="20" alt="" />评论';
  bubble._anchor = anchor;
  bubble.style.left = `${selectionRect.left + selectionRect.width / 2}px`;
  bubble.style.top = `${selectionRect.top - 12}px`;
  document.body.appendChild(bubble);
}

function handleDemoAnchorSelection(event) {
  if (isDemoAnchorCommentMobile() || !demoCommentUi.workId) return;
  if (event.target.closest('[data-comments-drawer], .pop-widget, [data-anchor-comment-bubble]')) return;
  if (event.target.closest('mark.pop-hl')) return;
  const selection = window.getSelection();
  const root = demoAnchorRoot();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0 || !root) {
    clearDemoAnchorBubble();
    return;
  }
  const range = selection.getRangeAt(0);
  const startNode = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer;
  const endNode = range.endContainer.nodeType === Node.TEXT_NODE ? range.endContainer.parentNode : range.endContainer;
  if (!root.contains(startNode) || !root.contains(endNode)) {
    clearDemoAnchorBubble();
    return;
  }
  const anchor = buildDemoCommentAnchor(root, range);
  if (!anchor) {
    clearDemoAnchorBubble();
    return;
  }
  showDemoAnchorBubble(anchor, range.getBoundingClientRect());
}

function startDemoAnchorComment(anchor) {
  demoCommentUi.pendingAnchor = anchor;
  demoCommentUi.replyTarget = null;
  demoCommentUi.selectedId = null;
  demoCommentUi.tab = 'anchor';
  clearDemoAnchorBubble();
  window.getSelection()?.removeAllRanges();
  openDemoCommentsPanel('anchor');
  window.setTimeout(() => document.querySelector('[data-comment-input]')?.focus(), 80);
}

function cancelDemoAnchorComment({ collapse = false } = {}) {
  demoCommentUi.pendingAnchor = null;
  demoCommentUi.replyTarget = null;
  demoCommentUi.selectedId = null;
  demoCommentUi.tab = 'work';
  const input = document.querySelector('[data-comment-input]');
  if (input) input.value = '';
  updateDemoCommentsPanel();
  const composer = document.querySelector('[data-comment-composer]');
  composer?.classList.toggle('collapsed', collapse);
  if (!collapse) window.setTimeout(() => input?.focus(), 0);
}

function cancelDemoCommentCompose({ collapse = true } = {}) {
  demoCommentUi.pendingAnchor = null;
  demoCommentUi.replyTarget = null;
  const input = document.querySelector('[data-comment-input]');
  if (input) input.value = '';
  updateDemoCommentsPanel();
  const composer = document.querySelector('[data-comment-composer]');
  composer?.classList.toggle('collapsed', collapse);
  composer?.querySelector('[data-submit-comment]')?.setAttribute('disabled', '');
}

function startDemoReply(button) {
  demoCommentUi.pendingAnchor = null;
  demoCommentUi.replyTarget = {
    threadId: button.dataset.threadId,
    targetId: button.dataset.targetId,
    name: button.dataset.targetName,
    body: button.dataset.targetBody,
  };
  const input = document.querySelector('[data-comment-input]');
  if (input) input.value = '';
  updateDemoCommentsPanel();
  window.setTimeout(() => input?.focus(), 0);
}

function toggleDemoReplies(threadId) {
  if (demoCommentUi.expandedIds.has(threadId)) demoCommentUi.expandedIds.delete(threadId);
  else demoCommentUi.expandedIds.add(threadId);
  updateDemoCommentsPanel();
}

function showDemoDeleteConfirm(threadId, replyId = null) {
  demoCommentUi.deleteTarget = { threadId, replyId };
  const mask = document.querySelector('[data-comment-confirm]');
  if (mask) mask.hidden = false;
}

function hideDemoDeleteConfirm() {
  demoCommentUi.deleteTarget = null;
  const mask = document.querySelector('[data-comment-confirm]');
  if (mask) mask.hidden = true;
}

function deleteDemoCommentTarget() {
  const target = demoCommentUi.deleteTarget;
  if (!target) return;
  const workComments = getDemoWorkComments(demoCommentUi.workId);
  const anchorComments = getDemoAnchorComments(demoCommentUi.workId);
  const list = [workComments, anchorComments].find((items) => items.some((comment) => comment.id === target.threadId));
  const thread = list?.find((comment) => comment.id === target.threadId);
  if (!list || !thread) {
    hideDemoDeleteConfirm();
    return;
  }

  if (target.replyId) {
    thread.replies = thread.replies.filter((reply) => reply.id !== target.replyId);
    thread.replyCount = thread.replies.length;
    if (thread.deleted && thread.replies.length === 0) list.splice(list.indexOf(thread), 1);
  } else if (thread.replies.length > 0) {
    thread.deleted = true;
    thread.body = '';
    thread.canDelete = false;
  } else {
    list.splice(list.indexOf(thread), 1);
  }
  updateDemoCommentTotal();
  hideDemoDeleteConfirm();
  updateDemoCommentsPanel();
  showToast('评论已删除');
}

function publishDemoComment(submitButton) {
  const input = document.querySelector('[data-comment-input]');
  const body = input?.value.trim() ?? '';
  const workId = demoCommentUi.workId;
  if (!input || !body || !workId || demoCommentUi.sending) return;
  const pendingAnchor = demoCommentUi.pendingAnchor;
  const replyTarget = demoCommentUi.replyTarget;
  demoCommentUi.sending = true;
  submitButton.disabled = true;
  updateDemoCommentsPanel();

  window.setTimeout(() => {
    if (demoCommentUi.workId !== workId) return;
    if (replyTarget) {
      const thread = findDemoCommentThread(replyTarget.threadId);
      if (!thread || (thread.deleted && replyTarget.targetId === replyTarget.threadId)) {
        demoCommentUi.sending = false;
        updateDemoCommentsPanel();
        return;
      }
      thread.replies.push({
        id: `demo-${workId}-reply-${Date.now()}-${++demoReplySequence}`,
        author: demoUser.username,
        avatar: demoUser.avatar,
        body,
        time: '刚刚',
        replyToName: replyTarget.name,
        canDelete: true,
        deleted: false,
      });
      thread.replyCount = thread.replies.length;
      demoCommentUi.expandedIds.add(thread.id);
      demoCommentUi.replyTarget = null;
      demoCommentUi.sending = false;
      input.value = '';
      input.closest('[data-comment-composer]').classList.add('collapsed');
      updateDemoCommentTotal();
      updateDemoCommentsPanel();
      showToast('回复已发布');
      return;
    }

    if (pendingAnchor) {
      getDemoAnchorComments(workId).unshift({
        id: `demo-${workId}-anchor-${Date.now()}-${++demoAnchorCommentSequence}`,
        anchor: pendingAnchor,
        body,
        author: demoUser.username,
        avatar: demoUser.avatar,
        time: '刚刚',
        canDelete: true,
        deleted: false,
        replies: [],
        replyCount: 0,
      });
      demoCommentUi.pendingAnchor = null;
      demoCommentUi.tab = 'anchor';
      demoCommentUi.selectedId = null;
      demoCommentUi.sending = false;
      input.value = '';
      input.closest('[data-comment-composer]').classList.add('collapsed');
      updateDemoCommentTotal();
      updateDemoCommentsPanel();
      showToast('锚点评论已发布');
      return;
    }

    getDemoWorkComments(workId).unshift({
      id: `demo-${workId}-work-${Date.now()}-${++demoWorkCommentSequence}`,
      author: demoUser.username,
      avatar: demoUser.avatar,
      body,
      time: '刚刚',
      anchor: null,
      canDelete: true,
      deleted: false,
      replies: [],
      replyCount: 0,
    });
    // 与源码的整体评论提交流程一致：发布成功后切到整体评论 Tab，展示刚发布的评论。
    demoCommentUi.tab = 'work';
    demoCommentUi.sending = false;
    input.value = '';
    input.closest('[data-comment-composer]').classList.add('collapsed');
    updateDemoCommentTotal();
    updateDemoCommentsPanel();
    showToast('评论已发布');
  }, 180);
}

function jumpToDemoAnchorComment(commentId) {
  demoCommentUi.selectedId = commentId;
  demoCommentUi.tab = 'anchor';
  updateDemoCommentsPanel();
  window.requestAnimationFrame(() => {
    document.querySelector(`mark.pop-hl[data-pop-cid="${commentId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function focusDemoAnchorCommentInPanel(commentId) {
  demoCommentUi.selectedId = commentId;
  demoCommentUi.tab = 'anchor';
  updateDemoCommentsPanel();
  window.requestAnimationFrame(() => {
    document.querySelector(`[data-comment-thread="${commentId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function showDemoAnchorHoverTip(mark) {
  const commentId = mark.dataset.popCid;
  if (!commentId || commentId === '__pop_pending_hl') return;
  const comment = getDemoAnchorComments(demoCommentUi.workId).find((item) => item.id === commentId);
  if (!comment || comment.deleted) return;
  clearDemoAnchorHoverTip();
  const rect = mark.getBoundingClientRect();
  const drawerOpen = document.querySelector('[data-comments-drawer]')?.dataset.open === 'true';
  const availableRight = window.innerWidth - (drawerOpen ? 488 : 8);
  const left = Math.max(8, Math.min(rect.left + rect.width / 2 - 159, availableRight - 318));
  const below = rect.top < 120;
  const tip = document.createElement('div');
  tip.className = `pop-c-hltip${below ? ' below' : ''}`;
  tip.dataset.anchorHoverTip = 'true';
  tip.style.left = `${left}px`;
  tip.style.top = `${below ? rect.bottom + 12 : rect.top - 12}px`;
  tip.style.setProperty('--pop-hltip-arrow', `${Math.max(16, Math.min(302, rect.left + rect.width / 2 - left))}px`);
  tip.innerHTML = `<div class="pop-c-hltip-txt">${safeText(comment.body)}</div><div class="pop-c-hltip-foot"><div class="pop-c-hltip-user"><img class="pop-c-hltip-avatar" src="${comment.avatar}" alt="" /><span class="pop-c-hltip-name">${safeText(comment.author)}</span></div><span class="pop-c-hltip-time">${safeText(comment.time)}</span></div>`;
  document.body.appendChild(tip);
}

function versionsMarkup(id) {
  const work = findDemoWork(id);
  if (!work) return notFoundMarkup('作品不存在', '无法加载版本历史。');
  document.title = `版本历史 · ${work.title}`;
  const selected = demoVersions.find((version) => version.id === demoPageState.selectedVersionId) ?? demoVersions[0];
  const current = demoVersions.find((version) => version.id === demoPageState.currentVersionId) ?? demoVersions[0];
  return `
    <div class="versions-page">
      <section class="versions-main">
        <header class="versions-header">
          <div class="versions-title"><button class="page-secondary" type="button" data-route="/profile">← 返回</button><strong>${safeText(work.title)}</strong><span class="version-badge">v${selected.versionNo}</span>${selected.id === current.id ? '<span class="version-badge">当前线上</span>' : '<span class="version-badge">预览模式</span>'}</div>
          ${selected.status === 'ready' && selected.id !== current.id ? `<button class="page-primary" type="button" data-request-rollback="${selected.id}" data-work="${work.id}">回滚到此版本</button>` : ''}
        </header>
        <div class="versions-preview"><div class="versions-preview-inner">
          ${selected.status === 'ready'
            ? `<img src="${demoCoverSrc(work)}" alt="v${selected.versionNo} 预览" style="filter:${selected.versionNo < 4 ? 'saturate(.78) brightness(.96)' : 'none'}" />`
            : '<div class="page-empty"><div><strong>该版本上传失败，无法预览</strong><p>构建产物不完整</p></div></div>'}
        </div></div>
      </section>
      <aside class="versions-aside"><h2>历史版本</h2>${demoVersions.map((version) => `
        <button class="version-item ${version.id === selected.id ? 'active' : ''}" type="button" data-version-select="${version.id}" data-work="${work.id}">
          <strong>v${version.versionNo} ${version.id === current.id ? ' · 当前线上' : ''} ${version.status === 'failed' ? ' · 上传失败' : ''}</strong>
          <span>${version.createdAt} · ${version.size} · ${version.files} 个文件</span>
        </button>`).join('')}</aside>
    </div>
  `;
}

const proxyExample = {
  rules: [
    { path: '/api/search', target: 'https://example.baidu-int.com', methods: ['GET', 'POST'] },
    { path: '/assets/*', target: 'https://static.example.com', methods: ['GET'] },
  ],
  requestHeaders: { 'x-popo-proxy': 'enabled' },
};

function proxySetupMarkup() {
  document.title = '代理配置 · popo';
  return appShell(`
    <div class="page-heading-row"><div><h1>自助添加代理</h1><p>仅作品所有者可为自己的作品配置代理；demo 会在本地完成 JSON 校验与保存反馈。</p></div></div>
    <div class="data-panel">
      <label class="form-label" for="proxySlug">作品 slug</label>
      <div class="tool-row"><input class="demo-input" id="proxySlug" value="popo-demo-7188" placeholder="例如 my-work" /><button class="page-secondary" type="button" data-load-proxy>加载当前配置</button></div>
      <label class="form-label" for="proxyJson" style="margin-top:18px">代理配置 JSON</label>
      <textarea class="demo-textarea" id="proxyJson" style="min-height:360px" spellcheck="false">${safeText(JSON.stringify(proxyExample, null, 2))}</textarea>
      <div id="proxyNotice"></div>
      <div class="tool-row" style="margin-top:14px"><button class="page-secondary" type="button" data-validate-proxy>仅校验</button><button class="page-primary" type="button" data-save-proxy>保存</button></div>
    </div>
  `, 'works');
}

const adminEvents = [
  { time: '18:42:16', user: 'linyuhang', event: 'work_detail.page_view', page: '/works/7188', target: 'work:7188' },
  { time: '18:40:03', user: 'arjun', event: 'home.search', page: '/', target: 'query:反馈' },
  { time: '18:38:22', user: 'anon', event: 'home.work.like', page: '/', target: 'work:8495' },
  { time: '18:34:51', user: 'priyanka', event: 'profile.work.share', page: '/profile', target: 'work:5100' },
  { time: '18:31:09', user: 'linyuhang', event: 'dashboard.page_view', page: '/dashboard', target: '' },
];

function adminMarkup() {
  document.title = '埋点后台 · popo';
  const eventRows = adminEvents.map((item) => `<tr><td>${item.time}</td><td><code>${item.user}</code></td><td><code>${item.event}</code></td><td><code>${item.page}</code></td><td><code>${item.target}</code></td></tr>`).join('');
  return appShell(`
    <div class="page-heading-row"><div><h1>埋点后台</h1><p>当前用户：${demoUser.username}</p></div><div class="tool-row"><button class="page-secondary" type="button" data-route="/dashboard">打开数据看板</button><button class="page-secondary" type="button" data-route="/admin/announcements">公告管理</button></div></div>
    <div class="segment-control" data-admin-days>${[1, 7, 14, 30].map((day) => `<button type="button" class="${day === 7 ? 'active' : ''}" data-admin-day="${day}">${day} 天</button>`).join('')}</div>
    <section class="data-panel"><div class="metric-grid"><div class="metric-card"><span>PV</span><strong data-admin-metric="pv">12,846</strong><small>较上期 +18.4%</small></div><div class="metric-card"><span>UV (anonymous)</span><strong data-admin-metric="uv">3,284</strong><small>较上期 +11.2%</small></div><div class="metric-card"><span>注册用户</span><strong data-admin-metric="users">1,126</strong><small>活跃用户 428</small></div></div></section>
    <section class="data-panel"><h2>访问趋势</h2>${trendSvg()}</section>
    <section class="data-panel"><h2>热门事件</h2><div class="data-table-wrap"><table class="data-table"><thead><tr><th>事件名</th><th>次数</th><th>独立用户</th></tr></thead><tbody><tr><td><code>home.work.view</code></td><td>5,862</td><td>2,417</td></tr><tr><td><code>work_detail.page_view</code></td><td>3,946</td><td>1,802</td></tr><tr><td><code>home.search</code></td><td>1,128</td><td>642</td></tr><tr><td><code>profile.work.share</code></td><td>486</td><td>218</td></tr></tbody></table></div></section>
    <section class="data-panel"><h2>最近事件</h2><div class="data-table-wrap"><table class="data-table"><thead><tr><th>时间</th><th>用户</th><th>事件</th><th>页面</th><th>target</th></tr></thead><tbody>${eventRows}</tbody></table></div></section>
    <section class="data-panel"><h2>管理员</h2><div class="tool-row" style="padding-bottom:14px"><input class="demo-input" id="adminUsername" placeholder="例如 priyanka" /><input class="demo-input" id="adminNote" placeholder="备注（可选）" /><button class="page-primary" type="button" data-add-admin>添加</button></div>${adminUsersTable()}</section>
  `, 'admin');
}

function adminUsersTable() {
  return `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>username</th><th>备注</th><th>添加时间</th><th>添加人</th><th style="text-align:right">操作</th></tr></thead><tbody data-admin-users>${demoAdminUsers.map((item) => `<tr><td><code>${safeText(item.username)}</code></td><td>${safeText(item.note)}</td><td>${item.createdAt}</td><td><code>${item.createdBy}</code></td><td><div class="table-actions"><button type="button" data-remove-admin="${safeText(item.username)}" ${item.username === demoUser.username ? 'disabled' : ''}>${item.username === demoUser.username ? '自己' : '移除'}</button></div></td></tr>`).join('')}</tbody></table></div>`;
}

function announcementsMarkup() {
  document.title = '公告管理 · popo';
  return appShell(`
    <div class="page-heading-row"><div><h1>公告管理</h1><p>编辑草稿并发布到 demo 首页；重新打开页面仍保留本次会话中的内容。</p></div><div class="tool-row"><button class="page-secondary" type="button" data-save-announcements>保存草稿</button><button class="page-primary" type="button" data-publish-announcements>发布</button></div></div>
    <section class="data-panel"><h2>公告条目</h2><div data-announcement-list>${demoAnnouncements.map((item, index) => announcementRow(item, index)).join('')}</div><button class="page-secondary" type="button" data-add-announcement>添加公告</button><div id="announcementNotice">${demoPageState.announcementNotice}</div></section>
    <section class="data-panel"><h2>当前已发布</h2><p class="page-subtitle">最后发布时间：2026-08-08 18:30</p>${demoAnnouncements.map((item) => `<div class="dialog-section"><strong style="font-size:13px">${safeText(item.title)}</strong><p class="page-subtitle">${safeText(item.content)}</p></div>`).join('')}</section>
  `, 'admin');
}

function announcementRow(item, index) {
  return `<div class="announcement-row" data-announcement-index="${index}"><div class="announcement-fields"><input class="demo-input" data-announcement-title value="${safeText(item.title)}" placeholder="标题" /><textarea class="demo-textarea" data-announcement-content placeholder="内容（纯文本）">${safeText(item.content)}</textarea></div><div class="announcement-actions"><button type="button" data-move-announcement="up" title="上移" aria-label="上移">↑</button><button type="button" data-move-announcement="down" title="下移" aria-label="下移">↓</button><button type="button" data-remove-announcement title="删除" aria-label="删除">×</button></div></div>`;
}

function trendSvg() {
  return `
    <div style="overflow-x:auto"><svg class="trend-chart" viewBox="0 0 920 280" role="img" aria-label="访问趋势折线图">
      <line class="grid-line" x1="54" y1="34" x2="890" y2="34"/><line class="grid-line" x1="54" y1="94" x2="890" y2="94"/><line class="grid-line" x1="54" y1="154" x2="890" y2="154"/><line class="grid-line" x1="54" y1="214" x2="890" y2="214"/>
      <path class="area-fill" d="M54 214 L54 177 L170 145 L286 161 L402 101 L518 118 L634 74 L750 93 L866 49 L866 214 Z"/>
      <polyline class="line-main" points="54,177 170,145 286,161 402,101 518,118 634,74 750,93 866,49"/>
      <polyline class="line-green" points="54,203 170,185 286,190 402,158 518,166 634,143 750,151 866,120"/>
      <text x="24" y="38">800</text><text x="24" y="98">600</text><text x="24" y="158">400</text><text x="24" y="218">200</text>
      <text x="54" y="248">08/01</text><text x="274" y="248">08/03</text><text x="506" y="248">08/05</text><text x="738" y="248">08/07</text><text x="842" y="248">08/08</text>
    </svg></div>`;
}

function dashboardMarkup() {
  document.title = '数据看板 · popo';
  const factor = { '7': 1, '14': 1.74, '30': 3.28, 'custom': 2.16 }[demoPageState.dashboardRange] ?? 1;
  const fmt = (value) => Math.round(value * factor).toLocaleString('zh-CN');
  const rankValues = {
    visitors: (work) => work.viewCount,
    visits: (work) => Math.round(work.viewCount * 1.8),
    likes: (work) => work.likes,
    shares: (work) => work.shareCount,
    latest: (work) => work.onlineAt.slice(5),
  };
  const ranked = demoWorks.filter((work) => !work.deleted).slice().sort((a, b) => {
    if (demoPageState.rankKey === 'latest') return b.onlineAt.localeCompare(a.onlineAt);
    return rankValues[demoPageState.rankKey](b) - rankValues[demoPageState.rankKey](a);
  }).slice(0, 8);
  const rankLabel = { visitors: '访问人数', visits: '访问次数', likes: '点赞次数', shares: '分享次数', latest: '最新发布' }[demoPageState.rankKey];
  const topAuthors = ['arjun', 'linyuhang', 'elise', 'valentina', 'evelyn'];

  return `
    <div class="dashboard-page">
      ${pageTopbar()}
      <main class="dashboard-container">
        <div class="dashboard-toolbar"><span>时间范围</span><div class="range-buttons">${[['7', '近 7 天'], ['14', '近 14 天'], ['30', '近 30 天'], ['custom', '自定义']].map(([value, label]) => `<button type="button" class="${demoPageState.dashboardRange === value ? 'active' : ''}" data-dashboard-range="${value}">${label}</button>`).join('')}</div><button class="page-secondary" type="button" data-toggle-dashboard-admin>权限管理</button></div>
        ${demoPageState.dashboardAdminOpen ? `<section class="dashboard-panel"><div class="dashboard-panel-head"><div><h2>权限管理</h2><p>管理可访问后台和数据看板的 admin_user 用户</p></div><span class="page-subtitle">当前账号：${demoUser.username}</span></div><div class="tool-row"><input class="demo-input" id="dashboardAdminUsername" placeholder="例如 priyanka" /><input class="demo-input" id="dashboardAdminNote" placeholder="备注（可选）" /><button class="page-primary" type="button" data-add-dashboard-admin>添加</button></div><div style="margin-top:14px">${adminUsersTable()}</div></section>` : ''}
        <section class="dashboard-section"><h2>核心指标</h2><div class="metric-grid"><div class="metric-card"><span>独立访客 (UV)</span><strong>${fmt(3284)}</strong><small>较上期 +11.2%</small></div><div class="metric-card"><span>页面浏览量 (PV)</span><strong>${fmt(12846)}</strong><small>较上期 +18.4%</small></div><div class="metric-card"><span>新增作品数</span><strong>${fmt(186)}</strong><small>较上期 +7.8%</small></div></div></section>
        <section class="dashboard-section"><h2>观测指标</h2><div class="dashboard-panel"><div class="dashboard-panel-head"><div><h2>累计总量</h2><p>截至当前总量，不随时间筛选变化</p></div></div><div class="metric-grid"><div class="metric-card"><span>累计作品</span><strong>8,927</strong><small>累计</small></div><div class="metric-card"><span>累计作者</span><strong>3,146</strong><small>累计</small></div><div class="metric-card"><span>累计互动</span><strong>46,280</strong><small>累计</small></div></div></div></section>
        <section class="dashboard-panel"><div class="dashboard-panel-head"><div><h2>核心指标趋势</h2><p>黑线为 PV，绿线为 UV</p></div><div class="trend-toggles"><button class="active" type="button" data-trend-toggle>PV</button><button class="active" type="button" data-trend-toggle>UV</button><button type="button" data-trend-toggle>新增作品</button></div></div>${trendSvg()}</section>
        <section class="dashboard-panel"><div class="dashboard-panel-head"><div><h2>作品排行榜</h2><p>按所选指标查看前 8 个作品</p></div><div class="rank-tabs">${Object.entries({ visitors: '访问人数', visits: '访问次数', likes: '点赞次数', shares: '分享次数', latest: '最新发布' }).map(([key, label]) => `<button class="${demoPageState.rankKey === key ? 'active' : ''}" type="button" data-rank-key="${key}">${label}</button>`).join('')}</div></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>排名</th><th>作品</th><th>可见范围</th><th>标签</th><th style="text-align:right">${rankLabel}</th></tr></thead><tbody>${ranked.map((work, index) => `<tr><td>${index + 1}</td><td class="title-cell">${safeText(work.title)}<br /><small style="color:#90918e;font-weight:400">${safeText(work.owner)}</small></td><td><span class="visibility-pill ${work.visibility}">${visibilityLabel(work.visibility)}</span></td><td>${work.tags.slice(0, 2).map((tag) => `<span class="status-chip">${safeText(tag)}</span>`).join(' ')}</td><td style="text-align:right;font-weight:800">${rankValues[demoPageState.rankKey](work)}</td></tr>`).join('')}</tbody></table></div></section>
        <section class="dashboard-panel"><div class="dashboard-panel-head"><div><h2>作者排行榜</h2><p>从发布、点赞、分享与浏览四个维度观察作者</p></div></div><div class="author-rank-grid">${[['得到点赞最多的', 84], ['作品发布最多的', 32], ['被分享最多的', 46], ['被浏览最多的', 982]].map(([title, base], groupIndex) => `<div class="author-rank-card"><h3>${title}</h3>${topAuthors.slice(0, 4).map((author, index) => `<div class="rank-person"><i>${index + 1}</i><span>${author}</span><strong>${Number(base) - index * (7 + groupIndex)}</strong></div>`).join('')}</div>`).join('')}</div></section>
        <section class="dashboard-panel"><div class="dashboard-panel-head"><div><h2>转化漏斗分析</h2><p>作品访问 → 累计互动 → 累计有效泡泡</p></div><span class="status-chip">参考口径</span></div><div class="funnel-grid"><div class="funnel-visual"><div class="funnel-levels"><div class="funnel-level"><span>作品页访问 PV</span><strong>${fmt(6940)}</strong></div><div class="funnel-level"><span>累计互动总量</span><strong>${fmt(1468)}</strong></div><div class="funnel-level"><span>累计有效泡泡数</span><strong>${fmt(126)}</strong></div></div></div><div class="funnel-metrics"><div class="metric-card"><span>新增作品数</span><strong>${fmt(186)}</strong><small>所选周期</small></div><div class="metric-card"><span>访问到互动转化</span><strong>21.2%</strong><small>参考口径</small></div><div class="metric-card"><span>新增到有效转化</span><strong>67.7%</strong><small>参考口径</small></div></div></div></section>
      </main>
    </div>
  `;
}

function notFoundMarkup(title = '页面不存在', description = '你访问的页面可能已被移动或删除。') {
  document.title = '404 · popo';
  return `<div class="not-found"><div><strong>404</strong><h1>${safeText(title)}</h1><p>${safeText(description)}</p><button class="page-primary" type="button" data-route="/">返回首页</button></div></div>`;
}

async function copyDemoText(value, message) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const input = document.createElement('textarea');
    input.value = value;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  }
  showToast(message);
}

function refreshDynamicRoute() {
  if (currentRoute() !== '/') {
    routePage.innerHTML = routeMarkup(currentRoute());
    if (currentRoute() === '/profile') requestAnimationFrame(initProfileVisibilityIndicator);
  }
}

function syncProfileVisibilityIndicator(segment) {
  const activeButton = segment?.querySelector('[data-profile-visibility].active');
  if (!activeButton) return;
  segment.style.setProperty('--profile-tab-left', `${activeButton.offsetLeft}px`);
  segment.style.setProperty('--profile-tab-width', `${activeButton.offsetWidth}px`);
}

function initProfileVisibilityIndicator() {
  const segment = document.querySelector('.profile-tools .segment-control');
  if (!segment) return;
  syncProfileVisibilityIndicator(segment);
  segment.classList.add('is-ready');
}

function validateProxyConfig() {
  const notice = document.querySelector('#proxyNotice');
  const slug = document.querySelector('#proxySlug')?.value.trim();
  if (!slug) {
    notice.innerHTML = '<div class="notice-error">请先填写作品 slug</div>';
    return null;
  }
  try {
    const parsed = JSON.parse(document.querySelector('#proxyJson').value);
    if (!parsed || !Array.isArray(parsed.rules)) throw new Error('rules 必须是数组');
    const invalidRule = parsed.rules.find((rule) => !rule.path || !rule.target || !Array.isArray(rule.methods));
    if (invalidRule) throw new Error('每条规则都需要 path、target 和 methods');
    notice.innerHTML = '<div class="notice-success">校验通过，可以保存。</div>';
    return parsed;
  } catch (error) {
    notice.innerHTML = `<div class="notice-error">${safeText(error instanceof Error ? error.message : '不是合法的 JSON')}</div>`;
    return null;
  }
}

function showAnnouncementPanel() {
  document.querySelector('.demo-announcement')?.remove();
  const panel = document.createElement('section');
  panel.className = 'demo-announcement';
  panel.innerHTML = `
    <img class="demo-announcement-decor decor-1" src="./assets/announcement/decor-1.png" alt="" />
    <img class="demo-announcement-decor decor-2" src="./assets/announcement/decor-2.png" alt="" />
    <img class="demo-announcement-decor decor-3" src="./assets/announcement/decor-3.png" alt="" />
    <img class="demo-announcement-bg" src="./assets/announcement/bubble-bg.png" alt="" />
    <img class="demo-announcement-mascot" src="./assets/announcement/megaphone.png" alt="" />
    <button type="button" data-close-demo-announcement aria-label="关闭公告"><img src="./assets/announcement/close.svg" alt="" /></button>
    <div class="demo-announcement-content"><div class="demo-announcement-title"><img src="./assets/announcement/logo.png" alt="popo" />上新公告</div><div class="demo-announcement-card">${demoAnnouncements.map((item) => `<div><strong>${safeText(item.title)}</strong><p>${safeText(item.content)}</p></div>`).join('')}</div></div>
  `;
  document.body.appendChild(panel);
}

function setWidgetActionActive(button, active) {
  if (!button) return;
  button.classList.remove('is-activating');
  button.dataset.active = String(active);
  button.setAttribute('aria-pressed', String(active));
  if (!active) return;
  void button.offsetWidth;
  button.classList.add('is-activating');
  window.setTimeout(() => button.classList.remove('is-activating'), 620);
}

function burstWidgetHome(button) {
  const layer = button.querySelector('.pop-widget-assistant-bubbles');
  const center = 21.25;
  const emitters = [
    { angle: -146, distance: 19, size: 5 },
    { angle: -101, distance: 23, size: 4 },
    { angle: -49, distance: 21, size: 5 },
    { angle: 5, distance: 24, size: 4 },
    { angle: 55, distance: 20, size: 6 },
    { angle: 132, distance: 22, size: 4 },
  ];
  emitters.forEach(({ angle, distance, size }, index) => {
    const radians = angle * Math.PI / 180;
    const startRadius = 22.5;
    const particle = document.createElement('span');
    particle.className = 'pop-widget-particle';
    if (index % 2 === 1) particle.classList.add('is-hollow');
    if (index % 3 === 2) particle.classList.add('is-soft');
    particle.style.left = `${center + Math.cos(radians) * startRadius - size / 2}px`;
    particle.style.top = `${center + Math.sin(radians) * startRadius - size / 2}px`;
    particle.style.setProperty('--x', `${Math.cos(radians) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(radians) * distance}px`);
    particle.style.setProperty('--size', `${size}px`);
    particle.style.animationDelay = `${index * 22}ms`;
    layer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  });
}

document.addEventListener('click', async (event) => {
  const routeButton = event.target.closest('[data-route]');
  if (routeButton) {
    navigateRoute(routeButton.dataset.route);
    return;
  }

  if (event.target.closest('[data-open-publish]')) {
    openModal(document.querySelector('#publishModal'));
    return;
  }
  if (event.target.closest('[data-demo-close]') || event.target.id === 'dynamicDemoModal') {
    closeDemoModal();
    return;
  }

  const settingsTab = event.target.closest('[data-profile-settings-tab]');
  if (settingsTab && profileSettingsUi) {
    profileSettingsUi.tab = settingsTab.dataset.profileSettingsTab;
    renderProfileSettingsPanel();
    return;
  }
  const deleteWorkRequest = event.target.closest('[data-profile-delete-request]');
  if (deleteWorkRequest) {
    const work = findDemoWork(deleteWorkRequest.dataset.profileDeleteRequest);
    if (work) openProfileDeleteConfirm(work);
    return;
  }
  const tagSuggestion = event.target.closest('[data-settings-tag-suggestion]');
  if (tagSuggestion) {
    addProfileSettingsTag(tagSuggestion.dataset.settingsTagSuggestion);
    return;
  }
  if (event.target.closest('[data-settings-add-tag]')) {
    addProfileSettingsTag();
    return;
  }
  const removeSettingsTag = event.target.closest('[data-settings-remove-tag]');
  if (removeSettingsTag) {
    const work = findDemoWork(profileSettingsUi?.workId);
    if (!work) return;
    work.tags.splice(Number(removeSettingsTag.dataset.settingsRemoveTag), 1);
    renderProfileSettingsTagList(work);
    syncProfileSettingsPresentation(work);
    renderProfileTagSuggestions();
    return;
  }
  const settingsSearchTab = event.target.closest('[data-settings-search-tab]');
  if (settingsSearchTab && profileSettingsUi) {
    profileSettingsUi.searchTab = settingsSearchTab.dataset.settingsSearchTab;
    renderProfilePermissionSearchResults();
    return;
  }
  const selectSettingsGrant = event.target.closest('[data-settings-select-grant]');
  if (selectSettingsGrant && profileSettingsUi) {
    const work = findDemoWork(profileSettingsUi.workId);
    if (work && !work.grants.includes(selectSettingsGrant.dataset.settingsSelectGrant)) {
      work.grants.push(selectSettingsGrant.dataset.settingsSelectGrant);
      renderProfileGrantList(work);
      renderProfilePermissionSearchResults();
    }
    return;
  }
  const removeSettingsGrant = event.target.closest('[data-settings-remove-grant]');
  if (removeSettingsGrant && profileSettingsUi) {
    const work = findDemoWork(profileSettingsUi.workId);
    if (work) {
      work.grants.splice(Number(removeSettingsGrant.dataset.settingsRemoveGrant), 1);
      renderProfileGrantList(work);
      renderProfilePermissionSearchResults();
    }
    return;
  }
  if (event.target.closest('[data-settings-save-advanced]') && profileSettingsUi) {
    const work = findDemoWork(profileSettingsUi.workId);
    const error = validateProfileProxyFormat(profileSettingsUi.advancedDraft.proxyConfig);
    const editor = document.querySelector('[data-settings-proxy-editor]');
    const errorNode = document.querySelector('[data-settings-proxy-error]');
    editor?.classList.toggle('is-error', Boolean(error));
    if (errorNode) {
      errorNode.textContent = error;
      errorNode.hidden = !error;
    }
    if (error || !work) return;
    work.toolbarHidden = profileSettingsUi.advancedDraft.toolbarHidden;
    work.proxyConfig = profileSettingsUi.advancedDraft.proxyConfig;
    closeDemoModal();
    showToast('高级设置已保存');
    return;
  }

  if (!event.target.closest('.profile-settings-tag-composer')) {
    const suggestions = document.querySelector('[data-settings-tag-suggestions]');
    if (suggestions) suggestions.hidden = true;
  }

  const removeProfileTag = event.target.closest('[data-profile-remove-tag]');
  if (removeProfileTag) {
    const work = findDemoWork(removeProfileTag.dataset.id);
    if (work) {
      work.tags = work.tags.filter((tag) => tag !== removeProfileTag.dataset.profileRemoveTag);
      refreshDynamicRoute();
    }
    return;
  }

  const profileAction = event.target.closest('[data-profile-action]');
  if (profileAction) {
    openProfileAction(profileAction.dataset.profileAction, profileAction.dataset.id);
    return;
  }
  const visibilityButton = event.target.closest('[data-profile-visibility]');
  if (visibilityButton) {
    demoPageState.profileVisibility = visibilityButton.dataset.profileVisibility;
    const segment = visibilityButton.closest('.segment-control');
    segment?.querySelectorAll('[data-profile-visibility]').forEach((button) => {
      const active = button === visibilityButton;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    window.cancelAnimationFrame(profileVisibilityIndicatorFrame);
    profileVisibilityIndicatorFrame = window.requestAnimationFrame(() => syncProfileVisibilityIndicator(segment));
    window.clearTimeout(profileVisibilityTransitionTimer);
    profileVisibilityTransitionTimer = window.setTimeout(refreshDynamicRoute, 480);
    return;
  }
  const tagButton = event.target.closest('[data-profile-tag]');
  if (tagButton) {
    demoPageState.profileTag = tagButton.dataset.profileTag;
    refreshDynamicRoute();
    return;
  }
  if (event.target.closest('[data-toggle-manage]')) {
    demoPageState.profileManaging = !demoPageState.profileManaging;
    refreshDynamicRoute();
    return;
  }

  const previewLike = event.target.closest('[data-preview-like]');
  if (previewLike) {
    const work = findDemoWork(previewLike.dataset.previewLike);
    const current = state.liked.get(work.id) ?? { liked: false, count: work.likes };
    state.liked.set(work.id, { liked: !current.liked, count: current.count + (current.liked ? -1 : 1) });
    refreshDynamicRoute();
    return;
  }

  const anchorBubble = event.target.closest('[data-anchor-comment-bubble]');
  if (anchorBubble) {
    startDemoAnchorComment(anchorBubble._anchor);
    return;
  }
  const commentTab = event.target.closest('[data-comment-tab]');
  if (commentTab) {
    demoCommentUi.tab = commentTab.dataset.commentTab;
    updateDemoCommentsPanel();
    return;
  }
  if (event.target.closest('[data-anchor-cancel]')) {
    cancelDemoAnchorComment({ collapse: false });
    return;
  }
  const anchorJump = event.target.closest('[data-anchor-jump]');
  if (anchorJump) {
    jumpToDemoAnchorComment(anchorJump.dataset.anchorJump);
    return;
  }
  const anchorHighlight = event.target.closest('mark.pop-hl[data-pop-cid]');
  if (anchorHighlight && anchorHighlight.dataset.popCid !== '__pop_pending_hl') {
    focusDemoAnchorCommentInPanel(anchorHighlight.dataset.popCid);
    return;
  }
  const replyButton = event.target.closest('[data-comment-reply]');
  if (replyButton) {
    startDemoReply(replyButton);
    return;
  }
  const expandReplies = event.target.closest('[data-comment-expand]');
  if (expandReplies) {
    toggleDemoReplies(expandReplies.dataset.commentExpand);
    return;
  }
  const moreButton = event.target.closest('[data-comment-more]');
  if (moreButton) {
    const menu = moreButton.closest('[data-comment-more-wrap]');
    const nextOpen = menu.dataset.open !== 'true';
    document.querySelectorAll('[data-comment-more-wrap][data-open="true"]').forEach((item) => item.removeAttribute('data-open'));
    if (nextOpen) menu.dataset.open = 'true';
    return;
  }
  const deleteComment = event.target.closest('[data-delete-comment]');
  if (deleteComment) {
    showDemoDeleteConfirm(deleteComment.dataset.threadId, deleteComment.dataset.replyId ?? null);
    return;
  }
  if (event.target.closest('[data-comment-delete-confirm]')) {
    deleteDemoCommentTarget();
    return;
  }
  if (event.target.closest('[data-comment-delete-cancel]')) {
    hideDemoDeleteConfirm();
    return;
  }
  const deleteMask = event.target.closest('[data-comment-confirm]');
  if (deleteMask) {
    if (!event.target.closest('[data-comment-confirm-card]')) hideDemoDeleteConfirm();
    return;
  }

  const widget = event.target.closest('.pop-widget') ?? document.querySelector('.pop-widget');
  if (event.target.closest('[data-widget-fold]')) {
    widget.dataset.folded = 'true';
    widget.querySelector('[data-widget-fold]').setAttribute('aria-expanded', 'false');
    widget.querySelector('[data-widget-fold]').tabIndex = -1;
    widget.querySelector('[data-widget-unfold]').tabIndex = 0;
    return;
  }
  if (event.target.closest('[data-widget-unfold]')) {
    widget.dataset.folded = 'false';
    widget.querySelector('[data-widget-fold]').setAttribute('aria-expanded', 'true');
    widget.querySelector('[data-widget-fold]').tabIndex = 0;
    widget.querySelector('[data-widget-unfold]').tabIndex = -1;
    return;
  }
  const widgetComments = event.target.closest('[data-widget-comments]');
  if (widgetComments) {
    const drawer = document.querySelector('[data-comments-drawer]');
    if (drawer?.dataset.open === 'true') closeDemoCommentsPanel();
    else openDemoCommentsPanel();
    return;
  }
  if (event.target.closest('[data-close-comments]')) {
    closeDemoCommentsPanel();
    return;
  }
  const widgetShare = event.target.closest('[data-widget-share]');
  if (widgetShare) {
    const menu = widgetShare.closest('.pop-widget-share-wrap').querySelector('.pop-widget-share-menu');
    menu.hidden = !menu.hidden;
    setWidgetActionActive(widgetShare, !menu.hidden);
    return;
  }
  const widgetCopy = event.target.closest('[data-widget-copy]');
  if (widgetCopy) {
    await copyDemoText(`${window.location.origin}${window.location.pathname}#/works/${widgetCopy.dataset.widgetCopy}`, '链接已复制');
    widgetCopy.closest('.pop-widget-share-menu').hidden = true;
    setWidgetActionActive(widget.querySelector('[data-widget-share]'), false);
    return;
  }
  if (event.target.closest('[data-widget-infoflow]')) {
    showToast('已生成如流分享卡片');
    event.target.closest('.pop-widget-share-menu').hidden = true;
    setWidgetActionActive(widget.querySelector('[data-widget-share]'), false);
    return;
  }
  const widgetLike = event.target.closest('[data-widget-like]');
  if (widgetLike) {
    const work = findDemoWork(widgetLike.dataset.widgetLike);
    const current = state.liked.get(work.id) ?? { liked: false, count: work.likes };
    const next = { liked: !current.liked, count: current.count + (current.liked ? -1 : 1) };
    state.liked.set(work.id, next);
    widgetLike.classList.toggle('liked', next.liked);
    setWidgetActionActive(widgetLike, next.liked);
    widgetLike.querySelector('[data-widget-like-count]').textContent = String(next.count);
    return;
  }
  const submitComment = event.target.closest('[data-submit-comment]');
  if (submitComment) {
    publishDemoComment(submitComment);
    return;
  }
  if (event.target.closest('[data-comment-cancel]')) {
    cancelDemoCommentCompose({ collapse: true });
    return;
  }

  const copyLink = event.target.closest('[data-copy-demo-link]');
  if (copyLink) {
    await copyDemoText(`${window.location.origin}${window.location.pathname}#/works/${copyLink.dataset.copyDemoLink}`, '分享链接已复制');
    return;
  }
  const copyDomain = event.target.closest('[data-copy-demo-domain]');
  if (copyDomain) {
    const work = findDemoWork(copyDomain.dataset.copyDemoDomain);
    await copyDemoText(`https://${work.slug}.popo.baidu-int.com`, '专属域名已复制');
    return;
  }
  if (event.target.closest('[data-share-infoflow]')) {
    showToast('已生成如流分享卡片');
    closeDemoModal();
    return;
  }

  if (event.target.closest('[data-add-grant]')) {
    const input = document.querySelector('#grantSearch');
    const value = input.value.trim();
    if (!value) return;
    document.querySelector('[data-grant-list]').insertAdjacentHTML('beforeend', `<div class="permission-item"><span>${safeText(value)} · 用户</span><button type="button" data-remove-grant>移除</button></div>`);
    input.value = '';
    return;
  }
  if (event.target.closest('[data-remove-grant]')) {
    event.target.closest('.permission-item').remove();
    return;
  }
  const saveVisibility = event.target.closest('[data-save-visibility]');
  if (saveVisibility) {
    const work = findDemoWork(saveVisibility.dataset.saveVisibility);
    work.visibility = document.querySelector('#visibilitySelect').value;
    closeDemoModal();
    refreshDynamicRoute();
    showToast('可见范围已保存');
    return;
  }

  const saveProfileSettings = event.target.closest('[data-save-profile-settings]');
  if (saveProfileSettings) {
    const work = findDemoWork(saveProfileSettings.dataset.saveProfileSettings);
    const title = document.querySelector('#profileSettingsTitle')?.value.trim();
    if (work && title) work.title = title;
    closeDemoModal();
    refreshDynamicRoute();
    showToast('作品信息已保存');
    return;
  }

  const removeEditTag = event.target.closest('[data-remove-edit-tag]');
  if (removeEditTag) {
    removeEditTag.remove();
    return;
  }
  if (event.target.closest('[data-add-edit-tag]')) {
    const input = document.querySelector('#newTag');
    const value = input.value.trim();
    if (!value) return;
    document.querySelector('[data-edit-tags]').insertAdjacentHTML('beforeend', `<button class="tag-chip active" type="button" data-remove-edit-tag="${safeText(value)}">${safeText(value)} ×</button>`);
    input.value = '';
    return;
  }
  const saveTags = event.target.closest('[data-save-tags]');
  if (saveTags) {
    const work = findDemoWork(saveTags.dataset.saveTags);
    work.tags = [...document.querySelectorAll('[data-remove-edit-tag]')].map((button) => button.dataset.removeEditTag);
    closeDemoModal();
    refreshDynamicRoute();
    showToast('标签已保存');
    return;
  }
  const confirmDelete = event.target.closest('[data-confirm-delete]');
  if (confirmDelete) {
    findDemoWork(confirmDelete.dataset.confirmDelete).deleted = true;
    closeDemoModal();
    refreshDynamicRoute();
    showToast('作品已从 demo 移除');
    return;
  }

  const selectVersion = event.target.closest('[data-version-select]');
  if (selectVersion) {
    demoPageState.selectedVersionId = selectVersion.dataset.versionSelect;
    refreshDynamicRoute();
    return;
  }
  const requestRollback = event.target.closest('[data-request-rollback]');
  if (requestRollback) {
    const version = demoVersions.find((item) => item.id === requestRollback.dataset.requestRollback);
    openDemoModal('确认回滚', `<p class="page-subtitle">确定将线上版本回滚到 <strong>v${version.versionNo}</strong>？回滚只切换线上指针，历史版本仍会保留。</p><div class="dialog-actions"><button class="page-secondary" type="button" data-demo-close>取消</button><button class="page-primary" type="button" data-confirm-rollback="${version.id}" data-work="${requestRollback.dataset.work}">确认回滚</button></div>`);
    return;
  }
  const confirmRollback = event.target.closest('[data-confirm-rollback]');
  if (confirmRollback) {
    demoPageState.currentVersionId = confirmRollback.dataset.confirmRollback;
    closeDemoModal();
    refreshDynamicRoute();
    showToast('回滚成功，线上版本已切换');
    return;
  }

  if (event.target.closest('[data-create-work]')) {
    openDemoModal('新建作品', `<div class="dialog-section"><label for="createWorkTitle">作品名称</label><input class="demo-input" id="createWorkTitle" placeholder="输入作品名称" /></div><div class="dialog-section"><label for="createWorkVisibility">初始可见范围</label><select class="demo-select" id="createWorkVisibility"><option value="private">私有</option><option value="specified">指定人可见</option><option value="internal">公开</option></select></div><div class="dialog-actions"><button class="page-secondary" type="button" data-demo-close>取消</button><button class="page-primary" type="button" data-create-work-submit>创建</button></div>`);
    return;
  }
  if (event.target.closest('[data-reset-work-filters]')) {
    document.querySelector('[data-work-search]').value = '';
    document.querySelector('[data-work-visibility-filter]').value = '';
    filterWorksTable();
    return;
  }
  if (event.target.closest('[data-create-work-submit]')) {
    const title = document.querySelector('#createWorkTitle').value.trim();
    if (!title) return;
    demoWorks.unshift({ id: `local-${Date.now()}`, coverId: '7188', title, owner: demoUser.username, likes: 0, category: 'personal', visibility: document.querySelector('#createWorkVisibility').value, tags: ['新作品'], grants: [], toolbarHidden: false, proxyConfig: DEMO_DEFAULT_PROXY_CONFIG, shareCount: 0, viewCount: 0, onlineAt: '2026-08-08', slug: `local-${Date.now()}`, deleted: false });
    closeDemoModal();
    refreshDynamicRoute();
    showToast('本地作品已创建');
    return;
  }

  if (event.target.closest('[data-load-proxy]')) {
    document.querySelector('#proxyJson').value = JSON.stringify(proxyExample, null, 2);
    document.querySelector('#proxyNotice').innerHTML = '<div class="notice-success">已加载当前配置。</div>';
    return;
  }
  if (event.target.closest('[data-validate-proxy]')) {
    validateProxyConfig();
    return;
  }
  if (event.target.closest('[data-save-proxy]')) {
    if (validateProxyConfig()) document.querySelector('#proxyNotice').innerHTML = '<div class="notice-success">保存成功，demo 已缓存代理配置。</div>';
    return;
  }

  const adminDay = event.target.closest('[data-admin-day]');
  if (adminDay) {
    document.querySelectorAll('[data-admin-day]').forEach((button) => button.classList.toggle('active', button === adminDay));
    const factor = Number(adminDay.dataset.adminDay) / 7;
    document.querySelector('[data-admin-metric="pv"]').textContent = Math.round(12846 * factor).toLocaleString('zh-CN');
    document.querySelector('[data-admin-metric="uv"]').textContent = Math.round(3284 * factor).toLocaleString('zh-CN');
    document.querySelector('[data-admin-metric="users"]').textContent = Math.round(1126 * Math.min(1.4, factor)).toLocaleString('zh-CN');
    return;
  }
  if (event.target.closest('[data-add-admin]')) {
    addAdminFromInputs('#adminUsername', '#adminNote');
    return;
  }
  if (event.target.closest('[data-add-dashboard-admin]')) {
    addAdminFromInputs('#dashboardAdminUsername', '#dashboardAdminNote');
    return;
  }
  const removeAdmin = event.target.closest('[data-remove-admin]');
  if (removeAdmin && !removeAdmin.disabled) {
    const index = demoAdminUsers.findIndex((item) => item.username === removeAdmin.dataset.removeAdmin);
    if (index >= 0) demoAdminUsers.splice(index, 1);
    refreshDynamicRoute();
    showToast('管理员已移除');
    return;
  }

  const rangeButton = event.target.closest('[data-dashboard-range]');
  if (rangeButton) {
    demoPageState.dashboardRange = rangeButton.dataset.dashboardRange;
    refreshDynamicRoute();
    return;
  }
  const rankButton = event.target.closest('[data-rank-key]');
  if (rankButton) {
    demoPageState.rankKey = rankButton.dataset.rankKey;
    refreshDynamicRoute();
    return;
  }
  if (event.target.closest('[data-toggle-dashboard-admin]')) {
    demoPageState.dashboardAdminOpen = !demoPageState.dashboardAdminOpen;
    refreshDynamicRoute();
    return;
  }
  const trendToggle = event.target.closest('[data-trend-toggle]');
  if (trendToggle) {
    trendToggle.classList.toggle('active');
    return;
  }

  if (event.target.closest('[data-add-announcement]')) {
    demoAnnouncements.push({ title: '', content: '' });
    refreshDynamicRoute();
    return;
  }
  const announcementAction = event.target.closest('[data-move-announcement], [data-remove-announcement]');
  if (announcementAction) {
    const row = announcementAction.closest('[data-announcement-index]');
    const index = Number(row.dataset.announcementIndex);
    if (announcementAction.matches('[data-remove-announcement]')) demoAnnouncements.splice(index, 1);
    else {
      const target = announcementAction.dataset.moveAnnouncement === 'up' ? index - 1 : index + 1;
      if (target >= 0 && target < demoAnnouncements.length) [demoAnnouncements[index], demoAnnouncements[target]] = [demoAnnouncements[target], demoAnnouncements[index]];
    }
    refreshDynamicRoute();
    return;
  }
  if (event.target.closest('[data-save-announcements]')) {
    demoPageState.announcementNotice = '<div class="notice-success">草稿已保存（未发布，前台暂不可见）</div>';
    refreshDynamicRoute();
    return;
  }
  if (event.target.closest('[data-publish-announcements]')) {
    demoPageState.announcementNotice = '<div class="notice-success">已发布，demo 首页公告已更新。</div>';
    refreshDynamicRoute();
    showToast('公告已发布');
    window.setTimeout(() => { navigateRoute('/'); showAnnouncementPanel(); }, 450);
    return;
  }
  if (event.target.closest('[data-close-demo-announcement]')) {
    event.target.closest('.demo-announcement').remove();
  }

  if (!event.target.closest('.pop-widget-share-wrap')) {
    const openWidgetMenu = document.querySelector('.pop-widget-share-menu:not([hidden])');
    if (openWidgetMenu) {
      openWidgetMenu.hidden = true;
      setWidgetActionActive(document.querySelector('[data-widget-share]'), false);
    }
  }

  if (!event.target.closest('[data-comment-more-wrap]')) {
    document.querySelectorAll('[data-comment-more-wrap][data-open="true"]').forEach((menu) => menu.removeAttribute('data-open'));
  }

  const openComments = document.querySelector('[data-comments-drawer][data-open="true"]');
  if (
    openComments &&
    !event.target.closest('[data-comments-drawer], .pop-widget, mark.pop-hl, [data-anchor-comment-bubble]') &&
    window.getSelection()?.isCollapsed !== false
  ) {
    closeDemoCommentsPanel();
  }
});

document.addEventListener('pointerover', (event) => {
  const anchorHighlight = event.target.closest('mark.pop-hl[data-pop-cid]');
  if (anchorHighlight && anchorHighlight.dataset.popCid !== '__pop_pending_hl') {
    showDemoAnchorHoverTip(anchorHighlight);
  }
  const homeButton = event.target.closest('[data-widget-home]');
  if (!homeButton || homeButton.contains(event.relatedTarget)) return;
  burstWidgetHome(homeButton);
});

document.addEventListener('pointerout', (event) => {
  const anchorHighlight = event.target.closest('mark.pop-hl[data-pop-cid]');
  if (!anchorHighlight) return;
  const relatedHighlight = event.relatedTarget?.closest?.('mark.pop-hl[data-pop-cid]');
  if (relatedHighlight?.dataset.popCid === anchorHighlight.dataset.popCid) return;
  clearDemoAnchorHoverTip();
});

document.addEventListener('mouseup', handleDemoAnchorSelection);

document.addEventListener('mousedown', (event) => {
  if (event.target.closest('[data-anchor-comment-bubble]')) {
    event.preventDefault();
    return;
  }
  if (event.target.closest('[data-comments-drawer], .pop-widget')) return;
  clearDemoAnchorBubble();
});

function addAdminFromInputs(usernameSelector, noteSelector) {
  const usernameInput = document.querySelector(usernameSelector);
  const noteInput = document.querySelector(noteSelector);
  const username = usernameInput?.value.trim();
  if (!username || demoAdminUsers.some((item) => item.username === username)) {
    showToast(username ? '该管理员已存在' : '请填写 username');
    return;
  }
  demoAdminUsers.push({ username, note: noteInput?.value.trim() ?? '', createdAt: '2026-08-08', createdBy: demoUser.username });
  refreshDynamicRoute();
  showToast('管理员已添加');
}

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-settings-visibility]') && profileSettingsUi) {
    const work = findDemoWork(profileSettingsUi.workId);
    if (!work) return;
    work.visibility = event.target.value;
    syncProfileSettingsPresentation(work);
    renderProfileSettingsPanel();
    return;
  }
  if (event.target.matches('[data-settings-toolbar-draft]') && profileSettingsUi) {
    profileSettingsUi.advancedDraft.toolbarHidden = !event.target.checked;
    return;
  }
  if (event.target.matches('[data-visibility-select]')) {
    document.querySelector('[data-grant-section]').hidden = event.target.value !== 'specified';
  }
  if (event.target.matches('[data-work-visibility-filter], [data-work-search]')) filterWorksTable();
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-settings-title]') && profileSettingsUi) {
    const work = findDemoWork(profileSettingsUi.workId);
    if (!work) return;
    work.title = event.target.value;
    const shell = event.target.closest('.profile-settings-input-shell');
    const errorNode = document.querySelector('[data-settings-title-error]');
    const invalid = !event.target.value.trim();
    shell?.classList.toggle('is-error', invalid);
    if (errorNode) errorNode.hidden = !invalid;
    const count = document.querySelector('[data-settings-title-count]');
    if (count) count.textContent = `${event.target.value.length}/50`;
    syncProfileSettingsPresentation(work);
    return;
  }
  if (event.target.matches('[data-settings-tag-input]')) {
    renderProfileTagSuggestions(event.target);
    return;
  }
  if (event.target.matches('[data-settings-grant-search]') && profileSettingsUi) {
    profileSettingsUi.searchQuery = event.target.value;
    renderProfilePermissionSearchResults();
    return;
  }
  if (event.target.matches('[data-settings-proxy-draft]') && profileSettingsUi) {
    profileSettingsUi.advancedDraft.proxyConfig = event.target.value;
    event.target.closest('[data-settings-proxy-editor]')?.classList.remove('is-error');
    const errorNode = document.querySelector('[data-settings-proxy-error]');
    if (errorNode) errorNode.hidden = true;
    return;
  }
  if (event.target.matches('[data-work-search]')) filterWorksTable();
  if (event.target.matches('[data-comment-input]')) {
    event.target.closest('[data-comment-composer]').querySelector('[data-submit-comment]').disabled = demoCommentUi.sending || !event.target.value.trim();
  }
  const row = event.target.closest('[data-announcement-index]');
  if (row && (event.target.matches('[data-announcement-title]') || event.target.matches('[data-announcement-content]'))) {
    const item = demoAnnouncements[Number(row.dataset.announcementIndex)];
    if (event.target.matches('[data-announcement-title]')) item.title = event.target.value;
    else item.content = event.target.value;
  }
});

document.addEventListener('focusin', (event) => {
  if (event.target.matches('[data-settings-tag-input]')) renderProfileTagSuggestions(event.target);
  if (event.target.matches('[data-settings-grant-search]') && event.target.value.trim()) renderProfilePermissionSearchResults();
  if (event.target.matches('[data-comment-input]')) {
    event.target.closest('[data-comment-composer]').classList.remove('collapsed');
  }
});

document.addEventListener('focusout', (event) => {
  if (event.target.matches('[data-settings-tag-input]')) {
    window.setTimeout(() => {
      if (document.activeElement?.closest?.('.profile-settings-tag-composer')) return;
      const suggestions = document.querySelector('[data-settings-tag-suggestions]');
      if (suggestions) suggestions.hidden = true;
    }, 0);
  }
  if (!event.target.matches('[data-comment-input]')) return;
  window.setTimeout(() => {
    const composer = event.target.closest('[data-comment-composer]');
    if (!composer || composer.contains(document.activeElement)) return;
    if (!event.target.value.trim() && !demoCommentUi.pendingAnchor && !demoCommentUi.replyTarget) {
      composer.classList.add('collapsed');
    }
  }, 0);
});

function filterWorksTable() {
  const query = document.querySelector('[data-work-search]')?.value.trim().toLowerCase() ?? '';
  const visibility = document.querySelector('[data-work-visibility-filter]')?.value ?? '';
  document.querySelectorAll('[data-work-row]').forEach((row) => {
    row.hidden = Boolean((query && !row.dataset.title.includes(query)) || (visibility && row.dataset.visibility !== visibility));
  });
}

document.addEventListener('keydown', (event) => {
  if (event.target.matches('[data-settings-tag-input]') && event.key === 'Enter') {
    event.preventDefault();
    addProfileSettingsTag();
    return;
  }
  if (event.key === 'Escape') {
    const suggestions = document.querySelector('[data-settings-tag-suggestions]:not([hidden])');
    const searchResults = document.querySelector('[data-settings-search-results]:not([hidden])');
    if (suggestions || searchResults) {
      if (suggestions) suggestions.hidden = true;
      if (searchResults) searchResults.hidden = true;
      event.stopImmediatePropagation();
      return;
    }
  }
  if (event.target.matches('[data-comment-input]') && (event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    document.querySelector('[data-submit-comment]')?.click();
    return;
  }
  if (event.key !== 'Escape') return;
  const openCommentMenu = document.querySelector('[data-comment-more-wrap][data-open="true"]');
  if (openCommentMenu) {
    openCommentMenu.removeAttribute('data-open');
    return;
  }
  clearDemoAnchorBubble();
  if (document.querySelector('[data-comments-drawer][data-open="true"]')) closeDemoCommentsPanel();
  closeDemoModal();
  document.body.classList.remove('modal-open');
});

window.addEventListener('hashchange', renderRoute);

function openInboxComment(workId) {
  const targetRoute = `/works/${workId || '7188'}`;
  if (currentRoute() !== targetRoute) navigateRoute(targetRoute);
  else renderRoute();
  let attempts = 0;
  const openWhenReady = () => {
    const drawer = document.querySelector('[data-comments-drawer]');
    const input = document.querySelector('[data-comment-input]');
    if ((!drawer || !input) && attempts++ < 12) {
      window.setTimeout(openWhenReady, 50);
      return;
    }
    if (!drawer || !input) return;
    openDemoCommentsPanel('work');
    window.setTimeout(() => {
      document.querySelector('[data-comment-thread]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const activeInput = document.querySelector('[data-comment-input]');
      activeInput?.focus({ preventScroll: true });
      activeInput?.closest('[data-comment-composer]')?.classList.remove('collapsed');
    }, 320);
  };
  window.setTimeout(openWhenReady, 0);
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin || event.data?.source !== 'popo-inbox') return;
  if (event.data.action === 'open-comment') openInboxComment(event.data.workId);
  if (event.data.action === 'open-work') navigateRoute(`/works/${event.data.workId || '7188'}`);
});

renderRoute();
