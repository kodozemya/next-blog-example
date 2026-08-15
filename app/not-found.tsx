import Link from "next/link";

/**
 * Сторінка 404.
 *
 * Next.js показує її сам у двох випадках: коли адреса не збіглася з жодним
 * маршрутом і коли сторінка викликала notFound(). Тому текст тут — про
 * сторінку взагалі, а не про статтю: сюди приводить і /blog/одруківка,
 * і /kontakty, якого на сайті просто немає.
 */
export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <h1 className="section__title">Такої сторінки немає</h1>
        <p className="not-found__text">
          Можливо, адреса змінилася або в ній є одруківка.
        </p>
        <Link className="link-accent" href="/blog">
          ← Подивитися всі статті
        </Link>
      </div>
    </section>
  );
}
