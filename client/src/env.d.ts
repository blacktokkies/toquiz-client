// https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VITE_API_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
