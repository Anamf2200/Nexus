import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";



export enum MeetingStatus{
    PENDING='pending',
    ACCEPTED="accepted",
    REJECTED='rejected'
}


@Schema({timestamps:true})
export class Meeting extends Document{

    @Prop({required:true,type:Types.ObjectId,ref:"User"})
    organizer:Types.ObjectId

    @Prop({require:true, type:Types.ObjectId,ref:'User'})
    participants:Types.ObjectId[]


    @Prop({required:true})
    title:string


    @Prop({required:true})
    startTime:Date


    
    @Prop({required:true})
    endTime:Date


    @Prop({enum:MeetingStatus,default:MeetingStatus.PENDING})
    status:MeetingStatus

}

export const MeetingSchema= SchemaFactory.createForClass(Meeting)