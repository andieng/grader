'use client';

import useSWR from 'swr';
import { Spin } from 'antd';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Dashboard.module.scss';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const cx = classnames.bind(styles);

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(
  function Dashboard() {
    const { data, isLoading, error } = useSWR('/api/profile', fetcher);

    if (isLoading) return <Spin size="large" />;
    if (error) return <div>{error.message}</div>;

    return (
      <div className={cx('wrapper')}>
        <Header user={data.user} />
        <div className={cx('main')}>
          <h1 className={cx('title')}>Dashboard</h1>
        </div>
      </div>
    );
  },
  {
    returnTo: '/dashboard',
  },
);
