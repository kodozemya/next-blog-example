import Link from "next/link";

import { site } from "@/lib/site";

/**
 * Шапка сайту. Серверний компонент: ні стану, ні подій, ні хуків —
 * отже, у браузер із неї не їде ані рядка коду.
 *
 * У макеті в шапці лише ім'я й перемикач теми. Посилання «Головна» і
 * «Статті» додані тому, що завдання вимагає трьох окремих маршрутів,
 * а без меню до них не дійти.
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <nav className="navbar" aria-label="Головне меню">
          {/*
            next/link, а не <a>: він переходить між сторінками без
            перезавантаження і завчасно підвантажує ту, на яку веде,
            щойно посилання потрапляє в зону видимості.
          */}
          {/* Ім'я — із lib/site.ts, щоб воно ніде не розходилося. */}
          <Link className="navbar__name" href="/">
            {site.author}
          </Link>

          <div className="navbar__links">
            <Link className="navbar__link" href="/">
              Головна
            </Link>
            <Link className="navbar__link" href="/blog">
              Статті
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
