'use client';

import { useMemo } from 'react';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/components/StudentList.module.scss';

const cx = classnames.bind(styles);

const StudentList = ({ lang, students, role, totalGradeColumns }) => {
  const d = useMemo(() => {
    return getDictionary(lang, 'components/StudentList');
  }, [lang]);

  return (
    <div className={cx('wrap')}>
      <div className={cx('grade-information')}>
        <p>
          {d.totalGradeColumns}: {totalGradeColumns}
        </p>
        <p>
          {d.totalStudents}: {students.length}
        </p>
      </div>
      <div className={cx('grades')}>
        {role === 'teacher' && <div className={cx('grades-avg')}>{d.classAverage}</div>}
        {role === 'student' && <hr />}
        {students?.map((student) => {
          return (
            <div
              key={student.studentId}
              className={cx('grade-row')}
            >
              <p>{student.studentId}</p>
              <p>{student.fullName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentList;
