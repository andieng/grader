'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import getDictionary from '@/utils/language';
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
  function Dashboard({ params: { lang } }) {
    const d = useMemo(() => {
      return getDictionary(lang, 'pages/Dashboard');
    }, [lang]);

    const { data, isLoading, error } = useSWR('/api/user/profile', fetcher);

    if (isLoading || d === null) return <Spin size="large" />;
    if (error) return <div>{error.message}</div>;

    return (
      <div className={cx('wrapper')}>
        <Header
          user={data?.user}
          lang={lang}
        />
        <div className={cx('main')}>
          <h1 className={cx('title')}>{d.dashboard}</h1>
        </div>
      </div>
    );
  },
  {
    returnTo: '/dashboard',
  },
);
