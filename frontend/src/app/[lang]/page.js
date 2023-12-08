'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { Spin } from 'antd';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';
import getDictionary from '@/utils/language';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export default function Home({ params: { lang } }) {
  const d = useMemo(() => {
    return getDictionary(lang, 'pages/Home');
  }, [lang]);

  const { data, isLoading } = useSWR('/api/profile', fetcher);

  if (isLoading || d === null) return <Spin size="large" />;

  if (data?.error) {
    return (
      <div className={cx('wrapper')}>
        <Header lang={lang} />
        <div className={cx('main')}>
          <h1 className={cx('welcome')}>{d.welcome}</h1>
          <h3 className={cx('description')}>{d.introduce}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('wrapper')}>
      <Header
        user={data?.user}
        lang={lang}
      />
      <div className={cx('main')}>
        <h1 className={cx('welcome')}>{d.welcome}</h1>
        <h3 className={cx('description')}>{d.introduce}</h3>
      </div>
    </div>
  );
}
