/* Static prototype only. No real account data, tracking or network requests. */
(() => {
  const host = document.getElementById('personalReport');
  if (!host) return;
  const query = new URLSearchParams(location.search);
  const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  const baseline = {
    cheerPeople: 12, cheers: 38, previousCheerPeople: 8,
    visits: 86, visitors: 62, replies: 6, replyPeople: 3,
    badges: 1, viewedWorks: 18, givenCheers: 10, writtenComments: 4,
    published: 0, works: [], firstWeek: false,
    dailyCheers: [3, 6, 4, 5, 8, 7, 5],
    dailyVisits: [8, 12, 10, 16, 15, 14, 11],
    dailyReplies: [0, 1, 0, 2, 1, 1, 1]
  };
  const scenarios = {
    viewer: { ...baseline },
    creator: { ...baseline, published: 2, works: [
      { name: '团队周报可视化面板', views: 1286, shares: 14 },
      { name: '季度 OKR 追踪器', views: 846, shares: 5 },
      { name: '活动落地页 Demo', views: 392, shares: 2 }
    ] },
    quiet: {
      ...baseline, cheerPeople: 0, cheers: 0, previousCheerPeople: null,
      visits: 0, visitors: 0, replies: 0, replyPeople: 0, badges: 0,
      viewedWorks: 7, givenCheers: 2, writtenComments: 0, firstWeek: true,
      dailyCheers: [0, 0, 0, 0, 0, 0, 0],
      dailyVisits: [0, 0, 0, 0, 0, 0, 0],
      dailyReplies: [0, 0, 0, 0, 0, 0, 0]
    }
  };
  let scenario = Object.hasOwn(scenarios, query.get('report')) ? query.get('report') : 'viewer';
  // Personal-interaction cheers are a design hypothesis, not an existing capability claim.
  let cheerScope = query.get('cheers') === 'works-only' ? 'works-only' : 'personal';
  let selectedMetric = null;
  const data = () => scenarios[scenario];
  const showCheers = () => cheerScope === 'personal' || data().works.length > 0;
  const fmt = n => n == null ? '—' : n.toLocaleString('zh-CN');
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function metric(key, label, value, unit, note) {
    return `<button class="pr-metric" type="button" data-metric="${key}" aria-pressed="false" aria-controls="reportInsight">
      <span class="pr-metric-label">${label}<i aria-hidden="true">↗</i></span>
      <span class="pr-metric-number"><b>${fmt(value)}</b><small>${unit}</small></span>
      <span class="pr-metric-note">${note}</span>
    </button>`;
  }

  function creatorSection(d) {
    if (!d.works.length) return '';
    return `<details class="pr-creator"><summary>你的作品也有新动静 <small>创作补充</small></summary>
      <div class="pr-detail-body"><p>本周发布 ${d.published} 个作品 · 作品被转发 ${d.works.reduce((s,w) => s + w.shares, 0)} 次</p>
      ${d.works.map(w => `<div class="pr-work-row"><b>${escape(w.name)}</b><small>${fmt(w.views)} 次作品浏览 · ${w.shares} 次转发</small></div>`).join('')}
      <p>作品浏览与个人主页浏览分别统计，不叠加。</p></div></details>`;
  }

  function table(d) {
    const cheerColumn = showCheers();
    return `<details class="pr-details" id="personalReportDetails"><summary><span class="pr-expand-label">展开本周明细</span><span class="pr-collapse-label">收起本周明细</span></summary>
      <div class="pr-detail-body"><table class="pr-table"><caption class="sr-only">8 月 24 日至 30 日个人互动明细，演示数据</caption>
      <thead><tr><th scope="col">日期</th>${cheerColumn ? '<th scope="col">打气次数</th>' : ''}<th scope="col">主页浏览</th><th scope="col">收到回复</th></tr></thead>
      <tbody>${weekdays.map((day,i) => `<tr><td>08.${24+i} · 周${day}</td>${cheerColumn ? `<td>${fmt(d.dailyCheers[i])}</td>` : ''}<td>${fmt(d.dailyVisits[i])}</td><td>${fmt(d.dailyReplies[i])}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td>本周合计</td>${cheerColumn ? `<td>${fmt(d.cheers)}</td>` : ''}<td>${fmt(d.visits)}</td><td>${fmt(d.replies)}</td></tr></tfoot></table>
      <p>“人”按整周去重，“次 / 条”按行为统计。主页浏览不含自己；不展示访客身份。无对比基数时不计算增长率。</p>
      </div></details>`;
  }

  function render(keepDemoOpen = false) {
    const d = data();
    selectedMetric = null;
    const delta = d.previousCheerPeople != null && d.previousCheerPeople > 0 ? d.cheerPeople - d.previousCheerPeople : null;
    const cheerNote = d.cheers ? `共 ${d.cheers} 次${delta > 0 ? ` · 比上周多 ${delta} 人` : ''}` : '还没有新打气，慢慢来';
    const notes = d.firstWeek ? '这周先从遇见喜欢的作品开始。' : '为你收好这一周的回应、来访与小成就。';
    const noFeedback = d.cheers === 0 && d.visits === 0 && d.replies === 0 && d.badges === 0;
    host.innerHTML = `<div class="pr-intro">
      <div class="pr-meta"><span>08.24 — 08.30</span><span class="pr-private">仅你可见 · 示例</span></div>
      <h3>${d.firstWeek ? '慢慢逛，也很好' : '你的参与，也被看见了'}</h3><p>${notes}</p>
      </div>
      <div class="pr-section-label"><span>这一周，与你有关</span><small>${noFeedback ? '从喜欢开始' : '点数字，看看详情'}</small></div>
      ${noFeedback ? `<div class="pr-empty"><img src="./images/popo-ip/popo.png" alt=""/><div><h4>新的回应，还在路上</h4><p>你已经遇见 ${d.viewedWorks} 个作品，送出了 ${d.givenCheers} 次打气。<br/>有了来访和回复，这里会帮你记下。</p></div></div>` : `<div class="pr-metrics${showCheers() ? '' : ' pr-metrics--three'}" aria-label="每周冒泡核心数据">
        ${showCheers() ? metric('cheers', '收到打气', d.cheerPeople, '人', cheerNote) : ''}
        ${metric('visits', '主页被浏览', d.visits, '次', d.visits ? `${d.visitors} 位访客 · 不含自己` : '还没有新来访')}
        ${metric('replies', '收到回复', d.replies, '条', d.replies ? `${d.replyPeople} 位朋友回应了你` : '还没有新回复')}
        ${metric('badges', '点亮徽章', d.badges, '枚', d.badges ? '「打气搭子」收入藏馆' : '小小的参与，也能积攒成就')}
      </div>`}
      <section class="pr-insight" id="reportInsight" aria-label="指标详情" aria-live="polite" hidden></section>
      <section class="pr-footprints" aria-label="我的浏览与参与"><h4>你也留下了这些小足迹</h4><div class="pr-footprint-grid">
        <div><b>${d.viewedWorks}</b><small>看过的作品 / 个</small></div><div><b>${d.givenCheers}</b><small>送出的打气 / 次</small></div><div><b>${d.writtenComments}</b><small>留下的评论 / 条</small></div>
      </div></section>
      ${d.badges ? `<a class="pr-badge" href="./cabinet.html?sheet=16"><img src="./badges/b16.png" alt="打气搭子徽章"/><div><strong>认真打气，也是一种闪光</strong><small>「打气搭子」已点亮 · 去荣誉藏馆</small></div><span aria-hidden="true">↗</span></a>` : ''}
      ${creatorSection(d)}
      <div class="pr-note"><img src="./images/popo-ip/coco.png" alt=""/><span><b>coco 帮你记着：</b>${d.firstWeek ? '不必急着发布作品，发现喜欢的内容、留下一句回应，都有意义。' : '看见好作品、送出打气、认真回应，都是你在 popo 留下的参与。'}</span></div>
      ${table(d)}
      <div class="pr-footer"><span>每周一更新 · 统计上一完整周</span><span>全部为演示数据</span></div>
      <details class="pr-demo"${keepDemoOpen ? ' open' : ''}><summary>原型演示 · 切换用户状态</summary>
        <div class="pr-scenarios" role="group" aria-label="演示用户状态">${[['viewer','浏览为主'],['creator','有作品'],['quiet','暂无互动']].map(([key,label]) => `<button type="button" data-scenario="${key}" aria-pressed="${scenario === key}">${label}</button>`).join('')}</div>
        <label>打气范围<select id="reportCheerScope" aria-label="演示打气统计范围"><option value="personal"${cheerScope === 'personal' ? ' selected' : ''}>个人互动（方案假设）</option><option value="works-only"${cheerScope === 'works-only' ? ' selected' : ''}>仅作品</option></select></label>
        <p>打气是否支持主页 / 评论待确认。若仅支持作品，无作品时隐藏“收到打气”；作品数据只在有作品时出现。此处仅为评审开关，不是用户身份设置。</p>
      </details>`;
  }

  function insight(key) {
    const d = data();
    if (key === 'cheers') return {
      title: d.cheers ? `${d.cheerPeople} 位朋友，给了你 ${d.cheers} 次打气` : '还没有收到新打气',
      body: d.cheers ? `<div class="pr-people"><span class="pr-person">W</span><span class="pr-person">L</span><span class="pr-person">S</span><small>wangwu、lisi、sunqi 等 ${d.cheerPeople} 人</small></div><p>同一个人打气多次，只计为 1 位打气用户。此处展示主动互动，不展示访问者身份。</p>` : '<p>这一周的互动会在这里慢慢积累，不需要为一个数字着急。</p>'
    };
    if (key === 'visits') return {
      title: d.visits ? `${d.visitors} 位访客，带来了 ${d.visits} 次主页浏览` : '这一周，还没有新来访',
      body: d.visits ? `<div class="pr-chart" role="img" aria-label="主页浏览：${d.dailyVisits.map((n,i) => `周${weekdays[i]} ${n} 次`).join('，')}">${d.dailyVisits.map((n,i) => `<div><i style="height:${n / Math.max(...d.dailyVisits) * 55}px"></i><small>周${weekdays[i]}</small></div>`).join('')}</div><p>只统计别人访问你的个人主页，不含你自己访问，也不包含作品页浏览。仅展示汇总，不开放访客名单。</p>` : '<p>这里只记录别人访问你的个人主页；你自己浏览作品的记录在“小足迹”中。</p>'
    };
    if (key === 'replies') return {
      title: d.replies ? `${d.replyPeople} 位朋友，留下了 ${d.replies} 条回复` : '还没有新的回复',
      body: d.replies ? '<div class="pr-reply">wangwu：谢谢建议，已经把说明补上啦！<small>回复了你在《团队周报可视化面板》下的评论</small></div><p>仅统计明确回复你的评论，不把作品下所有人的讨论算作对你的回应。</p>' : '<p>有了针对你评论的回复，这里会帮你整理好。</p>'
    };
    return {
      title: d.badges ? '本周新点亮「打气搭子」' : '你的徽章故事，刚刚开始',
      body: d.badges ? '<p>为 10 个不同作品打气，达成「打气搭子」条件。浏览和互动也能获得徽章，不需要先发布作品。</p><a class="pr-badge" href="./cabinet.html?sheet=16"><img src="./badges/b16.png" alt="打气搭子徽章"/><div><strong>去荣誉藏馆看看</strong><small>已接入当前 Demo 的徽章详情页</small></div><span>→</span></a>' : '<p>发现喜欢的作品、送出第一份鼓励，也能成为你的第一枚徽章。没有发布作品也没关系。</p><a class="pr-badge" href="./cabinet.html?zero=1"><div><strong>看看有哪些徽章可以点亮</strong></div><span>→</span></a>'
    };
  }

  function updateInsight() {
    const panel = document.getElementById('reportInsight');
    host.querySelectorAll('[data-metric]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.metric === selectedMetric)));
    panel.hidden = !selectedMetric;
    if (!selectedMetric) { panel.innerHTML = ''; return; }
    const content = insight(selectedMetric);
    panel.innerHTML = `<div class="pr-insight-head"><h4>${content.title}</h4><button class="pr-close" type="button" data-report-close aria-label="收起指标详情">×</button></div>${content.body}`;
    panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  host.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.metric) {
      selectedMetric = selectedMetric === button.dataset.metric ? null : button.dataset.metric;
      updateInsight();
    } else if (button.hasAttribute('data-report-close')) {
      const previous = selectedMetric;
      selectedMetric = null;
      updateInsight();
      host.querySelector(`[data-metric="${previous}"]`)?.focus({ preventScroll: true });
    } else if (button.dataset.scenario) {
      scenario = button.dataset.scenario;
      render(true);
      host.querySelector(`[data-scenario="${scenario}"]`)?.focus({ preventScroll: true });
    }
  });
  host.addEventListener('change', event => {
    if (event.target.id !== 'reportCheerScope') return;
    cheerScope = event.target.value;
    render(true);
    host.querySelector('#reportCheerScope').focus({ preventScroll: true });
  });
  render();
})();
