import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum DocumentStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  APPROVED = 'approved',
}

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy: Types.ObjectId;

  @Prop({ default: 1 })
  version: number;

  @Prop({ enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Prop()
  signatureImage?: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
