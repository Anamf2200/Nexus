/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


declare module 'pdfjs-dist/build/pdf.worker.min?worker' {
  const WorkerFactory: {
    new (): Worker;
  };
  export default WorkerFactory;
}


