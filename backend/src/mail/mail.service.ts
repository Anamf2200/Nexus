import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: '"Nexus Security" <no-reply@nexus.com>',
      to: email,
      subject: 'Your OTP Code',
      html: `<h3>Your OTP Code</h3><p><b>${otp}</b></p><p>Valid for 5 minutes</p>`,
    });
  }
}
