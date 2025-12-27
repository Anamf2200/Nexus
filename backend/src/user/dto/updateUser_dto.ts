import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
  @IsString()
  name?: string;

    @IsOptional()
  @IsString()
  email?: string;

    @IsOptional()
  @IsString()
  password?: string;


      @IsOptional()
  @IsString()
  bio?: string;


      @IsOptional()
  @IsArray()
  @IsString({ each: true })
  startupHistory?: string[];

      @IsOptional()
  @IsArray()
  @IsString({ each: true })
  investmentHistory?: string[];


      @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
}
