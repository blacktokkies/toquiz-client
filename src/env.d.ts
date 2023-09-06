// https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SOCKET_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
