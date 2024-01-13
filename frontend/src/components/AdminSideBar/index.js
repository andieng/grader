'use client';

import { useMemo, useCallback } from 'react';
import { Menu } from 'antd';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/AdminSideBar.module.scss';
import { AppstoreOutlined, IdcardOutlined, TeamOutlined } from '@ant-design/icons';

const cx = classnames.bind(styles);

const AdminSideBar = ({ lang, handleClick }) => {
  const d = useMemo(() => {
    return getDictionary(lang, 'components/AdminSideBar');
  }, [lang]);

  const items = [
    {
      label: d.dashboard,
      key: 1,
      icon: <AppstoreOutlined />,
    },
    {
      label: d.classes,
      key: 2,
      icon: <TeamOutlined />,
    },
    {
      label: d.accounts,
      key: 3,
      icon: <IdcardOutlined />,
    },
  ];

  return (
    <Menu
      className={cx('menu')}
      mode="inline"
      items={items}
      defaultSelectedKeys={[1]}
      onClick={handleClick}
    />
  );
};

export default AdminSideBar;
