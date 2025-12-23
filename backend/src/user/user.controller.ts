import { Body, Controller, Get, Request, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user_schema';
import { UpdateProfileDto } from './dto/updateUser_dto';
import { JWTAuthGuard } from 'src/guards/jwt-guard';
import { RolesGuard } from 'src/guards/roles-guard';
import { Roles } from 'src/roles/role-decorator';


@UseGuards(JWTAuthGuard)
@Controller('user')
export class UserController {

    constructor(private userService:UserService){}


    @Get('me')
    async getProfile(@Request()req):Promise<User>{
        return  await this.userService.getProfile(req.user.id)
    }
    
    @Put('me')
    async updateUser(@Request()req,@Body()body:UpdateProfileDto):Promise<User|null>{
        return await this.userService.updateUser(req.user.id,body)
    }

    @Get()
async getAllUsers() {
  return this.userService.getAllUser(); // return id, name, email
}

    @UseGuards(JWTAuthGuard,RolesGuard)
    @Roles('investor')
    @Get('investor')
    async investor(){
        return "I am investor"
    }


     @UseGuards(JWTAuthGuard,RolesGuard)
    @Roles('entrepreneur')
    @Get('entrepreneur')
    async entrepreneur(){
        return "I am entrepreneur"
    }
}
