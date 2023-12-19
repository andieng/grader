import { customAlphabet } from "nanoid";

export const generateInvitationToken = () => {
  return customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);
};

export const generateInviteLink = (url, classId, token) => {
  return `${url}/${classId}/invitations?token=${token}`;
};
