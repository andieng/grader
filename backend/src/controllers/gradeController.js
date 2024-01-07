import XLSX from "xlsx";
import {
  ERROR_INPUT_FILE_NOT_FOUND,
  ERROR_INPUT_DATA_NOT_FOUND,
  ERROR_ASSIGNMENT_NOT_FOUND,
} from "../constants";

import { Assignment, Grade } from "../models";

export const getClassGrades = async (req, res) => {
  const { classId } = req.params;
  const grades = await Grade.findAll({
    where: {
      classId,
    },
  });
  return res.json(grades);
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
