import nodemailer from 'nodemailer';
import { env } from '../utils/enums.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_ID,
    pass: env.EMAIL_PASS
  }
})

// export const transporter = nodemailer.createTransport({
//   host: env.EMAIL_HOST,
//   secure: true,
//   port: 465,
//   auth: {
//     user: env.EMAIL_ID,
//     pass: env.EMAIL_PASS,
//   },
// })
