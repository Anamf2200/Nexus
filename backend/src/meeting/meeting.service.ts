import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meeting, MeetingStatus } from './schema/meeting_schema';
import { Model, Types } from 'mongoose';
import { CreateMeetingDTO } from './dto/createMeeting_dto';
import { UpdateMeetingDTO } from './dto/updateMeeting_dto';
import { sanitizeInput } from 'src/sanitzeInput';

@Injectable()
export class MeetingService {

    constructor(@InjectModel(Meeting.name)private meetingModel:Model<Meeting>){}


   async createMeeting(userId: string, dto: CreateMeetingDTO): Promise<Meeting> {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) throw new BadRequestException("Invalid meeting time");

   const conflict = await this.meetingModel.findOne({
  participants: new Types.ObjectId(dto.participantId),
  status: { $in: [MeetingStatus.ACCEPTED, MeetingStatus.PENDING] },
  $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
});

    if (conflict) throw new BadRequestException("Time slot already taken");

    const meeting = await this.meetingModel.create({
       organizer: new Types.ObjectId(userId),
  participants: [new Types.ObjectId(dto.participantId)],
        title: sanitizeInput(dto.title) ,
        startTime: start,
        endTime: end,
        status: MeetingStatus.PENDING,
    });

    return meeting;
}



    async updateMeeting(meetingId:string,status:MeetingStatus){

        const meeting = await this.meetingModel.findById(meetingId)
        if(!meeting) throw new NotFoundException("Meeting not found")
          

    meeting.status = status;
            return meeting.save()
    }

   async getUserMeetings(userId: string) {
  const objectId = new Types.ObjectId(userId);

  return this.meetingModel
    .find({
      $or: [
        { organizer: objectId },
        { participants: objectId },
      ],
    })
    .populate('organizer participants', '-password');
}

}
