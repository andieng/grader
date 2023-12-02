'use client';

import useSWR from 'swr';
import { Spin } from 'antd';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';

const cx = classnames.bind(styles);

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default function Home() {
  const { data, isLoading } = useSWR('/api/profile', fetcher);

  if (isLoading) return <Spin size="large" />;

  return (
    <div className={cx('wrapper')}>
      <Header user={data.user} />
      <div className={cx('main')}>
        <h1 className={cx('welcome')}>Welcome to Grader!</h1>
        <h3 className={cx('description')}>Explore our products and services to discover the possibilities.</h3>
      </div>
    </div>
  );
}
