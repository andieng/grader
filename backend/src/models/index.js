import pg from "pg";
import { Sequelize, DataTypes } from "sequelize";
import _Assignment from "./Assignment.js";
import _ClassMember from "./ClassMember.js";
import _Class from "./Class.js";
import _GradePublication from "./GradePublication.js";
import _GradeReviewComment from "./GradeReviewComment.js";
import _GradeReview from "./GradeReview.js";
import _Grade from "./Grade.js";
import _User from "./User.js";
import _StudentMapping from "./StudentMapping.js";
import _Invitation from "./Invitation.js";

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
  Assignment.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(Assignment, { as: "assignments", foreignKey: "classId" });
  ClassMember.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(ClassMember, { as: "classMembers", foreignKey: "classId" });
  GradePublication.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(GradePublication, {
    as: "gradePublications",
    foreignKey: "classId",
  });
  Invitation.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(Invitation, { as: "invitations", foreignKey: "classId" });
  StudentMapping.belongsTo(Class, { as: "class", foreignKey: "classId" });
  Class.hasMany(StudentMapping, {
    as: "studentMappings",
    foreignKey: "classId",
  });
  GradeReview.belongsTo(GradePublication, {
    as: "gradePublication",
    foreignKey: "gradePublicationId",
  });
  GradePublication.hasMany(GradeReview, {
    as: "gradeReviews",
    foreignKey: "gradePublicationId",
  });
  GradeReviewComment.belongsTo(GradeReview, {
    as: "gradeReviewComment",
    foreignKey: "gradeReviewCommentId",
  });
  GradeReview.hasOne(GradeReviewComment, {
    as: "gradeReviewComment",
    foreignKey: "gradeReviewCommentId",
  });
  ClassMember.belongsTo(User, { as: "member", foreignKey: "memberId" });
  User.hasMany(ClassMember, { as: "classMembers", foreignKey: "memberId" });
  GradePublication.belongsTo(User, {
    as: "publisher",
    foreignKey: "publisherId",
  });
  User.hasMany(GradePublication, {
    as: "gradePublications",
    foreignKey: "publisherId",
  });
  GradeReviewComment.belongsTo(User, { as: "user", foreignKey: "userId" });
  User.hasMany(GradeReviewComment, {
    as: "gradeReviewComments",
    foreignKey: "userId",
  });
  GradeReview.belongsTo(User, { as: "student", foreignKey: "studentId" });
  User.hasMany(GradeReview, { as: "gradeReviews", foreignKey: "studentId" });
  GradeReview.belongsTo(User, { as: "teacher", foreignKey: "teacherId" });
  User.hasMany(GradeReview, {
    as: "teacherGradeReviews",
    foreignKey: "teacherId",
  });
  StudentMapping.belongsTo(User, { as: "user", foreignKey: "userId" });
  User.hasMany(StudentMapping, { as: "studentMappings", foreignKey: "userId" });

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
