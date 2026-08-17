/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONNECT_CCP_URL?: string;
  readonly VITE_CONNECT_REGION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
