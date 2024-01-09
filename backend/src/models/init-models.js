import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Assignment from  "./Assignment.js";
import _ClassMember from  "./ClassMember.js";
import _Class from  "./Class.js";
import _GradePublication from  "./GradePublication.js";
import _GradeReviewComment from  "./GradeReviewComment.js";
import _GradeReview from  "./GradeReview.js";
import _Grade from  "./Grade.js";
import _Invitation from  "./Invitation.js";
import _StudentMapping from  "./StudentMapping.js";
import _User from  "./User.js";

export default function initModels(sequelize) {
  const Assignment = _Assignment.init(sequelize, DataTypes);
  const ClassMember = _ClassMember.init(sequelize, DataTypes);
  const Class = _Class.init(sequelize, DataTypes);
  const GradePublication = _GradePublication.init(sequelize, DataTypes);
  const GradeReviewComment = _GradeReviewComment.init(sequelize, DataTypes);
  const GradeReview = _GradeReview.init(sequelize, DataTypes);
  const Grade = _Grade.init(sequelize, DataTypes);
  const Invitation = _Invitation.init(sequelize, DataTypes);
  const StudentMapping = _StudentMapping.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);

  Class.belongsToMany(User, { as: 'memberIdUsers', through: ClassMember, foreignKey: "classId", otherKey: "memberId" });
  User.belongsToMany(Class, { as: 'classIdClasses', through: ClassMember, foreignKey: "memberId", otherKey: "classId" });
  GradeReview.belongsTo(Assignment, { as: "assignment", foreignKey: "assignmentId"});
  Assignment.hasMany(GradeReview, { as: "gradeReviews", foreignKey: "assignmentId"});
  Grade.belongsTo(Assignment, { as: "assignment", foreignKey: "assignmentId"});
  Assignment.hasMany(Grade, { as: "grades", foreignKey: "assignmentId"});
  Assignment.belongsTo(Class, { as: "class", foreignKey: "classId"});
  Class.hasMany(Assignment, { as: "assignments", foreignKey: "classId"});
  ClassMember.belongsTo(Class, { as: "class", foreignKey: "classId"});
  Class.hasMany(ClassMember, { as: "classMembers", foreignKey: "classId"});
  GradePublication.belongsTo(Class, { as: "class", foreignKey: "classId"});
  Class.hasMany(GradePublication, { as: "gradePublications", foreignKey: "classId"});
  GradeReview.belongsTo(Class, { as: "class", foreignKey: "classId"});
  Class.hasMany(GradeReview, { as: "gradeReviews", foreignKey: "classId"});
  Grade.belongsTo(Class, { as: "class", foreignKey: "classId"});
  Class.hasMany(Grade, { as: "grades", foreignKey: "classId"});
  Invitation.belongsTo(Class, { as: "class", foreignKey: "classId"});
  Class.hasMany(Invitation, { as: "invitations", foreignKey: "classId"});
  StudentMapping.belongsTo(Class, { as: "class", foreignKey: "classId"});
  Class.hasMany(StudentMapping, { as: "studentMappings", foreignKey: "classId"});
  GradeReviewComment.belongsTo(GradeReview, { as: "gradeReview", foreignKey: "gradeReviewId"});
  GradeReview.hasMany(GradeReviewComment, { as: "gradeReviewComments", foreignKey: "gradeReviewId"});
  ClassMember.belongsTo(User, { as: "member", foreignKey: "memberId"});
  User.hasMany(ClassMember, { as: "classMembers", foreignKey: "memberId"});
  GradePublication.belongsTo(User, { as: "teacherUser", foreignKey: "teacherUserId"});
  User.hasMany(GradePublication, { as: "gradePublications", foreignKey: "teacherUserId"});
  GradeReviewComment.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(GradeReviewComment, { as: "gradeReviewComments", foreignKey: "userId"});
  GradeReview.belongsTo(User, { as: "studentUser", foreignKey: "studentUserId"});
  User.hasMany(GradeReview, { as: "gradeReviews", foreignKey: "studentUserId"});

  return {
    Assignment,
    ClassMember,
    Class,
    GradePublication,
    GradeReviewComment,
    GradeReview,
    Grade,
    Invitation,
    StudentMapping,
    User,
  };
}
