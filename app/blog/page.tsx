import type { Metadata } from "next";

import PostSearch from "@/components/PostSearch";
import { getAllPosts } from "@/lib/posts";

/**
 * Статичні метадані сторінки. Для сторінок, чий заголовок не залежить
 * від даних, беруть саме об'єкт `metadata`, а не generateMetadata.
 */
export const metadata: Metadata = {
  title: "Усі статті",
  description: "Повний список статей блогу з пошуком за назвою та описом.",
};

/**
 * Список усіх статей — секція «All blog posts» з макета.
 *
 * Сторінка серверна: вона сама читає статті з диска й віддає готовий
 * список пропом у клієнтський компонент. Той бере на себе лише пошук.
 *
 * Це і є той поділ, до якого варто звикати: дані збирає сервер,
 * а «use client» дістається рівно тому шматку, де є стан і події.
 * Тягнути список запитом із браузера означало б віддати пошуковику
 * порожню сторінку — і змусити користувача чекати на дані, які вже
 * лежали готовими на диску.
 */
export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="section">
      <div className="container">
        <h1 className="section__title">Усі статті</h1>
        <PostSearch posts={posts} />
      </div>
    </section>
  );
}
