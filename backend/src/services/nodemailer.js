import "dotenv/config";
import nodemailer from "nodemailer";
import {
  generateInvitationPlainText,
  generateInvitationHtml,
} from "../helpers/invitationMailHelper";

const config = {
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  port: 587,
  secure: false,
  requireTLS: true,
  logger: true,
  debug: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export async function sendMail(mailContent) {
  const mailOptions = {
    from: '"Grader" <nguyenngocthuy9a1@gmail.com>',
    to: mailContent.recipient,
    subject: mailContent.subject,
    text: generateInvitationPlainText(mailContent),
    html: generateInvitationHtml(mailContent),
  };
  return await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email error: ", err);
        reject(err);
      } else {
        console.log("Email sent: ", info.messageId);
        resolve(info);
      }
    });
    // .then((info) => {
    //   if (info) {
    //     console.log("Email sent: ", info.messageId);
    //     resolve();
    //   } else {
    //     resolve(null);
    //   }
    // })
    // .catch((err) => {
    //   console.error("Email error: ", err);
    //   reject(err);
    // });
  });
  // await new Promise((resolve, reject) => {
  //   // send mail
  //   transporter.sendMail(mailOptions, (err, info) => {
  //     transporter.close();
  //     if (err) {
  //       console.error(err);
  //       reject(err);
  //     } else {
  //       console.log(info);
  //       resolve(info);
  //     }
  //   });
  // });
  // transporter.sendMail(mailOptions, (error, info) => {
  //   transporter.close();
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.info(`Message sent: ${info.messageId}`);
  //   }
  // });
}
