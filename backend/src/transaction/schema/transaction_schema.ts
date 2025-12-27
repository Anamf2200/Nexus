import { Schema,SchemaFactory,Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Schema()
export class Transaction extends Document{
    @Prop({type: Types.ObjectId, ref: 'User', required: true })
userId:Types.ObjectId

@Prop({required:true,type:String,enum:Object.values(TransactionType)})
type:TransactionType

@Prop({required:true})
amount:number

@Prop({default:TransactionStatus.PENDING,type:String,enum:Object.values(TransactionStatus)})
status:TransactionStatus


@Prop()
referenceId?:string
}

export const TransactionSchema=SchemaFactory.createForClass(Transaction)