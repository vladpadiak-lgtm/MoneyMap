import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MoneyMap — особисті фінанси без хаосу",
  description: "Транзакції, бюджети, цілі та зрозуміла аналітика в одному приватному фінансовому просторі.",
};

function MarketingLogo() {
  return (
    <Link className="brand marketing-brand" href="/" aria-label="MoneyMap — на головну">
      <span className="brand-mark" aria-hidden="true"><i />M</span><span>MoneyMap</span>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="marketing-page">
      <header className="marketing-header">
        <MarketingLogo />
        <nav aria-label="Навігація сайту"><a href="#how">Як це працює</a><a href="#features">Можливості</a><a href="#security">Безпека</a></nav>
        <div><a className="text-link" href="/login">Увійти</a><a className="button button-dark" href="/register">Почати безкоштовно <span>↗</span></a></div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-badge"><i /> Ваші гроші. Ваші правила.</span>
          <h1>Гроші під контролем.<br />Життя — <em>за планом.</em></h1>
          <p>MoneyMap перетворює щоденні витрати на ясну фінансову картину: бачте головне, тримайте бюджет і рухайтеся до своїх цілей.</p>
          <div className="hero-actions"><a className="button button-lime button-large" href="/register">Створити свій MoneyMap <span>→</span></a><a className="button button-plain button-large" href="/demo">Переглянути демо <span>↗</span></a></div>
          <div className="trust-row"><span>✓ Без банківської картки</span><span>✓ Приватний простір</span><span>✓ CSV імпорт</span></div>
        </div>
        <div className="hero-visual" aria-label="Попередній вигляд дашборда MoneyMap">
          <div className="visual-top"><span className="mini-brand"><b>M</b> MoneyMap</span><span className="visual-avatar">В</span></div>
          <div className="visual-nav"><i /><i /><i /><i /></div>
          <div className="visual-content">
            <div className="visual-heading"><span>Фінансова картина</span><button>＋ Додати</button></div>
            <div className="visual-balance"><small>Доступний баланс</small><strong>€7 280,50</strong><span>↑ 42% цього місяця</span><i className="visual-orbit" /></div>
            <div className="visual-cards"><div><small>Доходи</small><strong>€3 200</strong></div><div><small>Витрати</small><strong>€1 305</strong></div><div><small>У цілях</small><strong>€6 940</strong></div></div>
            <div className="visual-chart"><span>Грошовий потік</span><div>{[36, 62, 48, 78, 66, 91].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
            <div className="visual-donut"><i /><span><small>Витрати</small><strong>€1 305</strong></span></div>
          </div>
          <div className="floating-receipt"><span>✓</span><div><small>Бюджет у нормі</small><strong>Залишилось €486</strong></div></div>
        </div>
      </section>

      <section className="value-strip" aria-label="Переваги MoneyMap">
        <div><strong>01</strong><span>Одна картина</span><p>Усі важливі цифри без зайвого шуму.</p></div>
        <div><strong>02</strong><span>Реальні межі</span><p>Бюджети, які видно до перевитрати.</p></div>
        <div><strong>03</strong><span>Відчутний прогрес</span><p>Цілі з сумою, дедлайном і темпом.</p></div>
      </section>

      <section className="feature-section" id="features">
        <div className="section-heading"><span className="eyebrow">Один простір замість таблиць</span><h2>Фінанси, які нарешті<br /><em>можна зрозуміти.</em></h2><p>Кожна функція відповідає на конкретне питання — від «куди пішли гроші?» до «коли я досягну мети?»</p></div>
        <div className="feature-grid">
          <article className="feature-card feature-wide"><span className="feature-number">01</span><div><h3>Транзакції без рутини</h3><p>Швидке додавання, розумні фільтри, редагування та чистий CSV імпорт/експорт.</p></div><div className="feature-table"><i /><i /><i /><i /></div></article>
          <article className="feature-card lime-card"><span className="feature-number">02</span><div><h3>Бюджети, що попереджають</h3><p>Окремі ліміти за категоріями й чесний прогноз до кінця місяця.</p></div><div className="feature-progress"><span><i style={{ width: "68%" }} /></span><small>68% використано</small></div></article>
          <article className="feature-card dark-card"><span className="feature-number">03</span><div><h3>Цілі з маршрутом</h3><p>Не просто сума — дедлайн, прогрес і зрозумілий наступний крок.</p></div><div className="feature-goal"><i /><span><strong>€1 620</strong> / €1 800</span><b>90%</b></div></article>
          <article className="feature-card feature-wide chart-card"><span className="feature-number">04</span><div><h3>Аналітика без бухгалтерської мови</h3><p>Категорії, динаміка за місяцями й головні тренди — відразу на дашборді.</p></div><div className="mini-bars">{[35, 61, 48, 77, 65, 88, 72, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="section-heading compact"><span className="eyebrow light">Три кроки до ясності</span><h2>Від хаосу до плану<br />за кілька хвилин.</h2></div>
        <ol><li><span>1</span><div><strong>Увійдіть</strong><p>Створіть приватний профіль через захищений вхід ChatGPT.</p></div></li><li><span>2</span><div><strong>Додайте рухи коштів</strong><p>Вручну або одним CSV-файлом з вашої таблиці.</p></div></li><li><span>3</span><div><strong>Дійте за картиною</strong><p>Налаштуйте бюджети, цілі й перевіряйте прогрес.</p></div></li></ol>
      </section>

      <section className="security-section" id="security">
        <div><span className="security-mark">◆</span><span className="eyebrow">Приватність за замовчуванням</span><h2>Ваші цифри належать тільки вам.</h2><p>Дані кожного користувача відокремлені на сервері. MoneyMap не просить пароль до банку й не продає фінансовий профіль.</p></div>
        <ul><li><span>01</span>Захищений вхід без окремого пароля</li><li><span>02</span>Серверна перевірка власника кожного запису</li><li><span>03</span>Експорт даних у відкритому CSV-форматі</li></ul>
      </section>

      <section className="final-cta"><span className="eyebrow light">Почніть із сьогодні</span><h2>Дайте кожному євро<br /><em>своє місце на карті.</em></h2><a className="button button-lime button-large" href="/register">Створити MoneyMap <span>→</span></a></section>
      <footer className="marketing-footer"><MarketingLogo /><p>Особисті фінанси без хаосу.</p><div><a href="/login">Увійти</a><a href="/demo">Демо</a><span>© 2026 MoneyMap</span></div></footer>
    </main>
  );
}
