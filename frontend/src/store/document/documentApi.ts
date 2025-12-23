// src/store/document/documentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Document {
  _id: string;
  title: string;
  fileUrl: string;
  uploadedBy: string;
  status: 'pending' | 'signed';
  signatureImage?: string;
}

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Document'],
  endpoints: (builder) => ({

    getUserDocuments: builder.query<Document[], void>({
      query: () => '/documents/my',
      providesTags: ['Document'],
    }),

    uploadDocument: builder.mutation<Document, { title: string; file: File }>({
      query: ({ title, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        return {
          url: '/documents/upload',   // ✅ FIXED
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Document'],
    }),

    signDocument: builder.mutation<
      Document,
      { docId: string; signature: File }
    >({
      query: ({ docId, signature }) => {
        const formData = new FormData();
        formData.append('signature', signature);

        return {
          url: `/documents/${docId}/sign`, // ✅ FIXED
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Document'],
    }),

  }),
});


export const {
  useGetUserDocumentsQuery,
  useUploadDocumentMutation,
  useSignDocumentMutation,
} = documentApi;
