'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Spin } from 'antd';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';

const cx = classnames.bind(styles);

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Spin size="large" />;
  if (error) return <div>{error.message}</div>;

  return (
    <div className={cx('wrapper')}>
      <Header user={user} />
      <div className={cx('main')}>
        <h1 className={cx('welcome')}>Welcome to Grader!</h1>
        <h3 className={cx('description')}>Explore our products and services to discover the possibilities.</h3>
      </div>
    </div>
  );
}
