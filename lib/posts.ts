import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

/**
 * Читання статей із файлової системи.
 *
 * ЦЕ СЕРВЕРНИЙ КОД. Він імпортує node:fs — модуль, якого в браузері немає
 * взагалі. Тому цей файл не можна імпортувати з клієнтського компонента
 * (того, що починається з директиви use client): складання просто впаде,
 * і це правильно. Так Next.js не дає випадково відправити читання диска
 * на клієнт.
 */

/** Тека зі статтями. process.cwd() — корінь проєкту, звідки запущено Next. */
const POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");

/** Фронтматер статті — те, що написано між --- на початку .mdx-файла. */
export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  tags?: string[];
};

/** Стаття в списку: фронтматер плюс slug, взятий з імені файла. */
export type PostSummary = PostFrontmatter & {
  slug: string;
};

/** Стаття цілком: те саме плюс текст MDX. */
export type Post = PostSummary & {
  content: string;
};

/**
 * Перевіряє, що у фронтматері є все потрібне.
 *
 * gray-matter повертає `data` типу `Record<string, unknown>` — він же не
 * знає, що ти туди написав. Без цієї перевірки одруківка в назві поля
 * (`titel` замість `title`) дала б `undefined` у заголовку сторінки
 * і мовчазну порожнечу замість помилки.
 */
function parseFrontmatter(data: Record<string, unknown>, slug: string): PostFrontmatter {
  const required = ["title", "date", "excerpt", "cover"] as const;

  for (const field of required) {
    if (typeof data[field] !== "string") {
      throw new Error(
        `У статті «${slug}» у фронтматері бракує поля «${field}» або воно не рядок.`,
      );
    }
  }

  return {
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    cover: data.cover as string,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
  };
}

/**
 * Усі статті, від найновішої до найстарішої.
 *
 * Ця сама функція живить головну сторінку, список статей,
 * generateStaticParams() і API-роут. Одне джерело — один порядок
 * сортування скрізь.
 */
export async function getAllPosts(): Promise<PostSummary[]> {
  const fileNames = await readdir(POSTS_DIRECTORY);

  const posts = await Promise.all(
    fileNames
      // .filter — щоб .DS_Store чи випадковий .txt не поламали читання
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        const source = await readFile(path.join(POSTS_DIRECTORY, fileName), "utf8");

        // matter ділить файл на data (фронтматер) і content (текст статті).
        const { data } = matter(source);

        return { slug, ...parseFrontmatter(data, slug) };
      }),
  );

  /*
    Сортування рядків дат працює лише тому, що формат ISO (2026-08-13):
    у ньому рік стоїть попереду й лексикографічний порядок збігається
    з хронологічним. Для «13.08.2026» це зламалося б.
  */
  return posts.sort((left, right) => right.date.localeCompare(left.date));
}

/**
 * Одна стаття за slug, або `null`, якщо файла немає.
 *
 * Повертає саме `null`, а не кидає помилку: «статті немає» — це нормальний
 * стан застосунку (користувач набрав адресу руками), а не збій. Рішення,
 * що з цим робити, ухвалює сторінка — і вона викликає notFound().
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  /*
    Захист від виходу за межі теки. Без нього адреса
    /blog/..%2F..%2F.env могла б змусити сервер прочитати чужий файл.
    Це називають path traversal, і це справжня діра, а не теорія.
  */
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    return null;
  }

  const filePath = path.join(POSTS_DIRECTORY, `${slug}.mdx`);

  let source: string;

  try {
    source = await readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(source);

  return { slug, ...parseFrontmatter(data, slug), content };
}
