import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getChatGPTUser();
  return (
    <main className="auth-page">
      <Link className="brand auth-brand" href="/"><span className="brand-mark"><i />M</span><span>MoneyMap</span></Link>
      <section className="auth-card">
        <span className="auth-kicker">Раді бачити знову</span>
        <h1>{user ? "Ви вже увійшли" : "Увійдіть у свій фінансовий простір"}</h1>
        <p>{user ? `Акаунт ${user.email} готовий до роботи.` : "Без окремого пароля: MoneyMap використовує захищений вхід через ваш акаунт ChatGPT."}</p>
        <a className="button button-dark button-auth" href={user ? "/dashboard" : chatGPTSignInPath("/dashboard")}><span className="auth-button-mark">✦</span>{user ? "Відкрити дашборд" : "Продовжити з ChatGPT"}<b>→</b></a>
        <div className="auth-divider"><span>або</span></div>
        <a className="button button-ghost button-auth" href="/demo">Переглянути демо <b>↗</b></a>
        <small>Ще немає профілю? <a href="/register">Створити MoneyMap</a></small>
      </section>
      <p className="auth-privacy">◆ Дані захищені та належать лише вам</p>
    </main>
  );
}
