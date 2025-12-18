import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "anaskhanofficial005@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

// // Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from:'anaskhanofficial005@gmail.com',
    to: "anas.k.khan.001@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.messageId);
})();