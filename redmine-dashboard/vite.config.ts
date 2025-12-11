import { defineConfig } from "vite";

// Vite 開発サーバの設定
export default defineConfig({
  server: {
    proxy: {
      // /redmine で始まるパスは Redmine コンテナに中継する
      "/redmine": {
        target: "http://localhost:5555", // ★ docker-compose のポートに合わせる（5555 を使ってるならこのままでOK）
        changeOrigin: true,
        secure: false,
        // /redmine/issues.json → /issues.json に書き換え
        rewrite: (path) => path.replace(/^\/redmine/, ""),
      },
    },
  },
});
