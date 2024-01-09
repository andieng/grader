'use client';

import classnames from 'classnames/bind';
import styles from '@/styles/components/ReviewTab.module.scss';
import ClassMenu from '../ClassMenu';

const cx = classnames.bind(styles);

const ReviewTab = ({ lang, classId }) => {
  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}></div>
    </div>
  );
};

export default ReviewTab;
