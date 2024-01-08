'use client';

import useSWR from 'swr';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/GradeTab.module.scss';
import ClassMenu from '@/components/ClassMenu';

const cx = classnames.bind(styles);

const GradeTab = ({ lang, classId }) => {
  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}></div>
    </div>
  );
};

export default GradeTab;
