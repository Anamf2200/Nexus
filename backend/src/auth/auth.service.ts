import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/user/dto/RegisterDto';
import { User } from 'src/user/schema/user_schema';
import * as bcrypt from 'bcrypt'
import {JwtService} from '@nestjs/jwt'
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel:Model<User>,private jwtService:JwtService){}


    async register({name,email,password,role}:RegisterDto):Promise<User>{

        const hashedpassword= await bcrypt.hash(password,10)

        const user= await this.userModel.create({
            name:name,
            email:email,
            password:hashedpassword,
            role:role
        })

        return user
    }


    async validateUser(email:string,password:string):Promise<User>{
const user= await this.userModel.findOne({email})
if(!user) throw new UnauthorizedException("User not found")
    const compare= await bcrypt.compare(password,user.password)
        if(!compare) throw new UnauthorizedException("Invalid credentials")
            return user
    }


    async login(user:any){
        const payload={email:user.email,id:user._id,role:user.role}

        return{
            access_token: this.jwtService.sign(payload),
            user: { email: user.email, id: user._id, role: user.role }
        }
    }
}
