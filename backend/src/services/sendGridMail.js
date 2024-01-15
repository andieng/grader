import "dotenv/config";
import sgMail from "@sendgrid/mail";
import {
  generateInvitationPlainText,
  generateInvitationHtml,
} from "../helpers/invitationMailHelper";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendMail(mailContent) {
  const msg = {
    from: '"Grader" <nguyenngocthuy9a1@gmail.com>',
    to: mailContent.recipient,
    subject: mailContent.subject,
    text: generateInvitationPlainText(mailContent),
    html: generateInvitationHtml(mailContent),
  };
  sgMail.send(msg).then(
    () => {},
    (error) => {
      console.log("Error");
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
}
