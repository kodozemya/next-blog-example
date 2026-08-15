import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/*
  ESLint у «плоскому» форматі — типовому для ESLint 9. Конфіг — це просто
  масив: кожен елемент або набір правил, або обмеження, до яких файлів
  вони застосовуються.

  Лінтер тут не для краси. next/core-web-vitals ловить рівно те, за що
  знімають бали на перевірці: <img> замість next/image, <a> замість
  next/link, забутий key у списку, хук у гілці if.
*/
const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...coreWebVitals,
  ...nextTypescript,
];

export default config;
