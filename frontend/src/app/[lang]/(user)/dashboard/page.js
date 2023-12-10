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

export default withPageAuthRequired(
  function Dashboard({ params: { lang } }) {
    const d = useMemo(() => {
      return getDictionary(lang, 'pages/Dashboard');
    }, [lang]);

    const classes = useSWR('/api/classes', fetcher);

    if (d === null || classes.isLoading) return <Spin size="large" />;
    if (classes.error) return <div>{error.message}</div>;

    const allClasses = [...classes.data.teaching, ...classes.data.enrolled];
    allClasses.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
      <div className={cx('wrapper')}>
        <div className={cx('main')}>
          {allClasses.map((classItem, index) => (
            <Card
              key={index}
              className={cx('card')}
              title={classItem.className}
              bodyStyle={{ backgroundColor: 'white', height: '180px' }}
            >
              {/* Other details you want to display */}
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
