import Link from "next/link";

import FeaturedPosts from "@/components/FeaturedPosts";
import { getAllPosts } from "@/lib/posts";

/**
 * Головна сторінка.
 *
 * Це серверний компонент — і тому він може бути `async` і читати диск
 * напряму, без жодного useEffect і без стану завантаження. Уся ця робота
 * відбувається під час складання; у браузер приїжджає готовий HTML.
 */
export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <>
      {/*
        Титул із макета: величезний напис між двома лініями, на всю
        ширину контейнера. Кегль рахується від ширини контейнера
        (див. .hero__title у globals.css), тому напис не вилазить
        за край навіть на телефоні.
      */}
      <section className="container hero">
        <h1 className="hero__title">МІЙ БЛОГ</h1>
      </section>

      {/* Блок «Останні статті» з макета: чотири найновіші, у чотирьох ролях. */}
      <FeaturedPosts posts={posts.slice(0, 4)} />

      <section className="section">
        <div className="container">
          <Link className="link-accent" href="/blog">
            Усі статті →
          </Link>
        </div>
      </section>
    </>
  );
}
