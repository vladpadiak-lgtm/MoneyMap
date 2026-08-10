const STORAGE_KEY = "moneymap.github-pages.v1";
const CURRENT_MONTH = "2026-08";

const CATEGORY_SEED = [
  { id: 1, name: "Зарплата", type: "income", color: "#7BC96F", icon: "▣" },
  { id: 2, name: "Фриланс", type: "income", color: "#A7D8FF", icon: "✦" },
  { id: 3, name: "Житло", type: "expense", color: "#F5A782", icon: "⌂" },
  { id: 4, name: "Продукти", type: "expense", color: "#C7F34A", icon: "◇" },
  { id: 5, name: "Транспорт", type: "expense", color: "#A7D8FF", icon: "→" },
  { id: 6, name: "Дозвілля", type: "expense", color: "#B8A8E8", icon: "✣" },
  { id: 7, name: "Здоров’я", type: "expense", color: "#F6C96B", icon: "+" },
  { id: 8, name: "Інше", type: "expense", color: "#B8B8AE", icon: "•••" },
];

const TRANSACTION_SEED = [
  { id: 101, categoryId: 1, type: "income", amountCents: 320000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-08-05", note: "" },
  { id: 102, categoryId: 4, type: "expense", amountCents: 8640, description: "Продукти на тиждень", merchant: "Yeme", date: "2026-08-09", note: "" },
  { id: 103, categoryId: 3, type: "expense", amountCents: 89000, description: "Оренда квартири", merchant: "Оренда", date: "2026-08-02", note: "" },
  { id: 104, categoryId: 5, type: "expense", amountCents: 4560, description: "Проїзний", merchant: "IDS BK", date: "2026-08-03", note: "" },
  { id: 105, categoryId: 6, type: "expense", amountCents: 2890, description: "Кіно", merchant: "Cinema City", date: "2026-08-08", note: "" },
  { id: 106, categoryId: 2, type: "income", amountCents: 78000, description: "Дизайн лендингу", merchant: "Freelance", date: "2026-07-28", note: "" },
  { id: 107, categoryId: 4, type: "expense", amountCents: 25830, description: "Продукти", merchant: "Billa", date: "2026-07-22", note: "" },
  { id: 108, categoryId: 3, type: "expense", amountCents: 89000, description: "Оренда квартири", merchant: "Оренда", date: "2026-07-02", note: "" },
  { id: 109, categoryId: 1, type: "income", amountCents: 320000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-07-05", note: "" },
  { id: 110, categoryId: 1, type: "income", amountCents: 310000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-06-05", note: "" },
  { id: 111, categoryId: 3, type: "expense", amountCents: 89000, description: "Оренда квартири", merchant: "Оренда", date: "2026-06-02", note: "" },
  { id: 112, categoryId: 4, type: "expense", amountCents: 34200, description: "Продукти", merchant: "Tesco", date: "2026-06-18", note: "" },
  { id: 113, categoryId: 1, type: "income", amountCents: 300000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-05-05", note: "" },
  { id: 114, categoryId: 3, type: "expense", amountCents: 87000, description: "Оренда квартири", merchant: "Оренда", date: "2026-05-02", note: "" },
  { id: 115, categoryId: 1, type: "income", amountCents: 300000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-04-05", note: "" },
  { id: 116, categoryId: 4, type: "expense", amountCents: 31800, description: "Продукти", merchant: "Kaufland", date: "2026-04-16", note: "" },
  { id: 117, categoryId: 1, type: "income", amountCents: 290000, description: "Зарплата", merchant: "Northstar Studio", date: "2026-03-05", note: "" },
  { id: 118, categoryId: 3, type: "expense", amountCents: 87000, description: "Оренда квартири", merchant: "Оренда", date: "2026-03-02", note: "" },
];

const DEFAULT_STATE = {
  profile: { name: "Влад", email: "demo@moneymap.app", registered: false },
  categories: CATEGORY_SEED,
  transactions: TRANSACTION_SEED,
  budgets: [
    { id: 201, categoryId: 4, month: CURRENT_MONTH, limitCents: 45000 },
    { id: 202, categoryId: 5, month: CURRENT_MONTH, limitCents: 15000 },
    { id: 203, categoryId: 6, month: CURRENT_MONTH, limitCents: 20000 },
    { id: 204, categoryId: 7, month: CURRENT_MONTH, limitCents: 12000 },
  ],
  goals: [
    { id: 301, name: "Подушка безпеки", targetCents: 600000, currentCents: 378000, deadline: "2027-02-01", color: "#C7F34A", icon: "◆", status: "active" },
    { id: 302, name: "Подорож до Ісландії", targetCents: 280000, currentCents: 154000, deadline: "2027-06-15", color: "#A7D8FF", icon: "↗", status: "active" },
    { id: 303, name: "Новий ноутбук", targetCents: 180000, currentCents: 162000, deadline: "2026-11-30", color: "#F5A782", icon: "▰", status: "active" },
  ],
};

const NAV = [
  ["dashboard", "Головна", "⌂"],
  ["transactions", "Транзакції", "↕"],
  ["budgets", "Бюджети", "◫"],
  ["goals", "Цілі", "◎"],
];

const VIEW_META = {
  dashboard: ["Фінансова картина", "Огляд за серпень"],
  transactions: ["Транзакції", "Усі рухи коштів"],
  budgets: ["Бюджети", "Ліміти на серпень"],
  goals: ["Фінансові цілі", "Майбутнє у цифрах"],
};

let state = loadState();
let filters = { search: "", type: "all", category: "all", month: "all" };
let toastTimer;
const root = document.querySelector("#site-root");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.transactions && saved?.categories && saved?.budgets && saved?.goals) return saved;
  } catch {
    // Ignore corrupted browser data and restore the safe demo state.
  }
  return clone(DEFAULT_STATE);
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(cents, compact = false) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: compact ? 0 : 2,
    maximumFractionDigits: compact ? 0 : 2,
  }).format(cents / 100);
}

function readableDate(value) {
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`));
}

function monthLabel(value) {
  return new Intl.DateTimeFormat("uk-UA", { month: "short" }).format(new Date(`${value}-01T12:00:00`)).replace(".", "");
}

function currentRoute() {
  const route = location.hash.replace(/^#\/?/, "").split("?")[0];
  return route || "home";
}

function brand(extra = "") {
  return `<a class="brand ${extra}" href="#home" aria-label="MoneyMap — на головну"><span class="brand-mark" aria-hidden="true"><i></i>M</span><span>MoneyMap</span></a>`;
}

function render() {
  const route = currentRoute();
  document.title = route === "home" ? "MoneyMap — особисті фінанси без хаосу" : `${VIEW_META[route]?.[0] ?? "MoneyMap"} — MoneyMap`;
  if (route === "home") root.innerHTML = landingView();
  else if (route === "login" || route === "register") root.innerHTML = authView(route);
  else if (VIEW_META[route]) root.innerHTML = appView(route);
  else location.hash = "#home";
  window.scrollTo({ top: 0, behavior: "instant" });
}

function landingView() {
  return `
    <main class="marketing-page pages-landing">
      <header class="marketing-header">
        ${brand("marketing-brand")}
        <nav aria-label="Навігація"><a href="#features">Можливості</a><a href="#how">Як це працює</a><a href="#security">Приватність</a></nav>
        <div><a class="text-link" href="#login">Увійти</a><a class="button button-dark" href="#register">Почати безкоштовно <span>↗</span></a></div>
      </header>
      <section class="hero-section">
        <div class="hero-copy">
          <span class="hero-badge"><i></i> Ваші гроші. Ваші правила.</span>
          <h1>Гроші під контролем.<br>Життя — <em>за планом.</em></h1>
          <p>MoneyMap перетворює щоденні витрати на ясну фінансову картину: бачте головне, тримайте бюджет і рухайтеся до своїх цілей.</p>
          <div class="hero-actions"><a class="button button-lime button-large" href="#register">Створити свій MoneyMap <span>→</span></a><a class="button button-plain button-large" href="#dashboard">Переглянути демо <span>↗</span></a></div>
          <div class="trust-row"><span>✓ Без банківської картки</span><span>✓ Дані у вашому браузері</span><span>✓ CSV імпорт</span></div>
          <span class="pages-badge">GitHub Pages edition — працює повністю на цій сторінці</span>
        </div>
        <div class="hero-visual" aria-label="Попередній вигляд MoneyMap">
          <div class="visual-top"><span class="mini-brand"><b>M</b> MoneyMap</span><span class="visual-avatar">${esc(state.profile.name.slice(0,1).toUpperCase())}</span></div>
          <div class="visual-nav"><i></i><i></i><i></i><i></i></div>
          <div class="visual-content">
            <div class="visual-heading"><span>Фінансова картина</span><button>＋ Додати</button></div>
            <div class="visual-balance"><small>Доступний баланс</small><strong>€7 280,50</strong><span>↑ 42% цього місяця</span><i class="visual-orbit"></i></div>
            <div class="visual-cards"><div><small>Доходи</small><strong>€3 200</strong></div><div><small>Витрати</small><strong>€1 305</strong></div><div><small>У цілях</small><strong>€6 940</strong></div></div>
            <div class="visual-chart"><span>Грошовий потік</span><div>${[36,62,48,78,66,91].map(height => `<i style="height:${height}%"></i>`).join("")}</div></div>
            <div class="visual-donut"><i></i><span><small>Витрати</small><strong>€1 305</strong></span></div>
          </div>
          <div class="floating-receipt"><span>✓</span><div><small>Бюджет у нормі</small><strong>Залишилось €486</strong></div></div>
        </div>
      </section>
      <section class="value-strip" id="features">
        <div><strong>01</strong><span>Одна картина</span><p>Баланс, доходи й витрати без зайвого шуму.</p></div>
        <div><strong>02</strong><span>Реальні межі</span><p>Бюджети, які видно до перевитрати.</p></div>
        <div><strong>03</strong><span>Відчутний прогрес</span><p>Цілі з сумою, дедлайном і темпом.</p></div>
      </section>
      <section class="feature-section">
        <div class="section-heading"><span class="eyebrow">Один простір замість таблиць</span><h2>Фінанси, які нарешті<br><em>можна зрозуміти.</em></h2><p>Додавайте й редагуйте транзакції, фільтруйте історію, імпортуйте CSV, плануйте бюджети та поповнюйте цілі.</p></div>
        <div class="feature-grid">
          <article class="feature-card feature-wide"><span class="feature-number">01</span><div><h3>Транзакції без рутини</h3><p>Пошук, фільтри, редагування та чистий CSV імпорт/експорт.</p></div><div class="feature-table"><i></i><i></i><i></i><i></i></div></article>
          <article class="feature-card lime-card"><span class="feature-number">02</span><div><h3>Бюджети, що попереджають</h3><p>Окремі ліміти й чесний залишок до кінця місяця.</p></div><div class="feature-progress"><span><i style="width:68%"></i></span><small>68% використано</small></div></article>
          <article class="feature-card dark-card"><span class="feature-number">03</span><div><h3>Цілі з маршрутом</h3><p>Сума, дедлайн, прогрес і зрозумілий наступний крок.</p></div><div class="feature-goal"><i></i><span><strong>€1 620</strong> / €1 800</span><b>90%</b></div></article>
          <article class="feature-card feature-wide chart-card"><span class="feature-number">04</span><div><h3>Аналітика без бухгалтерської мови</h3><p>Категорії та динаміка за місяцями відразу на дашборді.</p></div><div class="mini-bars">${[35,61,48,77,65,88,72,96].map((height,index)=>`<i style="height:${height}%;background:${index%2?'var(--lime)':'var(--ink)'}"></i>`).join("")}</div></article>
        </div>
      </section>
      <section class="how-section" id="how">
        <div class="section-heading compact"><span class="eyebrow light">Три кроки до ясності</span><h2>Від хаосу до плану<br>за кілька хвилин.</h2></div>
        <ol><li><span>1</span><div><strong>Створіть профіль</strong><p>Ім’я та email зберігаються тільки у вашому браузері.</p></div></li><li><span>2</span><div><strong>Додайте рухи коштів</strong><p>Вручну або одним CSV-файлом.</p></div></li><li><span>3</span><div><strong>Дійте за картиною</strong><p>Налаштуйте бюджети й фінансові цілі.</p></div></li></ol>
      </section>
      <section class="security-section" id="security"><div><span class="security-mark">◆</span><span class="eyebrow">Приватність локально</span><h2>Ваші цифри залишаються у вашому браузері.</h2><p>GitHub Pages‑версія не надсилає фінансові дані на сервер. Ви можете експортувати їх у CSV або очистити профіль одним кліком.</p></div><ul><li><span>01</span>Без банківських паролів</li><li><span>02</span>Локальне збереження на пристрої</li><li><span>03</span>Відкритий CSV-експорт</li></ul></section>
      <section class="final-cta"><span class="eyebrow light">Почніть із сьогодні</span><h2>Дайте кожному євро<br><em>своє місце на карті.</em></h2><a class="button button-lime button-large" href="#register">Створити MoneyMap <span>→</span></a></section>
      <footer class="marketing-footer">${brand("marketing-brand")}<p>Особисті фінанси без хаосу.</p><div><a href="#login">Увійти</a><a href="#dashboard">Демо</a><span>© 2026 MoneyMap</span></div></footer>
    </main>`;
}

function authView(route) {
  const registered = state.profile.registered;
  const register = route === "register";
  return `
    <main class="auth-page ${register ? "register-page" : ""}">
      ${brand("auth-brand")}
      <section class="auth-card">
        <span class="auth-kicker">${register ? "Почніть із ясності" : "Раді бачити знову"}</span>
        <h1>${register ? "Створіть власну карту грошей" : registered ? "Ваш профіль готовий" : "Увійдіть у фінансовий простір"}</h1>
        <p>${register ? "Профіль і всі фінансові записи зберігатимуться локально у цьому браузері." : "Введіть email профілю. Окремий пароль для локальної Pages‑версії не потрібен."}</p>
        <form class="pages-auth-form" data-form="auth" data-mode="${route}">
          ${register ? `<label><span>Ваше ім’я</span><input name="name" required autocomplete="name" value="${esc(registered ? state.profile.name : "")}" placeholder="Наприклад, Влад"></label>` : ""}
          <label><span>Email</span><input name="email" type="email" required autocomplete="email" value="${esc(registered ? state.profile.email : "")}" placeholder="name@example.com"></label>
          <button class="button ${register ? "button-lime" : "button-dark"}" type="submit">${register ? "Створити MoneyMap" : "Увійти"} <span>→</span></button>
        </form>
        <small>${register ? "Вже маєте профіль?" : "Ще немає профілю?"} <a href="#${register ? "login" : "register"}">${register ? "Увійти" : "Створити MoneyMap"}</a></small>
      </section>
      <p class="auth-privacy">◆ Дані залишаються на цьому пристрої</p>
    </main>`;
}

function appView(view) {
  const [title, kicker] = VIEW_META[view];
  return `
    <div class="app-frame pages-shell">
      <aside class="sidebar">
        ${brand()}
        <nav class="side-nav" aria-label="Основна навігація"><p>Мій простір</p>${NAV.map(([key,label,symbol])=>`<a class="${view===key?'active':''}" href="#${key}"><span aria-hidden="true">${symbol}</span>${label}</a>`).join("")}</nav>
        <div class="sidebar-spacer"></div>
        <div class="money-note"><span>GitHub Pages</span><p>Ваші зміни автоматично зберігаються у цьому браузері.</p></div>
        <div class="profile-chip"><span class="avatar">${esc(state.profile.name.slice(0,1).toUpperCase())}</span><span><strong>${esc(state.profile.name)}</strong><small>${esc(state.profile.registered ? state.profile.email : "Демо-профіль")}</small></span><button class="pages-user-menu" data-action="logout" title="Вийти">↗</button></div>
      </aside>
      <main class="app-main">
        <header class="app-header">
          <div class="mobile-brand"><a class="brand brand-compact" href="#home"><span class="brand-mark"><i></i>M</span></a></div>
          <div><span class="eyebrow">${kicker}</span><h1>${title}</h1></div>
          <div class="header-actions"><span class="header-avatar">${esc(state.profile.name.slice(0,1).toUpperCase())}</span><button class="button button-dark header-add" data-action="new-transaction" type="button"><span>＋</span> Додати транзакцію</button></div>
        </header>
        <div class="pages-view">${viewContent(view)}</div>
      </main>
      <nav class="mobile-nav" aria-label="Мобільна навігація">${NAV.map(([key,label,symbol])=>`<a class="${view===key?'active':''}" href="#${key}"><span>${symbol}</span><small>${label}</small></a>`).join("")}</nav>
      <div id="modal-host"></div>
    </div>`;
}

function viewContent(view) {
  if (view === "dashboard") return dashboardView();
  if (view === "transactions") return transactionsView();
  if (view === "budgets") return budgetsView();
  return goalsView();
}

function dashboardView() {
  const monthRows = state.transactions.filter(row => row.date.startsWith(CURRENT_MONTH));
  const income = sum(monthRows.filter(row => row.type === "income"), "amountCents");
  const expense = sum(monthRows.filter(row => row.type === "expense"), "amountCents");
  const balance = state.transactions.reduce((total,row)=>total+(row.type==="income"?row.amountCents:-row.amountCents),0);
  const savedRate = income ? Math.max(0, Math.round(((income-expense)/income)*100)) : 0;
  const categories = categoryBreakdown(monthRows);
  const recent = [...state.transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,5);
  return `<div class="page-stack dashboard-page">
    <section class="balance-hero"><div><span class="eyebrow light">Доступний баланс</span><strong>${money(balance)}</strong><p><span class="positive-pill">↑ ${savedRate}%</span> ви зберігаєте цього місяця</p></div><div class="balance-orbit" aria-hidden="true"><i></i><i></i><i></i></div><button data-action="new-transaction">Швидкий запис <span>＋</span></button></section>
    <section class="stat-grid">${metric("Доходи",money(income),"+4,8%","green","↙")}${metric("Витрати",money(expense),"контроль","clay","↗")}${metric("У цілях",money(sum(state.goals,"currentCents")),`${state.goals.length} активні`,"blue","◎")}</section>
    <section class="pages-dashboard-grid">
      <article class="panel cashflow-panel"><div class="panel-heading"><div><h2>Грошовий потік</h2><p>Останні 6 місяців</p></div><span class="legend"><i class="income-dot"></i>Доходи <i class="expense-dot"></i>Витрати</span></div>${monthlyChart()}</article>
      <article class="panel category-panel"><div class="panel-heading"><div><h2>За категоріями</h2><p>Витрати у серпні</p></div></div>${donutChart(categories,expense)}</article>
    </section>
    <section class="panel recent-panel"><div class="panel-heading"><div><h2>Останні транзакції</h2><p>Свіжі рухи коштів</p></div><div class="panel-action"><a href="#transactions">Переглянути всі →</a></div></div><div class="recent-list">${recent.map(row=>transactionRow(row,false)).join("")||empty("Поки що немає транзакцій.")}</div></section>
  </div>`;
}

function metric(label,value,delta,tone,symbol) {
  return `<article class="metric-card"><div class="metric-symbol ${tone}">${symbol}</div><div><span>${label}</span><strong>${value}</strong></div><small class="${tone==='clay'?'muted-delta':'positive-delta'}">${delta}</small></article>`;
}

function monthlyChart() {
  const months = ["2026-03","2026-04","2026-05","2026-06","2026-07","2026-08"];
  const values = months.map(month=>{
    const rows=state.transactions.filter(row=>row.date.startsWith(month));
    return {month,income:sum(rows.filter(row=>row.type==="income"),"amountCents"),expense:sum(rows.filter(row=>row.type==="expense"),"amountCents")};
  });
  const max=Math.max(1,...values.flatMap(row=>[row.income,row.expense]));
  return `<div class="pages-month-chart" aria-label="Доходи й витрати за місяцями">${values.map(row=>`<div><span class="bars"><i style="height:${Math.max(4,row.income/max*100)}%" title="Доходи ${money(row.income)}"></i><i style="height:${Math.max(4,row.expense/max*100)}%" title="Витрати ${money(row.expense)}"></i></span><small>${monthLabel(row.month)}</small></div>`).join("")}</div>`;
}

function categoryBreakdown(rows) {
  const totals = new Map();
  rows.filter(row=>row.type==="expense").forEach(row=>totals.set(row.categoryId,(totals.get(row.categoryId)||0)+row.amountCents));
  return [...totals].map(([categoryId,amount])=>({category:state.categories.find(item=>item.id===categoryId),amount})).filter(row=>row.category).sort((a,b)=>b.amount-a.amount);
}

function donutChart(rows,total) {
  if (!rows.length || !total) return empty("Додайте витрати, щоб побачити структуру.");
  let cursor=0;
  const stops=rows.map(({category,amount})=>{const start=cursor;cursor+=amount/total*100;return `${category.color} ${start}% ${cursor}%`;}).join(",");
  return `<div class="pages-donut-wrap"><div class="pages-donut" style="background:conic-gradient(${stops})"><span><small>Всього</small><strong>${money(total,true)}</strong></span></div><div class="pages-category-list">${rows.slice(0,5).map(({category,amount})=>`<div><i style="background:${category.color}"></i><span>${esc(category.name)}</span><strong>${Math.round(amount/total*100)}%</strong></div>`).join("")}</div></div>`;
}

function transactionRow(row, editable = true) {
  const category=state.categories.find(item=>item.id===row.categoryId);
  return `<div class="transaction-row"><span class="category-icon" style="background:${category?.color||'#ddd'}">${category?.icon||'•'}</span><span class="transaction-main"><strong>${esc(row.description)}</strong><small>${esc(row.merchant||category?.name||"")}</small></span><span class="transaction-category">${esc(category?.name||"Без категорії")}</span><span class="transaction-date">${readableDate(row.date)}</span><strong class="amount ${row.type==='income'?'income':''}">${row.type==='income'?'+':'−'}${money(row.amountCents)}</strong>${editable?`<button class="row-action" data-action="edit-transaction" data-id="${row.id}" aria-label="Редагувати">•••</button>`:''}</div>`;
}

function transactionsView() {
  const months=[...new Set(state.transactions.map(row=>row.date.slice(0,7)))].sort().reverse();
  const rows=filteredTransactions();
  return `<div class="page-stack">
    <section class="panel recent-panel"><div class="pages-table-title"><div><h2>Історія операцій</h2><p>Знайдено: ${rows.length}</p></div><div class="pages-table-actions"><input id="csv-import" hidden type="file" accept=".csv,text/csv"><button class="button button-ghost" data-action="import-csv">↑ Імпорт CSV</button><button class="button button-ghost" data-action="export-csv">↓ Експорт CSV</button><button class="button button-dark" data-action="new-transaction">＋ Додати</button></div></div>
      <div class="pages-filter"><label><span>Пошук</span><input data-filter="search" value="${esc(filters.search)}" placeholder="Опис або магазин"></label><label><span>Тип</span><select data-filter="type"><option value="all">Усі</option><option value="income" ${filters.type==='income'?'selected':''}>Доходи</option><option value="expense" ${filters.type==='expense'?'selected':''}>Витрати</option></select></label><label><span>Категорія</span><select data-filter="category"><option value="all">Усі категорії</option>${state.categories.map(item=>`<option value="${item.id}" ${String(item.id)===filters.category?'selected':''}>${esc(item.name)}</option>`).join("")}</select></label><label><span>Період</span><select data-filter="month"><option value="all">За весь час</option>${months.map(month=>`<option value="${month}" ${month===filters.month?'selected':''}>${monthLabel(month)} ${month.slice(0,4)}</option>`).join("")}</select></label></div>
      <div class="table-head"><span>Операція</span><span>Категорія</span><span>Дата</span><span>Сума</span><span></span></div><div class="table-body">${rows.map(row=>transactionRow(row,true)).join("")||empty("За цими фільтрами нічого не знайдено.")}</div>
    </section>
  </div>`;
}

function filteredTransactions() {
  return [...state.transactions].filter(row=>{
    const text=`${row.description} ${row.merchant} ${row.note}`.toLocaleLowerCase("uk");
    return text.includes(filters.search.toLocaleLowerCase("uk"))&&(filters.type==="all"||row.type===filters.type)&&(filters.category==="all"||row.categoryId===Number(filters.category))&&(filters.month==="all"||row.date.startsWith(filters.month));
  }).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
}

function budgetsView() {
  const budgets=state.budgets.filter(item=>item.month===CURRENT_MONTH);
  const expenses=state.transactions.filter(row=>row.type==="expense"&&row.date.startsWith(CURRENT_MONTH));
  const totalLimit=sum(budgets,"limitCents");
  const totalSpent=sum(expenses,"amountCents");
  return `<div class="page-stack"><section class="pages-budget-head"><div><span class="eyebrow light">Загальний бюджет</span><strong>${money(totalLimit)}</strong><p>на серпень 2026</p></div><div class="summary-mini"><span>Витрачено</span><strong>${money(totalSpent)}</strong><small>${totalLimit?Math.round(totalSpent/totalLimit*100):0}% ліміту</small></div><div class="summary-mini"><span>Залишилось</span><strong style="color:var(--lime)">${money(Math.max(0,totalLimit-totalSpent))}</strong><small>до кінця місяця</small></div><button class="button button-lime" data-action="new-budget">＋ Новий бюджет</button></section>
    <section class="pages-card-grid">${budgets.map(budget=>budgetCard(budget,expenses)).join("")}<button class="budget-add-card" data-action="new-budget"><span>＋</span><strong>Додати категорію</strong><small>Створіть окремий ліміт</small></button></section>
    <section class="panel budget-insight"><div class="insight-mark">↘</div><div><span class="eyebrow">Прогноз MoneyMap</span><h2>${totalLimit&&totalSpent<totalLimit?'Ви вкладаєтесь у план':'Час переглянути ліміти'}</h2><p>За поточним темпом у вас залишиться близько <strong>${money(Math.max(0,totalLimit-totalSpent))}</strong>.</p></div></section></div>`;
}

function budgetCard(budget,expenses) {
  const category=state.categories.find(item=>item.id===budget.categoryId);
  const spent=sum(expenses.filter(row=>row.categoryId===budget.categoryId),"amountCents");
  const percent=Math.round(spent/budget.limitCents*100);
  return `<article class="budget-card"><div class="budget-card-top"><span class="category-icon large" style="background:${category?.color}">${category?.icon||'•'}</span><button data-action="edit-budget" data-id="${budget.id}">Змінити</button></div><h2>${esc(category?.name||"Категорія")}</h2><div class="budget-values"><strong>${money(spent)}</strong><span>з ${money(budget.limitCents)}</span></div><div class="progress-track"><i class="${percent>=85?'danger':''}" style="width:${Math.min(100,percent)}%;${percent<85?`background:${category?.color}`:''}"></i></div><div class="budget-footer"><span>${percent}% використано</span><strong>${money(Math.max(0,budget.limitCents-spent))} лишилось</strong></div></article>`;
}

function goalsView() {
  const target=sum(state.goals,"targetCents");
  const current=sum(state.goals,"currentCents");
  return `<div class="page-stack"><section class="pages-goal-head"><div><span class="eyebrow light">Накопичено на всі цілі</span><strong>${money(current)}</strong><p>із запланованих ${money(target)}</p></div><div class="summary-mini"><span>Загальний шлях</span><strong>${target?Math.round(current/target*100):0}%</strong><div class="progress-track dark"><i style="width:${target?Math.round(current/target*100):0}%"></i></div></div><div class="summary-mini"><span>Активні цілі</span><strong>${state.goals.filter(goal=>goal.status==='active').length}</strong><small>продовжують накопичення</small></div><button class="button button-lime" data-action="new-goal">＋ Нова ціль</button></section><section class="pages-card-grid">${state.goals.map(goal=>goalCard(goal)).join("")}<button class="goal-add-card" data-action="new-goal"><span>◎</span><strong>Нова мрія — новий план</strong><small>Вкажіть суму й дедлайн, а MoneyMap покаже прогрес.</small></button></section></div>`;
}

function goalCard(goal) {
  const percent=Math.min(100,Math.round(goal.currentCents/goal.targetCents*100));
  const days=Math.max(0,Math.ceil((new Date(goal.deadline)-new Date("2026-08-10"))/86400000));
  return `<article class="goal-card"><div class="goal-icon" style="background:${goal.color}">${goal.icon}</div><div class="goal-status"><i class="${goal.status==='completed'?'done':''}"></i>${goal.status==='completed'?'Завершено':'Активна'}</div><h2>${esc(goal.name)}</h2><div class="goal-amount"><strong>${money(goal.currentCents)}</strong><span>/ ${money(goal.targetCents)}</span></div><div class="progress-track"><i style="width:${percent}%;background:${goal.color}"></i></div><div class="goal-meta"><span><strong>${percent}%</strong> зібрано</span><span><strong>${days}</strong> днів</span></div><button class="button button-soft" data-action="contribute" data-id="${goal.id}">${goal.status==='completed'?'Ціль досягнуто ✓':'Поповнити ціль →'}</button></article>`;
}

function sum(rows,key) {
  return rows.reduce((total,row)=>total+Number(row[key]||0),0);
}

function empty(text) {
  return `<div class="pages-empty"><strong>○</strong><p>${esc(text)}</p></div>`;
}

function openTransactionModal(id) {
  const transaction=id?state.transactions.find(row=>row.id===Number(id)):null;
  const type=transaction?.type||"expense";
  const categories=state.categories.filter(item=>item.type===type);
  showModal(`<div class="pages-modal-head"><div><span class="eyebrow">MoneyMap</span><h2>${transaction?'Редагувати':'Нова'} транзакція</h2><p>Зміни одразу потраплять у звіти й бюджети</p></div><button class="pages-close" data-action="close-modal">×</button></div><form class="pages-form" data-form="transaction" data-id="${transaction?.id||''}"><label class="full"><span>Тип</span><select name="type" data-transaction-type><option value="expense" ${type==='expense'?'selected':''}>Витрата</option><option value="income" ${type==='income'?'selected':''}>Дохід</option></select></label><label class="full"><span>Опис *</span><input required name="description" value="${esc(transaction?.description||'')}" placeholder="Наприклад, продукти на тиждень"></label><label><span>Сума, € *</span><input required name="amount" inputmode="decimal" value="${transaction?transaction.amountCents/100:''}" placeholder="0,00"></label><label><span>Дата *</span><input required name="date" type="date" value="${transaction?.date||'2026-08-10'}"></label><label><span>Категорія *</span><select name="categoryId" data-category-select>${categories.map(item=>`<option value="${item.id}" ${transaction?.categoryId===item.id?'selected':''}>${esc(item.name)}</option>`).join("")}</select></label><label><span>Магазин / джерело</span><input name="merchant" value="${esc(transaction?.merchant||'')}" placeholder="Необов’язково"></label><label class="full"><span>Нотатка</span><textarea name="note" rows="3" placeholder="Додайте деталі">${esc(transaction?.note||'')}</textarea></label><p class="pages-form-error" hidden></p><div class="pages-form-actions"><button class="button button-ghost" data-action="close-modal" type="button">Скасувати</button><button class="button button-dark" type="submit">${transaction?'Зберегти зміни':'Додати транзакцію'}</button></div></form>`);
}

function openBudgetModal(id) {
  const budget=id?state.budgets.find(item=>item.id===Number(id)):null;
  const categories=state.categories.filter(item=>item.type==="expense");
  showModal(`<div class="pages-modal-head"><div><span class="eyebrow">MoneyMap</span><h2>${budget?'Змінити':'Новий'} бюджет</h2><p>Окремий ліміт для однієї категорії</p></div><button class="pages-close" data-action="close-modal">×</button></div><form class="pages-form" data-form="budget" data-id="${budget?.id||''}"><label class="full"><span>Категорія</span><select name="categoryId">${categories.map(item=>`<option value="${item.id}" ${budget?.categoryId===item.id?'selected':''}>${esc(item.name)}</option>`).join("")}</select></label><label><span>Місяць</span><input name="month" type="month" value="${budget?.month||CURRENT_MONTH}"></label><label><span>Ліміт, €</span><input required name="limit" inputmode="decimal" value="${budget?budget.limitCents/100:''}" placeholder="500"></label><p class="pages-form-error" hidden></p><div class="pages-form-actions"><button class="button button-ghost" data-action="close-modal" type="button">Скасувати</button><button class="button button-dark" type="submit">Зберегти бюджет</button></div></form>`);
}

function openGoalModal() {
  showModal(`<div class="pages-modal-head"><div><span class="eyebrow">MoneyMap</span><h2>Нова фінансова ціль</h2><p>Перетворіть мрію на зрозумілий план</p></div><button class="pages-close" data-action="close-modal">×</button></div><form class="pages-form" data-form="goal"><label class="full"><span>Назва цілі</span><input required name="name" placeholder="Наприклад, подорож до Японії"></label><label><span>Потрібна сума, €</span><input required name="target" inputmode="decimal" placeholder="3000"></label><label><span>Вже накопичено, €</span><input name="current" inputmode="decimal" placeholder="0"></label><label><span>Дедлайн</span><input required name="deadline" type="date" value="2027-06-01"></label><label><span>Колір</span><select name="color"><option value="#C7F34A">Лайм</option><option value="#A7D8FF">Блакитний</option><option value="#F5A782">Кораловий</option><option value="#B8A8E8">Лавандовий</option></select></label><p class="pages-form-error" hidden></p><div class="pages-form-actions"><button class="button button-ghost" data-action="close-modal" type="button">Скасувати</button><button class="button button-dark" type="submit">Створити ціль</button></div></form>`);
}

function showModal(content) {
  const host=document.querySelector("#modal-host");
  if (!host) return;
  host.innerHTML=`<div class="pages-modal-backdrop" data-action="backdrop"><section class="pages-modal" role="dialog" aria-modal="true">${content}</section></div>`;
}

function closeModal() {
  const host=document.querySelector("#modal-host");
  if (host) host.innerHTML="";
}

function showFormError(form,message) {
  const error=form.querySelector(".pages-form-error");
  error.textContent=message;
  error.hidden=false;
}

function toast(message) {
  document.querySelector(".pages-toast")?.remove();
  const node=document.createElement("div");
  node.className="pages-toast";
  node.setAttribute("role","status");
  node.textContent=message;
  document.body.append(node);
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>node.remove(),3000);
}

function saveTransaction(form) {
  const values=Object.fromEntries(new FormData(form));
  const amountCents=Math.round(Number(String(values.amount).replace(",","."))*100);
  if (!values.description.trim()||!Number.isFinite(amountCents)||amountCents<=0) return showFormError(form,"Вкажіть опис і коректну суму.");
  const id=Number(form.dataset.id)||nextId(state.transactions);
  const row={id,categoryId:Number(values.categoryId),type:values.type,amountCents,description:values.description.trim(),merchant:values.merchant.trim(),date:values.date,note:values.note.trim()};
  const index=state.transactions.findIndex(item=>item.id===id);
  if (index>=0) state.transactions[index]=row; else state.transactions.unshift(row);
  persist(); closeModal(); render(); toast(index>=0?"Зміни збережено":"Транзакцію додано");
}

function saveBudget(form) {
  const values=Object.fromEntries(new FormData(form));
  const limitCents=Math.round(Number(String(values.limit).replace(",","."))*100);
  if (!Number.isFinite(limitCents)||limitCents<=0) return showFormError(form,"Вкажіть коректний ліміт.");
  const existing=state.budgets.find(item=>item.categoryId===Number(values.categoryId)&&item.month===values.month);
  const id=Number(form.dataset.id)||existing?.id||nextId(state.budgets);
  const budget={id,categoryId:Number(values.categoryId),month:values.month,limitCents};
  state.budgets=state.budgets.filter(item=>item.id!==id&&!(item.categoryId===budget.categoryId&&item.month===budget.month));
  state.budgets.unshift(budget); persist(); closeModal(); render(); toast("Бюджет оновлено");
}

function saveGoal(form) {
  const values=Object.fromEntries(new FormData(form));
  const targetCents=Math.round(Number(String(values.target).replace(",","."))*100);
  const currentCents=Math.round(Number(String(values.current||0).replace(",","."))*100);
  if (!values.name.trim()||targetCents<=0||currentCents<0||currentCents>targetCents) return showFormError(form,"Перевірте назву та суми цілі.");
  state.goals.unshift({id:nextId(state.goals),name:values.name.trim(),targetCents,currentCents,deadline:values.deadline,color:values.color,icon:"◎",status:currentCents>=targetCents?"completed":"active"});
  persist(); closeModal(); render(); toast("Нову ціль створено");
}

function nextId(rows) {
  return Math.max(0,...rows.map(row=>Number(row.id)||0))+1;
}

function contribute(id) {
  const goal=state.goals.find(item=>item.id===Number(id));
  if (!goal||goal.status==="completed") return;
  const input=window.prompt(`Скільки додати до цілі «${goal.name}»?`,"100");
  if (input===null) return;
  const amount=Math.round(Number(input.replace(",","."))*100);
  if (!Number.isFinite(amount)||amount<=0) return toast("Вкажіть суму більше нуля");
  goal.currentCents=Math.min(goal.targetCents,goal.currentCents+amount);
  if (goal.currentCents>=goal.targetCents) goal.status="completed";
  persist(); render(); toast("Прогрес цілі оновлено");
}

function csvEscape(value) {
  const text=String(value??"");
  return /[",\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text;
}

function exportCsv() {
  const rows=[["date","type","category","description","merchant","amount","note"],...filteredTransactions().map(row=>[row.date,row.type,state.categories.find(item=>item.id===row.categoryId)?.name||"",row.description,row.merchant,(row.amountCents/100).toFixed(2),row.note])];
  const csv=`\ufeff${rows.map(row=>row.map(csvEscape).join(",")).join("\n")}`;
  const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const link=document.createElement("a"); link.href=url; link.download="moneymap-transactions.csv"; link.click(); URL.revokeObjectURL(url); toast("CSV експортовано");
}

function parseCsv(text) {
  const rows=[]; let row=[]; let field=""; let quoted=false;
  for(let i=0;i<text.length;i++){
    const char=text[i];
    if(char==='"'&&quoted&&text[i+1]==='"'){field+='"';i++;}
    else if(char==='"') quoted=!quoted;
    else if(char===","&&!quoted){row.push(field);field="";}
    else if((char==="\n"||char==="\r")&&!quoted){if(char==="\r"&&text[i+1]==="\n")i++;row.push(field);field="";if(row.some(item=>item.trim()))rows.push(row);row=[];}
    else field+=char;
  }
  row.push(field); if(row.some(item=>item.trim()))rows.push(row);
  const headers=(rows.shift()||[]).map(item=>item.trim().replace(/^\ufeff/,"").toLowerCase());
  const required=["date","type","category","description","amount"];
  if(!required.every(item=>headers.includes(item))) throw new Error("Потрібні колонки date, type, category, description та amount.");
  return rows.map(values=>Object.fromEntries(headers.map((header,index)=>[header,values[index]?.trim()||""])));
}

async function importCsv(file) {
  try {
    const rows=parseCsv(await file.text());
    const imported=rows.map((row,index)=>{
      const type=row.type==="income"?"income":"expense";
      const category=state.categories.find(item=>item.type===type&&item.name.toLocaleLowerCase("uk")===row.category.toLocaleLowerCase("uk"));
      const amount=Number(row.amount.replace(",","."));
      if(!category||!row.date||!row.description||!Number.isFinite(amount)||amount<=0) throw new Error(`Помилка у рядку ${index+2}.`);
      return {id:nextId(state.transactions)+index,categoryId:category.id,type,amountCents:Math.round(amount*100),description:row.description,merchant:row.merchant||"",date:row.date,note:row.note||""};
    });
    state.transactions=[...imported,...state.transactions]; persist(); render(); toast(`Імпортовано: ${imported.length}`);
  } catch(error) { toast(error.message||"Не вдалося імпортувати CSV"); }
}

root.addEventListener("click",event=>{
  const sectionLink=event.target.closest('a[href="#features"], a[href="#how"], a[href="#security"]');
  if(sectionLink){
    event.preventDefault();
    document.querySelector(sectionLink.getAttribute("href"))?.scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }
  const trigger=event.target.closest("[data-action]");
  if(!trigger) return;
  const action=trigger.dataset.action;
  if(action==="new-transaction") openTransactionModal();
  if(action==="edit-transaction") openTransactionModal(trigger.dataset.id);
  if(action==="new-budget") openBudgetModal();
  if(action==="edit-budget") openBudgetModal(trigger.dataset.id);
  if(action==="new-goal") openGoalModal();
  if(action==="contribute") contribute(trigger.dataset.id);
  if(action==="close-modal") closeModal();
  if(action==="backdrop"&&event.target===trigger) closeModal();
  if(action==="export-csv") exportCsv();
  if(action==="import-csv") document.querySelector("#csv-import")?.click();
  if(action==="logout") { state.profile.registered=false; persist(); location.hash="#home"; toast("Ви вийшли з локального профілю"); }
});

root.addEventListener("submit",event=>{
  const form=event.target.closest("form[data-form]");
  if(!form) return;
  event.preventDefault();
  if(form.dataset.form==="auth"){
    const values=Object.fromEntries(new FormData(form));
    state.profile={name:(values.name||state.profile.name||String(values.email).split("@")[0]).trim(),email:String(values.email).trim(),registered:true};
    persist(); location.hash="#dashboard"; toast(form.dataset.mode==="register"?"Профіль створено":"Вхід виконано");
  }
  if(form.dataset.form==="transaction") saveTransaction(form);
  if(form.dataset.form==="budget") saveBudget(form);
  if(form.dataset.form==="goal") saveGoal(form);
});

root.addEventListener("change",event=>{
  const filter=event.target.dataset.filter;
  if(filter){filters[filter]=event.target.value;render();}
  if(event.target.id==="csv-import"&&event.target.files?.[0]) importCsv(event.target.files[0]);
  if(event.target.matches("[data-transaction-type]")){
    const select=document.querySelector("[data-category-select]");
    const categories=state.categories.filter(item=>item.type===event.target.value);
    select.innerHTML=categories.map(item=>`<option value="${item.id}">${esc(item.name)}</option>`).join("");
  }
});

root.addEventListener("input",event=>{
  if(event.target.dataset.filter==="search"){
    filters.search=event.target.value;
    const caret=event.target.selectionStart;
    render();
    const input=document.querySelector('[data-filter="search"]');
    input?.focus(); input?.setSelectionRange(caret,caret);
  }
});

window.addEventListener("hashchange",render);
render();
