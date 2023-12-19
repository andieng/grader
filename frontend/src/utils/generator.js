export const generateInviteLink = (url, classId, token) => {
  return `${url}/${classId}/invitations?token=${token}`;
};
