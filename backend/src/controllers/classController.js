import XLSX from "xlsx";
import {
  ERROR_CLASS_MEMBER_NOT_FOUND,
  ERROR_CLASS_NOT_FOUND,
  ERROR_CREATE_ASSIGNMENT,
  ERROR_CREATE_CLASS,
  ERROR_CREATE_CLASS_MEMBER,
  ERROR_CREATE_INVITATION,
  ERROR_INPUT_FILE_NOT_FOUND,
  ERROR_INPUT_DATA_NOT_FOUND,
  ERROR_INVALID_INVITATION,
  MSG_INVITE_SUCCESSFULLY,
  ERROR_MAPPING_NOT_FOUND,
  ERROR_STUDENT_ID_ALREADY_MAPPED,
  ERROR_USER_ALREADY_MAPPED,
  ERROR_USER_ALREADY_JOINED_CLASS,
  ERROR_SOMETHING_WENT_WRONG,
} from "../constants";
import {
  generateSubject,
  generateButtonContent,
  generateDescription,
  generateMessage,
} from "../helpers/invitationMailHelper";
import { groupBy } from "../helpers/objectHelper";
import {
  Assignment,
  Class,
  ClassMember,
  Grade,
  Invitation,
  User,
  StudentMapping,
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
      name: req.user.name,
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

  const classDetails = await Class.findByPk(classId);

  if (!classDetails) {
    res.status(400);
    throw new Error(ERROR_CLASS_NOT_FOUND);
  }

  return res.json(classDetails);
};

export const getAssignments = async (req, res) => {
  const { classId } = req.params;

  const assignments = await Assignment.findAll({
    where: {
      classId,
    },
  });

  return res.json(assignments);
};

export const addAssignment = async (req, res) => {
  const { assignmentName, assignmentGradeScale } = req.body;
  const { classId } = req.params;

  const createdAssignment = await Assignment.create({
    classId,
    assignmentName,
    assignmentGradeScale,
    viewerRole: "teacher",
  });

  if (!createdAssignment) {
    res.status(500);
    throw new Error(ERROR_CREATE_ASSIGNMENT);
  }

  return res.json(createdAssignment);
};

export const upsertGradesByJson = async (req, res) => {
  const { grades } = req.body;
  const { assignmentId } = req.params;

  if (!grades) {
    res.status(400);
    throw new Error(ERROR_INPUT_DATA_NOT_FOUND);
  }

  const upsertedGrades = await Promise.all(
    grades.map(async (gradeItem) => {
      const [grade] = await Grade.upsert({
        assignmentId,
        studentId: isNaN(gradeItem.StudentId)
          ? gradeItem.StudentId
          : gradeItem.StudentId.toString(),
        gradeValue: gradeItem.Grade,
      });

      return grade;
    })
  );

  res.json(upsertedGrades);
};

export const upsertGradesByFile = async (req, res) => {
  const { assignmentGradeFile } = req.files;
  const { assignmentId } = req.params;

  if (!assignmentGradeFile) {
    res.status(400);
    throw new Error(ERROR_INPUT_FILE_NOT_FOUND);
  }
  const xlsxData = XLSX.read(assignmentGradeFile.data);
  const jsonData = XLSX.utils.sheet_to_json(xlsxData.Sheets.Sheet1);

  const upsertedGrades = await Promise.all(
    jsonData.map(async (gradeItem) => {
      const [grade] = await Grade.upsert({
        assignmentId,
        studentId: isNaN(gradeItem.StudentId)
          ? gradeItem.StudentId
          : gradeItem.StudentId.toString(),
        gradeValue: gradeItem.Grade,
      });

      return grade;
    })
  );

  res.json(upsertedGrades);
};

export const upsertStudentMapping = async (req, res) => {
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

  res.json(upsertedStudentMapping);
};

export const mapStudent = async (req, res) => {
  const { classId, studentId } = req.params;

  const userAlreadyMapped = await StudentMapping.findOne({
    where: {
      userId: req.user.id,
    },
  });

  if (userAlreadyMapped) {
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
    throw new Error(ERROR_MAPPING_NOT_FOUND);
  }

  if (studentMapping.userId) {
    res.status(400);
    throw new Error(ERROR_STUDENT_ID_ALREADY_MAPPED);
  }

  studentMapping.userId = req.user.id;
  await studentMapping.save();

  res.json(studentMapping);
};
