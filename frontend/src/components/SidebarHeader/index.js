'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppstoreOutlined, TeamOutlined, ContactsOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import Header from '@/components/Header';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/SideMenu.module.scss';
import Link from 'next/link';
import chalk from 'chalk';

const cx = classnames.bind(styles);

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

function transformData(data) {
  let keyCounter = 1;
  let transformedData = {};
  Object.keys(data).forEach((key) => {
    transformedData[key] = data[key].map((item) => getItem(item, (keyCounter++).toString()));
  });
  return transformedData;
}

const dummyDataFromServer = {
  teaching: ['classA', 'classB'],
  enrolled: ['classC', 'classD', 'classE', 'classC', 'classD', 'classE', 'classC', 'classD', 'classE'],
};

const afterTransforming = transformData(dummyDataFromServer);

const SidebarHeader = ({ children, lang, isInDashboard }) => {
  const pathname = usePathname();
  const router = useRouter();

  let redirectLocale = '';

  if (pathname.includes('/en')) redirectLocale = '/en';
  else redirectLocale = '/vi';

  const sidebarClickHandler = (event) => {
    console.log('click ', event);
    if (event.key != 0) router.push(`${redirectLocale}/d/aDummyClassId`);
  };

  const d = useMemo(() => {
    return getDictionary(lang, 'components/SideBar');
  }, [lang]);

  const items = [
    {
      label: (
        <Link href={`${redirectLocale}/dashboard`}>
          <p className={cx('user-item')}>{d.dashboard}</p>
        </Link>
      ),
      key: '0',
      icon: <AppstoreOutlined />,
    },
    {
      type: 'divider',
    },
    getItem(`${d.teaching}`, 'sub1', <TeamOutlined />, afterTransforming.teaching),
    {
      type: 'divider',
    },
    getItem(`${d.enrolled}`, 'sub2', <ContactsOutlined />, afterTransforming.enrolled),
  ];

  const { data, isLoading, error } = useSWR('/api/user/profile', fetcher);

  if (isLoading || d === null) return <Spin size="large" />;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Header
        user={data.user}
        lang={lang}
        isInDashboard={isInDashboard}
      />
      <div className={cx('container')}>
        <div>
          <Menu
            className={cx('menu')}
            onClick={sidebarClickHandler}
            defaultSelectedKeys={['0']}
            mode="inline"
            items={items}
          />
        </div>
        {children}
      </div>
    </>
  );
};

export default SidebarHeader;
