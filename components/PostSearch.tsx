"use client";

import { useState } from "react";

import PostCard from "./PostCard";
import type { PostSummary } from "@/lib/posts";

/**
 * Пошук по статтях.
 *
 * Клієнтський компонент — бо має стан і обробник події. Але список статей
 * він НЕ завантажує: готовий масив приходить пропом від серверної сторінки.
 *
 * Спокуса зробити інакше велика: useState([]), useEffect, fetch("/api/posts").
 * Так робити тут не варто, і причин три. У HTML сторінки списку не було б
 * узагалі — ні для пошуковика, ні для того, у кого JS не завантажився.
 * Користувач бачив би спалах «Знайдено статей: 0» до відповіді сервера.
 * І сам запит зайвий: сторінка складається наперед, дані вже лежать
 * на диску поруч із нею.
 *
 * Тип PostSummary приходить із серверного модуля — і це безпечно:
 * `import type` зникає під час складання, тож node:fs у браузер не поїде.
 * Якби це був звичайний import, збірка впала б.
 */
export default function PostSearch({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");

  /*
    Фільтрація на клієнті, без запиту на кожну літеру. Для блогу
    з десятками статей це правильний вибір: список уже в пам'яті,
    а мережу турбувати нема потреби. З тисячею статей шукали б на сервері.

    Пошук іде і по тегах теж — вони видно на картці, тож користувач
    цілком логічно спробує набрати «Git».
  */
  const normalized = query.trim().toLowerCase();

  const found = normalized
    ? posts.filter((post) =>
        [post.title, post.excerpt, ...(post.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
    : posts;

  return (
    <>
      <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="visually-hidden" htmlFor="post-search">
          Пошук по статтях
        </label>
        <input
          id="post-search"
          className="search__input"
          type="search"
          placeholder="Шукати за назвою, описом або тегом…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      {/* role="status" — читалка озвучить зміну кількості знайденого. */}
      <p className="search__status" role="status">
        {normalized && found.length === 0
          ? `За запитом «${query.trim()}» нічого немає`
          : `Знайдено статей: ${found.length}`}
      </p>

      <ul className="posts">
        {found.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </>
  );
}
