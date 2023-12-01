'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import useSWR from 'swr';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner';
import styles from '@/styles/pages/Dashboard.module.scss';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Error from '@/app/error/page';
import { ERROR_NOT_VERIFIED } from '@/constants/messages';
import Link from 'next/link';

const cx = classnames.bind(styles);

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(
  function Dashboard() {
    const router = useRouter();
    // const { user, error, isLoading } = useUser();
    const { data, isLoading, error } = useSWR('/api/profile', fetcher);

    if (isLoading) return <Spinner />;
    if (error) return <div>{error.message}</div>;

    console.log(data);

    if (!data.user?.email_verified) {
      return (
        <Result
          status="403"
          title="403"
          subTitle={ERROR_NOT_VERIFIED}
          extra={
            <Link href='/'>
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      );
    }

    return (
      <div className={cx('wrapper')}>
        <Header user={data.user} />
      </div>
    );

    // return <Spinner />;
  },
  { returnTo: '/dashboard' },
);
