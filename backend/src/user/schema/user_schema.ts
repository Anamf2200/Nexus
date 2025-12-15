

import {Schema,Prop,SchemaFactory} from '@nestjs/mongoose'
import { Document } from 'mongoose'




@Schema()
export class User extends Document{

    @Prop()
    name:string

    @Prop()
email:string

@Prop()
password:string


@Prop({enum:['investor', 'entrepreneur'],required:true})
role:string


@Prop()
bio:string


@Prop({type:[String],default:[]})
startupHistory:string[]



@Prop({type:[String],default:[]})
investmentHistory:string[]



@Prop({type:[String],default:[]})
preferences:string[]


}

export const userSchema=SchemaFactory.createForClass(User)