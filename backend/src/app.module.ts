import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import {MongooseModule} from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MeetingModule } from './meeting/meeting.module';
import { SignalingGateway } from './signaling/signaling.gateway';
import { DocumentModule } from './document/document.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TransactionModule } from './transaction/transaction.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [

    ServeStaticModule.forRoot({
  rootPath: join('/app', 'uploads'), // points directly to the volume
      serveRoot: '/uploads',
    }),

    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    AuthModule,
    UserModule,
    MeetingModule,
    DocumentModule,
    TransactionModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, SignalingGateway],
})
export class AppModule {}
