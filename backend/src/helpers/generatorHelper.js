import { customAlphabet } from "nanoid";

export const generateInvitationToken = () => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 7);
  return nanoid();
};

export const generateInviteLink = (url, classId, token) => {
  return `${url}/${classId}/invitations?token=${token}`;
};
