/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GENERATOR_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __CF_PAGES_BRANCH__: string;
declare const __CF_PAGES_COMMIT_SHA__: string;
declare const __BUILD_DATE__: string;
