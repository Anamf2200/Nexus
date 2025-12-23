import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentService } from './document.service';
import { JWTAuthGuard } from 'src/guards/jwt-guard';
import { join } from 'path';

const UPLOAD_BASE = '/app/uploads';

@Controller('documents')
@UseGuards(JWTAuthGuard)
export class DocumentController {
  constructor(private docService: DocumentService) {}

  @Post('upload')
 // For documents
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: join(UPLOAD_BASE, 'documents'),
      filename: (_, file, cb) => {
        const safeName = file.originalname
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9.-]/g, '');
        cb(null, Date.now() + '-' + safeName);
      },
    }),
  }),
)

  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Req() req,
  ) {
    // Save relative path in DB: documents/filename.pdf
    const relativePath = `documents/${file.filename}`;
    return this.docService.uploadDocument(req.user.id, relativePath, title);
  }

  @Get('my')
  async getMyDocs(@Req() req) {
    return await this.docService.getUserDocuments(req.user?.id);
  }

  @Post(':id/sign')
  // For signatures
@UseInterceptors(
  FileInterceptor('signature', {
    storage: diskStorage({
      destination: join(UPLOAD_BASE, 'signatures'),
      filename: (_, file, cb) => {
        const safeName = file.originalname
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9.-]/g, '');
        cb(null, Date.now() + '-' + safeName);
      },
    }),
  }),
)

  sign(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const relativePath = `signatures/${file.filename}`;
    return this.docService.addSignature(id, relativePath);
  }
}
