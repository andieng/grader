'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { getDictionary } from '../../../../utils/language';
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
    const [dictionary, setDictionary] = useState(null);

    useEffect(() => {
      const fetchDictionary = async () => {
        const dict = await getDictionary(lang);
        dict.locale = lang;
        setDictionary(dict);
      };

      fetchDictionary();
    }, [lang]);

    const { data, isLoading, error } = useSWR('/api/profile', fetcher);

    if (isLoading || dictionary === null) return <Spin size="large" />;
    if (error) return <div>{error.message}</div>;

    return (
      <div className={cx('wrapper')}>
        <Header
          user={data?.user}
          dictionary={dictionary.components.header}
          locale={dictionary.locale}
        />{' '}
        <div className={cx('main')}>
          <h1 className={cx('title')}>{dictionary.pages.dashboard.dashboard}</h1>
        </div>
      </div>
    );
  },
  {
    returnTo: '/dashboard',
  },
);
