import PostCard from "./PostCard";
import type { PostSummary } from "@/lib/posts";

/**
 * Блок «Останні статті» з макета.
 *
 * Розкладка там нерівномірна навмисно: перша стаття велика, дві наступні —
 * компактні (обкладинка ліворуч, текст праворуч), четверта — на всю ширину.
 * Так око одразу бачить, що читати першим.
 *
 * У макеті велика й компактні картки стоять в одній секції, а четверта —
 * в окремій. Тут так само: дві <section>, бо між ними в макеті 60px
 * (по 30 нижнього й верхнього відступу секцій), а не 32, як усередині сітки.
 *
 * Уся ця нерівномірність — питання CSS, а не розмітки: компонент картки
 * скрізь один і той самий, змінюється лише проп layout.
 *
 * Картка — це <li>, тому кожна група обгорнута в <ul>, навіть та, де
 * стаття одна: <li> без списку-батька — невалідна розмітка, і читалка
 * такого елемента не озвучить як пункт.
 *
 * @param posts до чотирьох найновіших статей
 */
export default function FeaturedPosts({ posts }: { posts: PostSummary[] }) {
  // Розбираємо список на ролі один раз — далі в розмітці немає жодного індексу.
  const [lead, ...rest] = posts;
  const compact = rest.slice(0, 2);
  const wide = rest[2];

  if (!lead) return null;

  return (
    <>
      <section className="section">
        <div className="container">
          <h2 className="section__title">Останні статті</h2>

          <div className="featured">
            <ul className="featured__lead">
              {/*
                preload лише тут: це єдина обкладинка, яку видно одразу
                після завантаження сторінки. Позначити пріоритетними всі —
                те саме, що не позначити жодну.
              */}
              <PostCard post={lead} layout="lead" headingLevel={3} preload />
            </ul>

            {compact.length > 0 && (
              <ul className="featured__side">
                {compact.map((post) => (
                  <PostCard key={post.slug} post={post} layout="compact" headingLevel={3} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {wide && (
        <section className="section">
          <div className="container">
            <ul className="featured__wide">
              <PostCard post={wide} layout="wide" headingLevel={3} />
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
