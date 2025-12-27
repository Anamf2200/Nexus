import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Transaction, TransactionStatus, TransactionType } from './schema/transaction_schema';
import { Model, Types } from 'mongoose';
import Stripe from 'stripe';

@Injectable()
export class TransactionService {
    private stripe:Stripe
    constructor(@InjectModel(Transaction.name) private transactionModel:Model<Transaction>
){
     this.stripe=new Stripe(process.env.STRIPE_SECRET_KEY!)
}

async createTransaction(userId:string,amount:number,type:TransactionType):Promise<Transaction>{
const transaction= await this.transactionModel.create({
   userId: new Types.ObjectId(userId),
    type,
    amount,
    status:TransactionStatus.PENDING
})


 try {
      
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, 
        currency: 'usd',
        payment_method: 'pm_card_visa',
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      
      transaction.status = TransactionStatus.COMPLETED;
      transaction.referenceId = paymentIntent.id;
    } catch (error) {
     
      transaction.status = TransactionStatus.FAILED;
    }

   
    return transaction.save();
}


async getMytransaction(userId:string):Promise<Transaction[]>{

    return await this.transactionModel.find({userId: new Types.ObjectId(userId) }).sort({createdAt:-1})
}

}
