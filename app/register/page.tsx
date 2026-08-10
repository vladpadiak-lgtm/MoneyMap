import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getChatGPTUser();
  return (
    <main className="auth-page register-page">
      <Link className="brand auth-brand" href="/"><span className="brand-mark"><i />M</span><span>MoneyMap</span></Link>
      <section className="auth-card">
        <span className="auth-kicker">{user ? "Профіль підтверджено" : "Почніть із ясності"}</span>
        <h1>{user ? "Ваш MoneyMap готовий" : "Створіть власну карту грошей"}</h1>
        <p>{user ? `Ми використаємо ${user.email} тільки для вашого приватного профілю.` : "Один захищений вхід — і у вас є дашборд, бюджети, цілі та повний контроль над даними."}</p>
        <ul className="register-benefits"><li><span>✓</span>Не потрібно вигадувати новий пароль</li><li><span>✓</span>Стартові категорії вже налаштовані</li><li><span>✓</span>Експорт даних у будь-який момент</li></ul>
        <a className="button button-lime button-auth" href={user ? "/dashboard" : chatGPTSignInPath("/register")}><span className="auth-button-mark">✦</span>{user ? "Завершити й відкрити дашборд" : "Зареєструватися через ChatGPT"}<b>→</b></a>
        <small>Вже маєте профіль? <a href="/login">Увійти</a></small>
      </section>
      <p className="auth-privacy">◆ Без картки • Без банківських паролів • Під вашим контролем</p>
    </main>
  );
}
