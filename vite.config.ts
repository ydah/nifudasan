import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages のプロジェクトURL配下でも、ユーザーサイトや独自ドメインでも動くようにする。
  base: './',
  build: {
    target: 'es2022',
  },
});
