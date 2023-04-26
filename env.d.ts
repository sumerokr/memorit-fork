/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GENERATOR_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
