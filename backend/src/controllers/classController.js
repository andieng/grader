import XLSX from "xlsx";
import {
  ERROR_CLASS_MEMBER_NOT_FOUND,
  ERROR_CLASS_NOT_FOUND,
  ERROR_CREATE_CLASS,
  ERROR_CREATE_CLASS_MEMBER,
  ERROR_CREATE_INVITATION,
  ERROR_INPUT_FILE_NOT_FOUND,
  ERROR_INVALID_INVITATION,
  MSG_INVITE_SUCCESSFULLY,
  ERROR_STUDENT_ID_ALREADY_MAPPED,
  ERROR_USER_ALREADY_MAPPED,
  ERROR_USER_ALREADY_JOINED_CLASS,
  ERROR_SOMETHING_WENT_WRONG,
  ERROR_NOT_AUTHORIZED,
  ERROR_INVALID_MAPPING,
} from "../constants";
import {
  generateSubject,
  generateButtonContent,
  generateDescription,
  generateMessage,
} from "../helpers/invitationMailHelper";
import { groupBy } from "../helpers/objectHelper";
import {
  Class,
  ClassMember,
  Invitation,
  User,
  StudentMapping,
  GradePublication,
  Assignment,
} from "../models";
import { sendMail } from "../services/sendGridMail";
import {
  generateInvitationToken,
  generateInviteLink,
} from "../helpers/generatorHelper";

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
      include: {
        model: Class,
        as: "class",
        required: true,
      },
    });
    if (!classMemberInfo) {
      return res.json({
        teaching: [],
        enrolled: [],
      });
    }

    const classMemberInfoDataValues = await Promise.all(
      classMemberInfo.map(async (item) => {
        return {
          ...item.dataValues,
          class: {
            ...item.dataValues.class.dataValues,
            numStudents: await ClassMember.count({
              where: {
                classId: item.dataValues.classId,
                role: "student",
              },
            }),
            numTeachers: await ClassMember.count({
              where: {
                classId: item.dataValues.classId,
                role: "teacher",
              },
            }),
          },
        };
      })
    );
    const classMemberInfoSplit = groupBy(classMemberInfoDataValues, "role");

    const teachingClasses = classMemberInfoSplit.teacher?.map(
      (item) => item.class
    );
    const enrolledClasses = classMemberInfoSplit.student?.map(
      (item) => item.class
    );

    return res.json({
      teaching: teachingClasses || [],
      enrolled: enrolledClasses || [],
    });
  }
};

export const createClass = async (req, res) => {
  const { className, classPicture } = req.body;

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
    token: generateInvitationToken(),
    email: null,
    role: "student",
  });
  if (!createdInvitation) {
    res.status(500);
    throw new Error(ERROR_CREATE_INVITATION);
  }
  const token = createdInvitation.token;
  createdClass.classCode = token;
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

export const joinClassByClassCode = async (req, res) => {
  const { token } = req.body;

  const findClass = await Class.findOne({
    where: {
      classCode: token,
    },
  });
  if (!findClass) {
    res.status(400);
    throw new Error(ERROR_SOMETHING_WENT_WRONG);
  }

  const findMember = await ClassMember.findOne({
    where: {
      classId: findClass.classId,
      memberId: req.user.id,
    },
  });
  if (findMember) {
    res.status(409);
    throw new Error(ERROR_USER_ALREADY_JOINED_CLASS);
  }

  const member = await ClassMember.create({
    classId: findClass.classId,
    memberId: req.user.id,
    role: "student",
  });

  return res.json(member);
};

export const inviteMember = async (req, res) => {
  const { url, emails, role, lang } = req.body;
  const { classId } = req.params;
  const classMember = await ClassMember.findOne({
    where: {
      memberId: req.user.id,
      classId,
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
      classId,
      token: generateInvitationToken(),
      email,
      role,
    }))
  );

  createdInvitations.forEach(async (item) => {
    const inviteLink = generateInviteLink(url, classId, item.token);
    const className = classMember.class.className;

    const mailContent = {
      subject: generateSubject(className, role, lang),
      className,
      avatar: req.user.avatar,
      description: generateDescription(className, role, lang),
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
    res.status(409);
    throw new Error(ERROR_USER_ALREADY_JOINED_CLASS);
  }

  const invitation = await Invitation.findOne({ where: { token } });
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

export const getClassMembers = async (req, res) => {
  const { role } = req.query;
  const { classId } = req.params;

  if (role) {
    const classMembers = await ClassMember.findAll({
      where: {
        classId,
        role,
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

  const classDetails = await Class.findByPk(classId, {
    include: {
      model: GradePublication,
      as: "gradePublications",
      required: false,
      separate: true,
      order: [["createdAt", "DESC"]],
      include: {
        model: Assignment,
        as: "assignment",
        required: true,
      },
    },
  });

  if (!classDetails) {
    res.status(400);
    throw new Error(ERROR_CLASS_NOT_FOUND);
  }

  return res.json(classDetails);
};

export const upsertStudentMapping = async (req, res) => {
  if (!req.files) {
    res.status(400);
    throw new Error(ERROR_INPUT_FILE_NOT_FOUND);
  }
  const { studentMappingFile } = req.files;
  const { classId } = req.params;

  if (!studentMappingFile) {
    res.status(400);
    throw new Error(ERROR_INPUT_FILE_NOT_FOUND);
  }
  const xlsxData = XLSX.read(studentMappingFile.data);
  const jsonData = XLSX.utils.sheet_to_json(xlsxData.Sheets.Sheet1);

  const upsertedStudentMapping = await Promise.all(
    jsonData.map(async (item) => {
      const [studentMapping] = await StudentMapping.upsert({
        classId,
        studentId: isNaN(item.StudentId)
          ? item.StudentId
          : item.StudentId.toString(),
        fullName: item.FullName,
      });

      return studentMapping;
    })
  );
  await Class.update(
    {
      isMapped: true,
    },
    {
      where: {
        classId,
      },
    }
  );

  res.json(upsertedStudentMapping);
};

export const checkClassRole = async (req, res, next) => {
  const { classId } = req.params;
  const classMember = await ClassMember.findOne({
    where: {
      classId,
      memberId: req.user.id,
    },
  });
  const studentMapping = await StudentMapping.findOne({
    where: {
      classId,
      studentId: req.user.studentId,
    },
  });

  if (
    classMember?.role === "teacher" ||
    req.user.role === "admin" ||
    studentMapping
  ) {
    req.classMember = classMember;
    req.studentMapping = studentMapping;
    return next();
  }

  res.status(403);
  throw new Error(ERROR_NOT_AUTHORIZED);
};

export const checkTeacherRole = async (req, res, next) => {
  const { classId } = req.params;
  const member = await ClassMember.findOne({
    where: {
      classId,
      memberId: req.user.id,
    },
  });

  if (member?.role === "teacher") {
    return next();
  }

  res.status(403);
  throw new Error(ERROR_NOT_AUTHORIZED);
};

export const mapStudent = async (req, res) => {
  const { studentId, classId } = req.params;

  // This user has already mapped
  if (req.user.studentId) {
    res.status(400);
    throw new Error(ERROR_USER_ALREADY_MAPPED);
  }

  const studentMapping = await StudentMapping.findOne({
    where: {
      classId,
      studentId,
    },
  });

  if (!studentMapping) {
    res.status(400);
    throw new Error(ERROR_INVALID_MAPPING);
  }

  const studentIdAlreadyMapped = (await User.findOne({
    where: {
      studentId,
    },
  }))
    ? true
    : false;

  if (studentIdAlreadyMapped) {
    res.status(400);
    throw new Error(ERROR_STUDENT_ID_ALREADY_MAPPED);
  }

  await User.update(
    {
      studentId,
    },
    {
      where: {
        id: req.user.id,
      },
    }
  );

  res.json(studentMapping);
};

export const getStudentMappingList = async (req, res) => {
  const { classId } = req.params;

  const studentMapping = await StudentMapping.findAll({
    where: {
      classId,
    },
  });

  return res.json(studentMapping);
};

export const getStudentMapping = async (req, res) => {
  const { classId, studentId } = req.params;

  if (req.classMember.role === "student") {
    return res.json(req.studentMapping);
  }

  const studentMapping = await StudentMapping.findOne({
    where: {
      classId,
      studentId,
    },
  });

  return res.json(studentMapping);
};
