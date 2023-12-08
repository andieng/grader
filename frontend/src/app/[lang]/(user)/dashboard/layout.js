'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { AppstoreOutlined, TeamOutlined, ContactsOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import Header from '@/components/Header';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/layouts/Dashboard.module.scss';

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

export default function DashboardLayout({ children, params: { lang } }) {
  const sidebarClickHandler = (e) => {
    console.log('click ', e);
  };

  const d = useMemo(() => {
    return getDictionary(lang, 'components/SideBar');
  }, [lang]);

  const items = [
    {
      label: <a className={cx('user-item')}>{d.dashboard}</a>,
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

  const { data, isLoading, error } = useSWR('/api/profile', fetcher);

  if (isLoading || d === null) return <Spin size="large" />;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Header
        user={data.user}
        lang={lang}
      />
      <div className={cx('container')}>
        <div>
          <Menu
            className={cx('menu')}
            onClick={sidebarClickHandler}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
        </div>
        {children}
      </div>
    </>
  );
}
