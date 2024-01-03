// Error message
export const ERROR_BAD_REQUEST = "Bad Request";
export const ERROR_EMAIL_MUST_BE_VERIFIED = "Email must be verified to access";
export const ERROR_NOT_AUTHENTICATED = "Not authenticated";
export const ERROR_NOT_AUTHORIZED = "Not authorized to access";
export const ERROR_USER_NOT_EXIST = "User does not exist";
export const ERROR_CREATE_ASSIGNMENT =
  "Something went wrong when creating new assignment";
export const ERROR_CREATE_CLASS =
  "Something went wrong when creating new class";
export const ERROR_CREATE_INVITATION =
  "Something went wrong when creating an invitation";
export const ERROR_CREATE_CLASS_MEMBER =
  "Something went wrong when creating new class member";
export const ERROR_INVALID_INVITATION = "Invitation expired or not found";
export const ERROR_CLASS_NOT_FOUND = "Class not found";
export const ERROR_CLASS_MEMBER_NOT_FOUND = "Class member not found";
export const ERROR_SEND_INVITATIONS_FAILED =
  "Something went wrong when sending invitations";
export const ERROR_INPUT_DATA_NOT_FOUND = "Input data not found";
export const ERROR_INPUT_FILE_NOT_FOUND = "Input file not found";
export const ERROR_MAPPING_NOT_FOUND = "Mapping not found";
export const ERROR_STUDENT_ID_ALREADY_MAPPED =
  "This student id has already been mapped";
export const ERROR_USER_ALREADY_MAPPED = "User has already been mapped";

// Success message
export const MSG_INVITE_SUCCESSFULLY = "Invite members via email successfully";

// Claims
export const CLAIM_EMAIL = "https://grader.com/claims/email";
export const CLAIM_EMAIL_VERIFIED = "https://grader.com/claims/email_verified";
export const CLAIM_ROLES = "https://grader.com/claims/roles";

// English mail content
export const EN_DESCRIPTION_STUDENT_PREFIX = "Invited you to enroll";
export const EN_DESCRIPTION_TEACHER_PREFIX = "Invited you to co-teach";
export const EN_BUTTON_CONTENT = "Accept invite";
export const EN_MESSAGE =
  "Forward to only those you trust. Anyone with this email may be able to accept the invitation.";
export const EN_SUBJECT_STUDENT_PREFIX = "Invitation to enroll:";
export const EN_SUBJECT_TEACHER_PREFIX = "Invitation to co-teach:";

// Vietnamese mail content
export const VI_DESCRIPTION_STUDENT_PREFIX = "Đã mời bạn tham gia";
export const VI_DESCRIPTION_TEACHER_PREFIX = "Đã mời bạn cùng dạy";
export const VI_BUTTON_CONTENT = "Chấp nhận lời mời";
export const VI_MESSAGE =
  "Chỉ chuyển tiếp đến những người bạn tin tưởng. Bất cứ ai có email này đều có thể chấp nhận lời mời.";
export const VI_SUBJECT_STUDENT_PREFIX = "Lời mời tham gia lớp học:";
export const VI_SUBJECT_TEACHER_PREFIX = "Lời mời cùng dạy lớp:";
