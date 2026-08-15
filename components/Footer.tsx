import { site } from "@/lib/site";

/**
 * Підвал сайту. Жодного стану — серверний компонент.
 *
 * У макеті це просто рядок: «© 2023  Twitter  LinkedIn  Email» —
 * кегль 20, проміжок 14, без лінії згори.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/*
          Рік рахується під час складання, а не пишеться руками:
          сайт, у підвалі якого «2023», виглядає покинутим.
        */}
        <p>
          © {new Date().getFullYear()} {site.author}
        </p>

        <ul className="footer__links">
          <li>
            {/*
              rel="noopener noreferrer" при target="_blank" — так само,
              як у посиланнях усередині статті. noopener не дає відкритій
              сторінці дістатися нашої через window.opener, noreferrer
              не віддає їй адресу, з якої прийшли.
            */}
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`}>Пошта</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
