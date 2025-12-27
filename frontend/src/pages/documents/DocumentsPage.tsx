import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  useGetUserDocumentsQuery,
  useUploadDocumentMutation,
  useSignDocumentMutation,
} from '../../store/document/documentApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { PdfPreview } from '../../components/PDFpreview';

export const DocumentsPage: React.FC = () => {
  const { data: documents, isLoading,isError } = useGetUserDocumentsQuery();
  const [uploadDocument] = useUploadDocumentMutation();
  const [signDocument] = useSignDocumentMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const sigPadRef = useRef<SignatureCanvas>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile || !title) return;
    await uploadDocument({ title, file: selectedFile }).unwrap();
    setTitle('');
    setSelectedFile(null);
  };

  const openSignaturePicker = (docId: string) => {
    setSelectedDocId(docId);
    signatureInputRef.current?.click();
  };

  const handleSignatureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDocId) return;

    await signDocument({
      docId: selectedDocId,
      signature: file,
    }).unwrap();

    setSelectedDocId(null);
    e.target.value = '';
  };

  const handleDrawSignature = async () => {
    if (!sigPadRef.current || !selectedDocId) return;

    const dataURL = sigPadRef.current.toDataURL(); // base64 PNG
    const blob = await (await fetch(dataURL)).blob();
    const file = new File([blob], 'signature.png', { type: 'image/png' });

    await signDocument({ docId: selectedDocId, signature: file }).unwrap();

    setSelectedDocId(null);
    setShowCanvas(false);
    sigPadRef.current.clear();
  };

  if (isLoading) return <p>Loading documents...</p>;


  return (
    <div className="space-y-4">
      {/* Upload document */}
      <div className="flex gap-2">
        <Input
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />
        <Button onClick={handleUpload}>Upload</Button>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {documents?.map((doc) => {
          const fileUrl = `${import.meta.env.VITE_API_URL}/uploads/${encodeURIComponent(doc.fileUrl)}`;
          const signatureUrl = doc.signatureImage
            ? `${import.meta.env.VITE_API_URL}/uploads/${encodeURIComponent(doc.signatureImage)}`
            : null;

          return (
            <div key={doc._id} className="border p-4 rounded space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <Badge variant={doc.status === 'signed' ? 'success' : 'secondary'}>
                    {doc.status}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  {doc.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => openSignaturePicker(doc._id)}>
                        Upload Signature
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDocId(doc._id);
                          setShowCanvas(true);
                        }}
                      >
                        Draw Signature
                      </Button>
                    </>
                  )}

                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">Download</Button>
                  </a>
                </div>
              </div>

              {/* PDF Preview */}
              {doc.fileUrl.endsWith('.pdf') && (
                <div className="border rounded p-2 max-h-[600px] overflow-auto">
                  <PdfPreview url={fileUrl} />
                </div>
              )}

              {/* Signature Preview */}
              {signatureUrl && (
                <div>
                  <p className="text-sm text-gray-500">Signed by:</p>
                  <img src={signatureUrl} alt="Signature" className="w-32 border rounded" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden signature input */}
      <input
        type="file"
        accept="image/*"
        ref={signatureInputRef}
        className="hidden"
        onChange={handleSignatureUpload}
      />

      {/* Draw signature modal/canvas */}
      {showCanvas && selectedDocId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-md space-y-2">
            <h3 className="text-lg font-semibold">Draw Signature</h3>
            <SignatureCanvas
              ref={sigPadRef}
              penColor="black"
              canvasProps={{ className: 'border w-full h-48 rounded' }}
            />
            <div className="flex gap-2 justify-end">
              <Button onClick={handleDrawSignature}>Submit</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCanvas(false);
                  sigPadRef.current?.clear();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
