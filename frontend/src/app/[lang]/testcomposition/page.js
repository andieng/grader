'use client';

import { useState } from 'react';
import GradeComposition from '@/components/GradeComposition';

const DUMMY_GRADE_INFO = {
  gradeId: 'classId-gradeId',
  name: 'Mid Term For Students',
  createdDate: '25/12/2023',
  scale: 25,
};

export default function ClassDetails({ params: { lang } }) {
  const [students, setStudents] = useState([
    { studentId: '1', grade: 80 },
    { studentId: '2', grade: 70 },
    { studentId: '3', grade: 67 },
    { studentId: '4', grade: 90 },
    { studentId: '5', grade: 89 },
    { studentId: '6', grade: 72 },
    { studentId: '7', grade: 50 },
    { studentId: '8', grade: 65 },
    { studentId: '9', grade: 90 },
    { studentId: '10', grade: 71 },
  ]);

  return (
    <GradeComposition
      students={students}
      setStudents={setStudents}
      gradeCompostionInfo={DUMMY_GRADE_INFO}
      lang={lang}
    />
  );
}
