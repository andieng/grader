import "dotenv/config";
import nodemailer from "nodemailer";
import {
  generateInvitationPlainText,
  generateInvitationHtml,
} from "../helpers/invitationMailHelper";

const config = {
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export function sendMail(mailContent) {
  const mailOptions = {
    from: '"Grader" <nguyenngocthuy9a1@gmail.com>',
    to: mailContent.recipient,
    subject: mailContent.subject,
    text: generateInvitationPlainText(mailContent),
    html: generateInvitationHtml(mailContent),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      transporter.close();
      throw error;
    } else {
      console.info("Message sent: " + info.messageId);
      transporter.close();
    }
  });
}
