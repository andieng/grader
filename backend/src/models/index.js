import pg from "pg";
import { Sequelize, DataTypes } from "sequelize";
import _Assignment from "./Assignment";
import _ClassMember from "./ClassMember";
import _Class from "./Class";
import _GradePublication from "./GradePublication";
import _GradeReviewComment from "./GradeReviewComment";
import _GradeReview from "./GradeReview";
import _Grade from "./Grade";
import _Invitation from "./Invitation";
import _StudentMapping from "./StudentMapping";
import _User from "./User";

function initModels(sequelize) {
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

  Class.belongsToMany(User, {
    as: "memberIdUsers",
    through: ClassMember,
    foreignKey: "classId",
    otherKey: "memberId",
  });
  User.belongsToMany(Class, {
    as: "classIdClasses",
    through: ClassMember,
    foreignKey: "memberId",
    otherKey: "classId",
  });
  GradeReview.belongsTo(Assignment, {
    as: "assignment",
    foreignKey: "assignmentId",
  });
  Assignment.hasMany(GradeReview, {
    as: "gradeReviews",
    foreignKey: "assignmentId",
  });
  Grade.belongsTo(Assignment, { as: "assignment", foreignKey: "assignmentId" });
  Assignment.hasMany(Grade, { as: "grades", foreignKey: "assignmentId" });
  Assignment.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(Assignment, { as: "assignments", foreignKey: "classId" });
  ClassMember.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(ClassMember, { as: "classMembers", foreignKey: "classId" });
  GradePublication.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(GradePublication, {
    as: "gradePublications",
    foreignKey: "classId",
  });
  GradeReview.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(GradeReview, { as: "gradeReviews", foreignKey: "classId" });
  Grade.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(Grade, { as: "grades", foreignKey: "classId" });
  Invitation.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(Invitation, { as: "invitations", foreignKey: "classId" });
  StudentMapping.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(StudentMapping, {
    as: "studentMappings",
    foreignKey: "classId",
  });
  GradeReviewComment.belongsTo(GradeReview, {
    as: "gradeReview",
    foreignKey: "gradeReviewId",
  });
  GradeReview.hasMany(GradeReviewComment, {
    as: "gradeReviewComments",
    foreignKey: "gradeReviewId",
  });
  ClassMember.belongsTo(User, { as: "member", foreignKey: "memberId" });
  User.hasMany(ClassMember, { as: "classMembers", foreignKey: "memberId" });
  GradePublication.belongsTo(User, {
    as: "teacherUser",
    foreignKey: "teacherUserId",
  });
  User.hasMany(GradePublication, {
    as: "gradePublications",
    foreignKey: "teacherUserId",
  });
  GradeReviewComment.belongsTo(User, { as: "user", foreignKey: "userId" });
  User.hasMany(GradeReviewComment, {
    as: "gradeReviewComments",
    foreignKey: "userId",
  });
  GradeReview.belongsTo(User, {
    as: "studentUser",
    foreignKey: "studentUserId",
  });
  User.hasMany(GradeReview, {
    as: "gradeReviews",
    foreignKey: "studentUserId",
  });
  StudentMapping.belongsTo(User, { as: "user", foreignKey: "userId" });
  User.hasOne(StudentMapping, { as: "studentMapping", foreignKey: "userId" });

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

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sequelize = new Sequelize({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  dialectModule: pg,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Sequelize connected");
  })
  .catch((err) => {
    throw err;
  });

export const {
  User,
  Class,
  ClassMember,
  Grade,
  GradePublication,
  GradeReview,
  GradeReviewComment,
  Invitation,
  Assignment,
  StudentMapping,
} = initModels(sequelize);

export default sequelize;
