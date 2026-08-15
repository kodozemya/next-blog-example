import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

/*
  next/font завантажує Inter під час складання й кладе файли поруч із сайтом.
  Різниця з <link> на Google Fonts: немає запиту на чужий домен (і потреби
  писати про нього в політиці приватності), немає стрибка тексту при заміні
  шрифту, і сторінка не чекає на відповідь стороннього сервера.
*/
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

/** Назва блогу — вона ж заголовок вкладки на головній. */
const siteTitle = `Блог ${site.authorGenitive}`;

/**
 * Статичні метадані для всього сайту.
 *
 * `template` у title — заготовка: сторінка статті підставить свій заголовок
 * замість %s, і на вкладці буде «Як я вчив Next.js — Блог Олександра
 * Ратушного». Головна візьме `default`.
 *
 * Ім'я автора береться з lib/site.ts, а не пишеться тут ще раз: одне
 * джерело — і шапка з підвалом не можуть із заголовком розійтися.
 */
export const metadata: Metadata = {
  /*
    metadataBase — база, від якої добудовуються відносні адреси картинок
    в Open Graph. Без неї Next.js бере http://localhost:3000, і посилання,
    яким поділилися, тягне обкладинку з чужого комп'ютера.
    Адресу міняють в одному місці — у lib/site.ts.
  */
  metadataBase: new URL(site.url),
  title: {
    default: siteTitle,
    template: `%s — ${siteTitle}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: siteTitle,
  },
};

/**
 * Кореневий layout. Він один на весь сайт: саме тут живуть <html> і <body>,
 * і саме тому шапка з підвалом малюються один раз, а не перемальовуються
 * на кожному переході між сторінками.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Клас зі змінною шрифту стоїть на <html>, а не на <body>: змінну
    // --font-inter використовує правило для :root у globals.css, і воно
    // побачить її лише тоді, коли вона оголошена на самому кореневому вузлі.
    <html lang="uk" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
