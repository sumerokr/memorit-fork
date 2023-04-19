/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GENERATOR_API: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
