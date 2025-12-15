import { Body, Controller, Post,Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guards/local-guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}

    @Post('register')
    async register(@Body()body){

        return await this.authService.register(body)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request()req){
        return await this.authService.login(req.user)
    }

}
