'use client';

import TeacherGradeTab from '@/components/GradeTab/TeacherGradeTab';
import StudentGradeTab from '@/components/GradeTab/StudentGradeTab';

const GradeTab = ({ lang, classId, member }) => {
  return member.role === 'teacher' ? (
    <TeacherGradeTab
      lang={lang}
      classId={classId}
    />
  ) : (
    <StudentGradeTab
      lang={lang}
      classId={classId}
      member={member}
    />
  );
};

export default GradeTab;
