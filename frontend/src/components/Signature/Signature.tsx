// src/components/SignDocument.tsx
import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useSignDocumentMutation } from '../../store/document/documentApi';

interface SignDocumentProps {
  docId: string; // ID of the document to sign
  onSigned?: () => void; // optional callback
}

export default function SignDocument({ docId, onSigned }: SignDocumentProps) {
  const sigPad = useRef<SignatureCanvas>(null);
  const [signDocument, { isLoading }] = useSignDocumentMutation();

  const handleSubmit = async () => {
    if (!sigPad.current) return alert('Please sign first');

    // Get signature as blob
    const dataURL = sigPad.current.toDataURL(); // base64 PNG
    const blob = await (await fetch(dataURL)).blob();
    const file = new File([blob], 'signature.png', { type: 'image/png' });

    try {
      await signDocument({ docId, signature: file }).unwrap();
      alert('Document signed successfully!');
      if (onSigned) onSigned();
    } catch (err: any) {
      alert(err.data?.message || 'Failed to sign document');
    }
  };

  const clear = () => sigPad.current?.clear();

  return (
    <div className="border p-4 rounded shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-2">Sign Document</h3>
      <SignatureCanvas
        ref={sigPad}
        penColor="black"
        canvasProps={{ className: 'border w-full h-48 mb-2' }}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Signing...' : 'Submit Signature'}
        </button>
        <button
          onClick={clear}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
