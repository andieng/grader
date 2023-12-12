'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import getDictionary from '@/utils/language';
import { Spin, Card } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/pages/Dashboard.module.scss';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const cx = classnames.bind(styles);

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

const DUMMY_CLASSES = ['ClassA', 'ClassB', 'ClassC', 'ClassD', 'ClassE', 'ClassF', 'ClassG'];

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
        <div className={cx('main')}>
          {DUMMY_CLASSES.map((title, index) => (
            <Card
              key={index}
              className={cx('card')}
              title={title}
              bodyStyle={{ backgroundColor: 'white', height: '180px' }}
            >
              {/* Nội dung của card */}
            </Card>
          ))}
        </div>
      </div>
    );
  },
  {
    returnTo: '/dashboard',
  },
);
