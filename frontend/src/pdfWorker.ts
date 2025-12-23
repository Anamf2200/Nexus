import { pdfjs } from 'react-pdf';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min?worker';

// Connect the worker
pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker();
