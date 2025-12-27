import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
