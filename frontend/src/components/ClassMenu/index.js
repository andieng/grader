'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'antd';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/components/ClassMenu.module.scss';

const cx = classnames.bind(styles);

const ClassMenu = ({ children, lang }) => {
  const [current, setCurrent] = useState('detail');

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const pathname = usePathname();

  let redirectLocale = '';
  let parts = pathname.split('/');
  let classId = parts[parts.length - 1];

  if (pathname.includes('/en')) redirectLocale = '/en';
  else redirectLocale = '/vi';

  const topBarClickHandler = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      label: <Link href={`${redirectLocale}/d/${classId}`}>{d.details}</Link>,
      key: 'details',
    },
    {
      label: <Link href={`${redirectLocale}/p/${classId}`}>{d.people}</Link>,
      key: 'people',
    },
    {
      label: <Link href={`${redirectLocale}/g/${classId}`}>{d.grades}</Link>,
      key: 'grades',
    },
    {
      label: <Link href={`${redirectLocale}/r/${classId}`}>{d.review}</Link>,
      key: 'review',
    },
  ];

  if (pathname.includes('/p/') && current !== 'people') setCurrent('people');
  else if (pathname.includes('/g/') && current !== 'grades') setCurrent('grades');
  else if (pathname.includes('/d/') && current !== 'details') setCurrent('details');
  else if (pathname.includes('/r/') && current !== 'review') setCurrent('review');

  return (
    <div className={cx('container')}>
      <Menu
        className={cx('menu')}
        onClick={topBarClickHandler}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      {children}
    </div>
  );
};

export default ClassMenu;
