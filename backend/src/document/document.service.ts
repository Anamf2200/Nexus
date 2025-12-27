import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document,DocumentStatus } from './schema/document_schema';
import { sanitizeInput } from 'src/sanitzeInput';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name)
    private readonly docModel: Model<Document>,
  ) {}

  async uploadDocument(userId: string, filePath: string, title: string) {
  return this.docModel.create({
    title:sanitizeInput(title),
    fileUrl: filePath, // relative path like 'documents/1678412345-file.pdf'
    uploadedBy: userId,
    status: DocumentStatus.PENDING,
  });
}

async addSignature(docId: string, signaturePath: string) {
  return this.docModel.findByIdAndUpdate(
    docId,
    {
      signatureImage: signaturePath, // relative path like 'signatures/1678412345-sign.png'
      status: DocumentStatus.SIGNED,
    },
    { new: true },
  );
}


  async getUserDocuments(userId: string) {
    return this.docModel.find({ uploadedBy: userId });
  }

  
}
