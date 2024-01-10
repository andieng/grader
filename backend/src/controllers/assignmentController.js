import { ERROR_CREATE_ASSIGNMENT } from "../constants";
import { Assignment, GradePublication, GradeReviewComment } from "../models";
import { Op } from "sequelize";

export const getAssignmentList = async (req, res) => {
  const { classId } = req.params;

  const assignments = await Assignment.findAll({
    where: {
      classId,
    },
    order: [["line_number", "ASC"]],
  });

  return res.json(assignments);
};

export const updateAssignmentList = async (req, res) => {
  const { assignments: assignmentList } = req.body;

  let updatedAssignmentList = [];
  for (const assignment of assignmentList) {
    const updatedAssignment = await Assignment.update(assignment, {
      where: {
        assignmentId: assignment.assignmentId,
      },
    });
    updatedAssignmentList.push(updatedAssignment);
  }

  return res.json(updatedAssignmentList);
};

export const addAssignment = async (req, res) => {
  const { assignmentName, assignmentGradeScale } = req.body;
  const { classId } = req.params;

  const maxLineNumber = await Assignment.max("line_number");
  const createdAssignment = await Assignment.create({
    classId,
    assignmentName,
    assignmentGradeScale,
    viewerRole: "teacher",
    isPublished: false,
    lineNumber: maxLineNumber + 1,
  });

  if (!createdAssignment) {
    res.status(500);
    throw new Error(ERROR_CREATE_ASSIGNMENT);
  }

  return res.json(createdAssignment);
};

export const updateAssignment = async (req, res) => {
  const { assignmentName, assignmentGradeScale, isPublished } = req.body;
  const { assignment } = req;

  // Publish assignment / mark assignment as finalized
  if (isPublished && !assignment.isPublished) {
    await GradePublication.create({
      assignmentId: assignment.assignmentId,
      classId: assignment.classId,
      teacherUserId: req.user.id,
    });
  }

  await assignment.update({
    assignmentName,
    assignmentGradeScale,
    isPublished,
  });

  return res.json(assignment);
};

export const deleteAssignment = async (req, res) => {
  const { assignment } = req;
  const assignmentId = assignment.assignmentId;

  // Delete
  await GradeReviewComment.destroy({
    where: {
      assignmentId,
    },
  });
  const assignmentList = await Assignment.findAll({
    where: {
      lineNumber: {
        [Op.gt]: assignment.lineNumber,
      },
    },
  });
  await assignment.destroy();
  for (item of assignmentList) {
    item.lineNumber--;
    await item.save();
  }
  return res.status(204).end();
};
