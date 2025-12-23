import { IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateMeetingDTO{
    @IsString()
    @IsNotEmpty()
    participantId:string


    @IsString()
    title:string


    @IsDateString()
    startTime:string

    @IsDateString()
    endTime:string
}