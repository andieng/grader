import XLSX from "xlsx";
import {
  ERROR_INPUT_FILE_NOT_FOUND,
  ERROR_INPUT_DATA_NOT_FOUND,
  ERROR_ASSIGNMENT_NOT_FOUND,
  ERROR_NOT_AUTHORIZED,
} from "../constants";

import { Assignment, ClassMember, Grade, StudentMapping } from "../models";

export const getClassGrades = async (req, res) => {
  const { classId } = req.params;

  if (req.user.role === "admin") {
    const classMemberRole = "admin";
    const assignmentGrades = await Assignment.findAll({
      attributes: [
        ["assignment_id", "assignmentId"],
        ["assignment_name", "assignmentName"],
        ["assignment_grade_scale", "assignmentGradeScale"],
        ["line_number", "lineNumber"],
        ["is_published", "isPublished"],
        ["class_id", "classId"],
        ["created_at", "createdAt"],
      ],
      where: {
        classId,
      },
      include: {
        model: Grade,
        as: "grades",
        attributes: [
          ["student_id", "studentId"],
          ["grade_value", "gradeValue"],
        ],
        required: false,
        separate: true,
        order: [["studentId", "ASC"]],
      },
      order: [["lineNumber", "ASC"]],
    });

    return res.json({
      classMemberRole,
      mapped: null,
      assignmentGrades,
    });
  }

  const member = await ClassMember.findOne({
    where: {
      classId,
      memberId: req.user.id,
    },
  });
  if (!member) {
    res.status(403);
    throw new Error(ERROR_NOT_AUTHORIZED);
  }

  if (member?.role === "teacher") {
    const classMemberRole = member.role;
    const assignmentGrades = await Assignment.findAll({
      attributes: [
        ["assignment_id", "assignmentId"],
        ["assignment_name", "assignmentName"],
        ["assignment_grade_scale", "assignmentGradeScale"],
        ["line_number", "lineNumber"],
        ["is_published", "isPublished"],
        ["class_id", "classId"],
        ["created_at", "createdAt"],
      ],
      where: {
        classId,
      },
      include: {
        model: Grade,
        as: "grades",
        attributes: [
          ["student_id", "studentId"],
          ["grade_value", "gradeValue"],
        ],
        required: false,
        separate: true,
        order: [["studentId", "ASC"]],
      },
      order: [["lineNumber", "ASC"]],
    });

    return res.json({
      classMemberRole,
      mapped: null,
      assignmentGrades,
    });
  }

  const studentMapping = await StudentMapping.findOne({
    where: {
      classId,
      studentId: req.user.studentId,
    },
  });

  if (member.role === "student") {
    if (studentMapping) {
      const classMemberRole = member.role;
      const assignmentGrades = await Assignment.findAll({
        attributes: [
          ["assignment_id", "assignmentId"],
          ["assignment_name", "assignmentName"],
          ["assignment_grade_scale", "assignmentGradeScale"],
          ["line_number", "lineNumber"],
          ["is_published", "isPublished"],
          ["class_id", "classId"],
          ["created_at", "createdAt"],
        ],
        where: {
          classId,
          studentId: studentMapping.studentId,
        },
        include: {
          model: Grade,
          as: "grades",
          attributes: [
            ["student_id", "studentId"],
            ["grade_value", "gradeValue"],
          ],
          required: false,
          separate: true,
          order: [["studentId", "ASC"]],
        },
        order: [["lineNumber", "ASC"]],
      });

      return res.json({
        classMemberRole,
        mapped: true,
        assignmentGrades,
      });
    } else {
      return res.json({
        classMemberRole: member.role,
        mapped: false,
        assignmentGrades: [],
      });
    }
  }

  res.status(403);
  throw new Error(ERROR_NOT_AUTHORIZED);
};

export const upsertGradesByJson = async (req, res) => {
  const { assignmentId, grades } = req.body;
  const { classId } = req.params;

  if (!grades || !assignmentId) {
    res.status(400);
    throw new Error(ERROR_INPUT_DATA_NOT_FOUND);
  }
  if (!(await Assignment.findByPk(assignmentId))) {
    res.status(400);
    throw new Error(ERROR_ASSIGNMENT_NOT_FOUND);
  }

  const upsertedGrades = await Promise.all(
    grades.map(async (gradeItem) => {
      const [grade] = await Grade.upsert({
        assignmentId,
        classId,
        studentId: gradeItem.studentId,
        gradeValue: gradeItem.gradeValue,
      });

      return grade;
    })
  );

  res.json(upsertedGrades);
};

export const upsertGradesByFile = async (req, res) => {
  if (!req.files) {
    res.status(400);
    throw new Error(ERROR_INPUT_FILE_NOT_FOUND);
  }
  const { assignmentGradeFile } = req.files;
  const { assignmentId } = req.body;
  const { classId } = req.params;

  if (!assignmentGradeFile) {
    res.status(400);
    throw new Error(ERROR_INPUT_FILE_NOT_FOUND);
  }
  if (!assignmentId) {
    res.status(400);
    throw new Error(ERROR_INPUT_DATA_NOT_FOUND);
  }
  if (!(await Assignment.findByPk(assignmentId))) {
    res.status(400);
    throw new Error(ERROR_ASSIGNMENT_NOT_FOUND);
  }

  const xlsxData = XLSX.read(assignmentGradeFile.data);
  const jsonData = XLSX.utils.sheet_to_json(xlsxData.Sheets.Sheet1);

  const upsertedGrades = await Promise.all(
    jsonData.map(async (gradeItem) => {
      const [grade] = await Grade.upsert({
        assignmentId,
        classId,
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
