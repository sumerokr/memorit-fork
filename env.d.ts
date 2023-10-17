/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GENERATOR_API: string;
  readonly VITE_CF_PAGES_BRANCH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
