import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { formatDate } from "@/lib/format";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

/**
 * Сторінка однієї статті — динамічний маршрут /blog/[slug].
 */

/*
  У сучасному Next.js params — це ПРОМІС, а не звичайний об'єкт.
  Тому тип нижче саме Promise<{ slug: string }>, а нижче стоїть await.
  Спроба прочитати params.slug напряму дасть undefined і сторінку 404
  для кожної статті — це найчастіша помилка на цьому бої.
*/
type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Які сторінки зібрати заздалегідь.
 *
 * Без цієї функції Next.js складе сторінку статті під час першого запиту
 * від користувача. З нею всі сторінки вже лежать готовими на диску —
 * і віддаються миттєво, як звичайні файли.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * Заголовок і опис сторінки — із фронтматера статті.
 *
 * Це те, що побачить Google у видачі й що покажеться карткою
 * у месенджері, коли посиланням поділяться.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Метадані для неіснуючої сторінки теж треба повернути — сторінка 404 має заголовок.
  if (!post) {
    return { title: "Статтю не знайдено" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.cover }],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params; // params — проміс, тому await
  const post = await getPostBySlug(slug);

  /*
    notFound() не «повертає 404» — він кидає спеціальне виключення,
    яке Next.js ловить і показує найближчу сторінку not-found.tsx.
    Тому після нього нічого писати не треба: код нижче не виконається.
  */
  if (!post) {
    notFound();
  }

  /*
    compileMDX перетворює текст статті на React-елементи прямо тут,
    на сервері. У браузер їде вже готова розмітка — компілятор MDX
    у бандл не потрапляє взагалі.

    Через components можна підмінити будь-який тег Markdown власним
    компонентом; тут ми замінюємо посилання, щоб внутрішні працювали
    через next/link, а зовнішні відкривалися безпечно.

    remarkGfm додає те, що всі вважають частиною Markdown, хоч насправді
    це розширення GitHub: таблиці, ~~зачеркнутий текст~~, списки-чеклісти
    й автоматичні посилання з голої адреси. Без нього таблиця у статті
    просто лишилася б рядком з рисками — і жодної помилки при складанні.
  */
  const { content } = await compileMDX({
    source: post.content,
    components: {
      a: MdxLink,
    },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return (
    <section className="section">
      <div className="container">
        <article className="article">
          <Link className="link-accent article__back" href="/blog">
            ← Усі статті
          </Link>

          <p className="article__meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>

          <h1 className="article__title">{post.title}</h1>

          {/*
            Обкладинка статті — єдине зображення на першому екрані,
            тому priority. На решті сторінки таких немає.
          */}
          <Image
            className="article__cover"
            src={post.cover}
            alt={`Обкладинка статті «${post.title}»`}
            width={1200}
            height={630}
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />

          <div className="article__body">{content}</div>
        </article>
      </div>
    </section>
  );
}

/**
 * Посилання всередині статті.
 *
 * Внутрішні йдуть через next/link (перехід без перезавантаження),
 * зовнішні відкриваються в новій вкладці з rel="noopener" — без нього
 * відкрита сторінка отримує доступ до нашої через window.opener.
 */
function MdxLink({ href = "", children }: { href?: string; children?: React.ReactNode }) {
  if (href.startsWith("/")) {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
