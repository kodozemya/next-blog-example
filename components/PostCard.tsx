import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { PostSummary } from "@/lib/posts";

/**
 * Чотири розкладки картки з макета.
 *
 * `column`  — сітка «Усі статті»: обкладинка 384×240 згори.
 * `lead`    — велика картка блока «Останні»: обкладинка 592×228 згори.
 * `compact` — обкладинка 320×200 ліворуч, дрібніший заголовок, без стрілки.
 * `wide`    — на всю ширину: обкладинка й текст по половині.
 *
 * Об'єднання літералів, а не `string`: `layout="collumn"` не скомпілюється.
 */
type PostCardLayout = "column" | "lead" | "compact" | "wide";

type PostCardProps = {
  post: PostSummary;
  /**
   * Чи стоїть картка на першому екрані.
   *
   * Тільки перша картка бачиться одразу — її обкладинку треба вантажити
   * негайно. Решта чекає прокручування. Позначити «пріоритетними»
   * усі картки — те саме, що не позначити жодної: браузер вантажитиме
   * двадцять картинок водночас і жодну не покаже швидко.
   */
  preload?: boolean;
  layout?: PostCardLayout;
  /**
   * Рівень заголовка картки.
   *
   * Заголовки на сторінці мають іти рівнями без пропусків: h1 → h2 → h3.
   * На головній над картками стоїть h2 «Останні статті», тому там картка
   * має бути h3. На /blog над сіткою стоїть одразу h1 — там картці
   * належить h2. Жорстко вписаний у компонент h3 давав на /blog
   * стрибок h1 → h3, і читалка повідомляла про пропущений рівень.
   */
  headingLevel?: 2 | 3;
};

/*
  Скільки місця займе обкладинка на екрані — для кожної розкладки своє.
  Це підказка браузерові, яку саме копію картинки качати: без неї
  на телефон приїде варіант для монітора.
*/
const COVER_SIZES: Record<PostCardLayout, string> = {
  column: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px",
  lead: "(max-width: 1024px) 100vw, 592px",
  compact: "(max-width: 640px) 100vw, 320px",
  wide: "(max-width: 1024px) 100vw, 592px",
};

export default function PostCard({
  post,
  preload = false,
  layout = "column",
  headingLevel = 2,
}: PostCardProps) {
  // Стрілка є в усіх розкладках макета, крім компактної.
  const hasArrow = layout !== "compact";

  // Тег обирається пропом. React бере компонент із великої літери,
  // тому змінна названа Heading, а не heading — інакше він вирішив би,
  // що це HTML-тег із назвою «heading».
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <li className={`post-card post-card--${layout}`}>
      <Link className="post-card__link" href={`/blog/${post.slug}`}>
        {/*
          next/image замість <img>: він сам віддає WebP тим, хто його розуміє,
          сам робить кілька розмірів під різні екрани і — головне —
          резервує місце під картинку, тож текст під нею не стрибає.

          width і height задають ПРОПОРЦІЇ, а не остаточний розмір:
          справжню висоту задає CSS (.post-card--*   .post-card__cover),
          а object-fit: cover обрізає зайве.
        */}
        <Image
          className="post-card__cover"
          src={post.cover}
          alt={`Обкладинка статті «${post.title}»`}
          width={640}
          height={360}
          sizes={COVER_SIZES[layout]}
          /*
            preload (у Next.js 16 він замінив застарілий priority) вимикає
            ліниве завантаження і додає <link rel="preload"> у <head>.
            Разом із loading="lazy" його ставити не можна: Next.js кине помилку.
          */
          preload={preload}
        />

        <div className="post-card__content">
          <div className="post-card__head">
            <p className="post-card__meta">
              {/*
                <time> із машинним datetime: людина читає «13 серпня 2026»,
                пошуковик — «2026-08-13».
              */}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>

            <div className="post-card__heading">
              <Heading className="post-card__title">
                <span className="post-card__title-text">{post.title}</span>
                {hasArrow && <ArrowUpRight />}
              </Heading>

              <p className="post-card__excerpt">{post.excerpt}</p>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <ul className="badges">
              {post.tags.map((tag) => (
                <li key={tag} className={`badge badge--${badgeTone(tag)}`}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </li>
  );
}

/**
 * Який із семи кольорів макета дістанеться бейджу.
 *
 * Колір рахується з самого тексту тегу, а не з його місця в списку.
 * Через це «CSS» усюди на сайті однакового кольору — а це саме те,
 * чого око й чекає від кольорового бейджа.
 *
 * Сума кодів літер — найпростіша функція, яка перетворює рядок на число
 * і завжди дає той самий результат. Криптографії тут не треба: нам
 * потрібен лише стабільний розкид по семи значеннях.
 */
function badgeTone(tag: string): number {
  let sum = 0;

  for (const char of tag) {
    sum += char.codePointAt(0) ?? 0;
  }

  return (sum % 7) + 1;
}

/**
 * Стрілка «↗» біля заголовка.
 *
 * Контур узятий з макета як є, а колір — currentColor: стрілка сама
 * стає бузковою разом із заголовком, коли на картку наводять мишу.
 * aria-hidden, бо це прикраса: посилання вже озвучене заголовком.
 */
function ArrowUpRight() {
  return (
    <svg
      className="post-card__arrow"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17L17 7M17 17V7H7" />
    </svg>
  );
}
