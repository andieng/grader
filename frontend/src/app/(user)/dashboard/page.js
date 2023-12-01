'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner';
import styles from '@/styles/pages/Dashboard.module.scss';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

const cx = classnames.bind(styles);

export default withPageAuthRequired(
  async function Dashboard() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <Spinner />;
    if (error) return <div>{error.message}</div>;
    console.log(user, isLoading, error);

    return (
      <div className={cx('wrapper')}>
        <Header user={user} />
      </div>
    );
  },
  { returnTo: '/dashboard' },
);
