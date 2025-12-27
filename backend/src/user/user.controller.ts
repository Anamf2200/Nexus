import { Body, Controller, Get, Request, Put, UseGuards, UseInterceptors, UploadedFile, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user_schema';
import { UpdateProfileDto } from './dto/updateUser_dto';
import { JWTAuthGuard } from 'src/guards/jwt-guard';
import { RolesGuard } from 'src/guards/roles-guard';
import { Roles } from 'src/roles/role-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { ChangePasswordDto } from './dto/ChangePasswordDto';


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


    @Put('me/avatar')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: join('./uploads', 'profile'),
      filename: (_, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}-${Math.random()}.${ext}`);
      },
    }),
    fileFilter: (_, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only images allowed'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  }),
)
async uploadAvatar(
  @Request() req,
  @UploadedFile() file: Express.Multer.File,
) {
  const relativePath = `profile/${file.filename}`;
  return this.userService.updateProfileImage(req.user.id, relativePath);
}


@Patch('change-password')
changePassword(
  @Req() req,
  @Body() dto: ChangePasswordDto,
) {
  return this.userService.changePassword(req.user.id, dto);
}
}
