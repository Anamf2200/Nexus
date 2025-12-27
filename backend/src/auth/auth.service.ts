import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/user/dto/RegisterDto';
import { User } from 'src/user/schema/user_schema';
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
import { sanitizeInput } from 'src/sanitzeInput';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel:Model<User>,private jwtService:JwtService, private mailService:MailService){}


    async register({name,email,password,role}:RegisterDto):Promise<User>{
          const safeName = sanitizeInput(name);
          const safeEmail=sanitizeInput(email).toLocaleLowerCase()


        const hashedpassword= await bcrypt.hash(password,10)

        const user= await this.userModel.create({
            name:safeName,
            email:safeEmail,
            password:hashedpassword,
            role:role
        })

        return user
    }


    async validateUser(email:string,password:string):Promise<User>{
          const safeEmail = sanitizeInput(email).toLowerCase();

const user= await this.userModel.findOne({email:safeEmail})
if(!user) throw new UnauthorizedException("User not found")
    const compare= await bcrypt.compare(password,user.password)
        if(!compare) throw new UnauthorizedException("Invalid credentials")
            return user
    }




    async login(user: any) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await this.userModel.findByIdAndUpdate(user._id, {
    otp,
    otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    isOtpVerified: false,
  });

  await this.mailService.sendOtp(user.email, otp);

  return {
   otpRequired:true,
    userId: user._id,
  };
}
async verifyOtp(userId: string, otp: string) {
      const safeOtp = sanitizeInput(otp).trim();

  const user = await this.userModel.findById(userId);

  if (!user) throw new UnauthorizedException('User not found');

  if (
    user.otp !== safeOtp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    throw new UnauthorizedException('Invalid or expired OTP');
  }

  user.isOtpVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const payload = {
    email: user.email,
    id: user._id.toString(),
    role: user.role,
  };

 return {
  access_token: this.jwtService.sign(payload),
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  },
};

}


  
}
