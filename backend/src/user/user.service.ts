import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user_schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/updateUser_dto';

@Injectable()
export class UserService {
constructor(@InjectModel(User.name)private userModel:Model<User>){}


async updateUser(id:string,data:UpdateProfileDto):Promise<User |null>{
    const user= await this.userModel.findById(id).select('-password')
    if(!user) throw new NotFoundException("User not found")
        const updatedUser= await this.userModel.findByIdAndUpdate(id,data,{new:true})
    return updatedUser

}

async getProfile(id:string):Promise<User>{
return await this.userModel.findById(id).select('-password')
}
}
