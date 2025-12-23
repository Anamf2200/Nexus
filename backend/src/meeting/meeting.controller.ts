import { Body, Controller, Get, Injectable, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDTO } from './dto/createMeeting_dto';
import { UpdateMeetingDTO } from './dto/updateMeeting_dto';
import { JWTAuthGuard } from 'src/guards/jwt-guard';

@Controller('meeting')
@UseGuards(JWTAuthGuard)
export class MeetingController {

    constructor(private readonly meetingService:MeetingService){}


    @Post()
    async create(@Req()req, @Body()dto:CreateMeetingDTO){
        return await this.meetingService.createMeeting(req.user.id,dto)

    }

    @Put(':id/status')
    async update(@Param('id')id:string,@Body()dto:UpdateMeetingDTO){
        return await this.meetingService.updateMeeting(id,dto.status)
    }


@Get()
async getMeeting(@Req()req){
    return await this.meetingService.getUserMeetings(req.user.id)
}

}
