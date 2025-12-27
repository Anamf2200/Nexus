import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user_schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/updateUser_dto';
import { sanitizeInput, sanitizeStringArray } from 'src/sanitzeInput';
import * as bcrypt from 'bcrypt'
import { ChangePasswordDto } from './dto/ChangePasswordDto';


@Injectable()
export class UserService {
constructor(@InjectModel(User.name)private userModel:Model<User>){}


async updateUser(id:string,data:UpdateProfileDto):Promise<User |null>{
    const user= await this.userModel.findById(id).select('-password')
    if(!user) throw new NotFoundException("User not found")
  if (data.name) data.name = sanitizeInput(data.name);
  if (data.bio) data.bio = sanitizeInput(data.bio);
    if (data.email) data.bio = sanitizeInput(data.email);
  if (data.startupHistory) data.startupHistory = sanitizeStringArray(data.startupHistory);
  if (data.investmentHistory) data.investmentHistory = sanitizeStringArray(data.investmentHistory);
  if (data.preferences) data.preferences = sanitizeStringArray(data.preferences);



        const updatedUser= await this.userModel.findByIdAndUpdate(id,data,{new:true})
    return updatedUser

}

async changePassword(
  userId: string,
  dto: ChangePasswordDto,
): Promise<{ message: string }> {
  const user = await this.userModel.findById(userId);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // 1️⃣ Verify current password
  const isMatch = await bcrypt.compare(
    dto.currentPassword,
    user.password,
  );

  if (!isMatch) {
    throw new BadRequestException('Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(dto.newPassword, salt);

  await user.save();

  return { message: 'Password updated successfully' };
}


async getProfile(id:string):Promise<User>{
return await this.userModel.findById(id).select('-password')
}

async getAllUser():Promise<User[]>{

    return await this.userModel.find()
}

async updateProfileImage(userId: string, imagePath: string) {
  const user = await this.userModel.findByIdAndUpdate(
    userId,
    { profileImage: imagePath },
    { new: true },
  ).select('-password');

  if (!user) throw new NotFoundException('User not found');
  return user;
}


}
