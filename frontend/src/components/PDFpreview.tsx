import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import '../pdfWorker'; // make sure this path points to pdfWorker.ts

export const PdfPreview = ({ url }: { url: string }) => {
  const [pages, setPages] = useState(1);

  return (
    <Document
      file={url}
      onLoadSuccess={({ numPages }) => setPages(numPages)}
      onLoadError={(err) => console.error('PDF Load Error:', err)}
    >
      {Array.from(new Array(pages), (_, i) => (
        <Page key={i} pageNumber={i + 1} />
      ))}
    </Document>
  );
};
