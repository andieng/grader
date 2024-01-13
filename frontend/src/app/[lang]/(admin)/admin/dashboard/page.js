'use client';

import useSWR from 'swr';
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import getDictionary from '@/utils/language';
import { Spin } from 'antd';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import classnames from 'classnames/bind';
import AdminSideBar from '@/components/AdminSideBar';
import Header from '@/components/Header';
import styles from '@/styles/pages/AdminDashboard.module.scss';

const cx = classnames.bind(styles);

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(
  function AdminDashboard({ params: { lang } }) {
    const { data, isLoading, error } = useSWR('/api/admin/profile', fetcher);
    let selectedMenuItem = 1;

    const handleClickMenuItem = (key) => {
      selectedMenuItem = key;
    };

    if (isLoading) return <Spin size="large" />;
    if (error) return <div>{error?.message}</div>;

    return (
      <div>
        <Header
          user={data.user}
          lang={lang}
        />
        <div className={cx('container')}>
          <AdminSideBar
            lang={lang}
            isInDashboard={true}
            handleClick={handleClickMenuItem}
          />
          <div className={cx('content')}>{selectedMenuItem}</div>
        </div>
      </div>
    );
  },
  {
    returnTo: '/admin/dashboard',
  },
);
