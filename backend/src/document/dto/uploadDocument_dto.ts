import { IsString } from "class-validator";

export class UploadDocumentDto {
  @IsString()
  title: string;
}
