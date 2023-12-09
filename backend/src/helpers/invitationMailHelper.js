import {
  EN_BUTTON_CONTENT,
  EN_DESCRIPTION_STUDENT_PREFIX,
  EN_DESCRIPTION_TEACHER_PREFIX,
  EN_MESSAGE,
  EN_SUBJECT_STUDENT_PREFIX,
  EN_SUBJECT_TEACHER_PREFIX,
  VI_BUTTON_CONTENT,
  VI_DESCRIPTION_STUDENT_PREFIX,
  VI_DESCRIPTION_TEACHER_PREFIX,
  VI_MESSAGE,
  VI_SUBJECT_STUDENT_PREFIX,
  VI_SUBJECT_TEACHER_PREFIX,
} from "../constants";

const generateSenderHtml = (sender) => {
  const senderSplit = sender.split("@");
  const senderMailName = senderSplit[0];
  const senderHostSplit = senderSplit[1].split(".");

  const senderMailNameHtml = `<span>${senderMailName}</span>`;
  const senderHostHtml = senderHostSplit
    .map((item) => {
      return `<span>${item}</span>`;
    })
    .join(".");

  return `${senderMailNameHtml}@${senderHostHtml}`;
};

export const generateInvitationHtml = ({
  subject,
  name,
  avatar,
  description,
  buttonContent,
  inviteLink,
  message,
  sender,
}) => {
  const senderHtml = generateSenderHtml(sender);

  return ` <html>
    <head>
      <title>${subject}</title>
        <style>
            @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");
        </style>
    </head>
    <body>
      <div style="font-family: Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
    <table cellpadding="0" cellspacing="0" dir="ltr" role="presentation" align="center" style="background-color: #ffffff; border-collapse: collapse; max-width: 632px; min-width: 256px; word-break: break-word; width: 100%;">
        <tbody>
            <tr>
                <td style="padding: 16px;">
                    <table cellpadding="0" cellspacing="0" dir="ltr" role="presentation">
                        <tbody>
                            <tr>
                                <td style="padding-bottom: 16px;">
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        dir="ltr"
                                        role="presentation"
                                        style="background-color: #ffffff; border-collapse: collapse; max-width: 632px; min-width: 256px; background-color: #ffffff; width: 100%;"
                                        width="100%"
                                    >
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div style="display: flex; line-height: 32px; align-items: center;">
                                                        <img
                                                            alt="Biểu trưng của lớp học"
                                                            aria-hidden="true"
                                                            style="display: block; margin: 0;"
                                                            height="32"
                                                            width="32"
                                                            src="https://grader-phi.vercel.app/icon-64x64.png"
                                                            class="CToWUd"
                                                            data-bit="iit"
                                                        />
                                                        <h1 style="line-height: 32px; margin: 0; font-family: Quicksand, sans-serif; margin-left: 10px; font-size: 26px; font-weight: 700; color: rgb(58, 197, 201);">Grader</h1>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 24px;">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <table cellpadding="0" cellspacing="0" dir="ltr" role="presentation" style="border: 1px solid #dadce0; border-collapse: separate; border-radius: 8px; width: 100%;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="padding: 24px 24px 32px 24px;">
                                                                    <table cellpadding="0" cellspacing="0" dir="ltr" role="presentation" style="width: 100%;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center" style="font-size: 0; padding-top: 16px;">
                                                                                    <div>
                                                                                        <img
                                                                                            alt='aria-hidden="true"'
                                                                                            src=${avatar}
                                                                                            height="40"
                                                                                            width="40"
                                                                                            style="border-radius: 50%; height: 40px; width: 40px; padding: 0px;"
                                                                                            role="presentation"
                                                                                            class="CToWUd"
                                                                                            data-bit="iit"
                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    align="center"
                                                                                    style="
                                                                                        font-family: Google Sans, Roboto, Helvetica, Arial, sans-serif;
                                                                                        font-size: 14px;
                                                                                        font-weight: 500;
                                                                                        letter-spacing: 0.25px;
                                                                                        line-height: 20px;
                                                                                        color: #3c4043;
                                                                                        padding-top: 4px;
                                                                                    "
                                                                                >
                                                                                    ${name}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    align="center"
                                                                                    style="
                                                                                        font-family: Roboto, Helvetica, Arial, sans-serif;
                                                                                        font-size: 12px;
                                                                                        font-weight: 400;
                                                                                        letter-spacing: 0.3px;
                                                                                        line-height: 16px;
                                                                                        color: #5f6368;
                                                                                        padding-top: 4px;
                                                                                    "
                                                                                >
                                                                                    ${senderHtml}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td
                                                                                    align="center"
                                                                                    style="
                                                                                        font-family: Google Sans, Roboto, Helvetica, Arial, sans-serif;
                                                                                        font-size: 18px;
                                                                                        font-weight: 400;
                                                                                        letter-spacing: 0;
                                                                                        line-height: 24px;
                                                                                        color: #000000;
                                                                                        padding-top: 32px;
                                                                                    "
                                                                                >
                                                                                    ${description}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="center" style="padding: 24px 0 8px 0;">
                                                                                    <table cellpadding="0" cellspacing="0" dir="ltr" role="presentation">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td style="border: 1px solid #dadce0; border-radius: 4px; padding: 8px 24px;">
                                                                                                    <a
                                                                                                        href="${inviteLink}"
                                                                                                        style="
                                                                                                            font-family: Google Sans, Roboto, Helvetica, Arial, sans-serif;
                                                                                                            font-size: 14px;
                                                                                                            font-weight: 500;
                                                                                                            letter-spacing: 0.25px;
                                                                                                            line-height: 20px;
                                                                                                            color: #1967d2;
                                                                                                            text-decoration: none;
                                                                                                        "
                                                                                                    >
                                                                                                        ${buttonContent}
                                                                                                    </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    align="center"
                                                    style="font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 400; letter-spacing: 0.3px; line-height: 16px; color: #5f6368; padding: 12px 32px 0;"
                                                >
                                                    ${message}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>

    </body>
  </html>
`;
};

export const generateInvitationPlainText = ({
  name,
  description,
  buttonContent,
  inviteLink,
  message,
  sender,
}) => {
  return `
  ******
  Grader
  ******
  
  ${name} <${sender}>
  ${description}
  
  ${buttonContent}: ${inviteLink}
  
  ${message}`;
};

export const generateDescription = (className, role, lang) => {
  if (lang === "vi") {
    if (role === "teacher") {
      return `${VI_DESCRIPTION_TEACHER_PREFIX} ${className}`;
    } else {
      return `${VI_DESCRIPTION_STUDENT_PREFIX} ${className}`;
    }
  } else {
    if (role === "teacher") {
      return `${EN_DESCRIPTION_TEACHER_PREFIX} ${className}`;
    } else {
      return `${EN_DESCRIPTION_STUDENT_PREFIX} ${className}`;
    }
  }
};

export const generateButtonContent = (lang) => {
  if (lang === "vi") {
    return VI_BUTTON_CONTENT;
  } else {
    return EN_BUTTON_CONTENT;
  }
};

export const generateMessage = (lang) => {
  if (lang === "vi") {
    return VI_MESSAGE;
  } else {
    return EN_MESSAGE;
  }
};

export const generateSubject = (className, role, lang) => {
  if (lang === "vi") {
    if (role === "teacher") {
      return `${VI_SUBJECT_TEACHER_PREFIX} ${className}`;
    } else {
      return `${VI_SUBJECT_STUDENT_PREFIX} ${className}`;
    }
  } else {
    if (role === "teacher") {
      return `${EN_SUBJECT_TEACHER_PREFIX} ${className}`;
    } else {
      return `${EN_SUBJECT_STUDENT_PREFIX} ${className}`;
    }
  }
};
