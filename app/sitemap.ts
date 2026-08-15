import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * /sitemap.xml — карта сайту для пошукових систем.
 *
 * Файл app/sitemap.ts — така сама угода Next.js, як page.tsx чи route.ts:
 * функцію треба лише експортувати за замовчуванням, XML складе він сам.
 *
 * Список беремо з того самого getAllPosts(), що й сторінки. Тому нова
 * стаття потрапляє в карту сайту сама — доглядати за нею руками не треба,
 * а списки, за якими доглядають руками, завжди відстають.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postEntries = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    // lastModified — дата статті: іншої в нас і немає.
    lastModified: post.date,
  }));

  return [
    { url: site.url, lastModified: posts[0]?.date },
    { url: `${site.url}/blog`, lastModified: posts[0]?.date },
    ...postEntries,
  ];
}
