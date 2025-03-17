import nodemailer from 'nodemailer';
import { env } from './enums.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_ID,
    pass: env.GMAIL_PASS
  }
})
