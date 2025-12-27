import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/guards/jwt-guard';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create_transaction_dto';

@Controller('transaction')
@UseGuards(JWTAuthGuard)
export class TransactionController {
    constructor(private readonly transactionService:TransactionService){}


    @Post('deposit')
    async deposit(@Req()req, @Body()dto:CreateTransactionDto){
        return this.transactionService.createTransaction(
        req.user.id,
         dto.amount,
        dto.type,
       
        )


    }


     @Post('withdraw')
    async withdraw(@Req()req, @Body()dto:CreateTransactionDto){
        return this.transactionService.createTransaction(
        req.user.id,
         dto.amount,
        dto.type,
       
        )

        
    }

      @Post('transfer')
    async transfer(@Req()req, @Body()dto:CreateTransactionDto){
        return this.transactionService.createTransaction(
        req.user.id,
         dto.amount,
        dto.type,
       
        )

        
    }

    @Get('my')
    async getMyTransaction(@Req()req){
        return this.transactionService.getMytransaction(req.user.id)
    }
}
