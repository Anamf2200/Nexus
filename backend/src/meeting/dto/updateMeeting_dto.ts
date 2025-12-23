import { IsEnum } from "class-validator";
import { MeetingStatus } from "../schema/meeting_schema";


export class UpdateMeetingDTO{
    @IsEnum(MeetingStatus)
    status:MeetingStatus
}