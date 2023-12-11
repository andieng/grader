import {
  ERROR_CLASS_MEMBER_NOT_FOUND,
  ERROR_CLASS_NOT_FOUND,
  ERROR_CREATE_ASSIGNMENT,
  ERROR_CREATE_CLASS,
  ERROR_CREATE_CLASS_MEMBER,
  ERROR_CREATE_INVITATION,
  ERROR_INVALID_INVITATION,
  MSG_INVITE_SUCCESSFULLY,
} from "../constants";
import {
  generateSubject,
  generateButtonContent,
  generateDescription,
  generateMessage,
} from "../helpers/invitationMailHelper";
import { groupBy } from "../helpers/objectHelper";
import { Assignment, Class, ClassMember, Invitation, User } from "../models";
import { sendMail } from "../services/sendGridMail";

export const addMemberToClass = async (req, res) => {
  const { token } = req.body;
  const { classId } = req.params;

  const findMember = await ClassMember.findOne({
    where: {
      classId,
      memberId: req.user.id,
    },
  });
  if (findMember) {
    return res.json(findMember);
  }

  const invitation = await Invitation.findByPk(token);
  if (!invitation) {
    res.status(400);
    throw new Error(ERROR_INVALID_INVITATION);
  }

  if (invitation.email !== null && invitation.email !== req.user.email) {
    res.status(400);
    throw new Error(ERROR_CLASS_NOT_FOUND);
  }

  const member = await ClassMember.create({
    classId,
    memberId: req.user.id,
    role: invitation.role,
  });
  await Invitation.destroy({
    where: {
      classId,
      email: req.user.email,
    },
  });

  return res.json(member);
};

export const createClass = async (req, res) => {
  const { className, classPicture, url } = req.body;

  let createdClass;
  if (classPicture) {
    createdClass = await Class.create({
      className,
      classPicture,
    });
  } else {
    createdClass = await Class.create({
      className,
    });
  }

  if (!createdClass) {
    res.status(500);
    throw new Error(ERROR_CREATE_CLASS);
  }
  const createdInvitation = await Invitation.create({
    classId: createdClass.classId,
    email: null,
    role: "student",
  });
  if (!createdInvitation) {
    res.status(500);
    throw new Error(ERROR_CREATE_INVITATION);
  }
  const token = createdInvitation.token;
  const inviteLink = `${url}/${createdClass.classId}/invitations?token=${token}`;
  createdClass.classInviteStudentLink = inviteLink;
  await createdClass.save();

  const createdTeacher = await ClassMember.create({
    classId: createdClass.classId,
    memberId: req.user.id,
    role: "teacher",
  });

  if (!createdTeacher) {
    res.status(500);
    throw new Error(ERROR_CREATE_CLASS_MEMBER);
  }

  return res.json({ class: createdClass, classMember: createdTeacher });
};

export const inviteMember = async (req, res) => {
  const { url, emails, role, lang } = req.body;
  const classMember = await ClassMember.findOne({
    where: {
      memberId: req.user.id,
      classId: req.params.classId,
    },
    include: {
      model: Class,
      as: "class",
      required: true,
    },
  });

  if (!classMember) {
    res.status(400);
    throw new Error(ERROR_CLASS_MEMBER_NOT_FOUND);
  }

  const createdInvitations = await Invitation.bulkCreate(
    emails.map((email) => ({
      classId: classMember.classId,
      email,
      role,
    }))
  );

  createdInvitations.forEach(async (item) => {
    const token = item.token;
    const inviteLink = `${url}/invitations?token=${token}`;

    const mailContent = {
      subject: generateSubject(classMember.class.className, role, lang),
      className: classMember.class.className,
      name: req.user.name,
      avatar: req.user.avatar,
      description: generateDescription(classMember.class.className, role, lang),
      buttonContent: generateButtonContent(lang),
      inviteLink,
      recipient: item.email,
      sender: req.user.email,
      message: generateMessage(lang),
    };
    sendMail(mailContent);
  });

  res.json({ message: MSG_INVITE_SUCCESSFULLY });
};

export const getClasses = async (req, res) => {
  if (req.user.role === "admin") {
    const { offset, limit } = req.query;
    const classes = await Class.findAll({
      offset: offset ? offset : 0,
      limit: limit ? limit : 100,
    });
    return res.json(classes);
  } else {
    const classMemberInfo = await ClassMember.findAll({
      where: {
        memberId: req.user.id,
      },
    });
    if (!classMemberInfo) {
      return res.json({
        teaching: [],
        enrolled: [],
      });
    }
    const classMemberInfoSplit = groupBy(classMemberInfo, "role");

    const teachingClassMemberInfo = classMemberInfoSplit.teacher;
    let teachingClasses = [];
    if (teachingClassMemberInfo?.length > 0) {
      teachingClasses = await Promise.all(
        teachingClassMemberInfo.map(
          async ({ classId }) => await Class.findByPk(classId)
        )
      );
    }

    const enrolledClassMemberInfo = classMemberInfoSplit.student;
    let enrolledClasses = [];
    if (enrolledClassMemberInfo?.length > 0) {
      enrolledClasses = await Promise.all(
        enrolledClassMemberInfo.map(
          async ({ classId }) => await Class.findByPk(classId)
        )
      );
    }

    return res.json({
      teaching: teachingClasses,
      enrolled: enrolledClasses,
    });
  }
};

export const getClassMembers = async (req, res) => {
  const { role } = req.query;
  const { classId } = req.params;

  if (role) {
    const classMembers = await ClassMember.findAll({
      where: {
        classId,
        role,
        memberId: req.user.id,
      },
      include: {
        model: User,
        as: "member",
        required: true,
      },
    });

    return res.json(classMembers);
  } else {
    const classMembers = await ClassMember.findAll({
      where: {
        classId,
        memberId: req.user.id,
      },
      include: {
        model: User,
        as: "member",
        required: true,
      },
    });

    return res.json(classMembers);
  }
};

export const getClassDetails = async (req, res) => {
  const { classId } = req.params;

  const classDetails = await Class.findByPk(classId);

  if (!classDetails) {
    res.status(400);
    throw new Error(ERROR_CLASS_NOT_FOUND);
  }

  return res.json(classDetails);
};

export const addAssignment = async (req, res) => {
  const { assignmentName, assignmentGradeScale } = req.body;

  const createdAssignment = await Assignment.create({
    classId: req.class.classId,
    assignmentName,
    assignmentGradeScale,
  });

  if (!createdAssignment) {
    res.status(500);
    throw new Error(ERROR_CREATE_ASSIGNMENT);
  }

  return res.json(createdAssignment);
};
