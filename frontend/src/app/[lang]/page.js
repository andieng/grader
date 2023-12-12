'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { Spin } from 'antd';
import { NextResponse } from 'next/server';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';
import getDictionary from '@/utils/language';
import { ERROR_ROLE_NOT_FOUND } from '@/constants/messages';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const responseRole = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/role`);
  const roleData = await responseRole.json();
  const role = roleData?.role;

  if (!role) {
    return NextResponse.json({ error: ERROR_ROLE_NOT_FOUND }, { status: 200 });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${role}/profile`);
  return response.json();
};

export default function Home({ params: { lang } }) {
  const d = useMemo(() => {
    return getDictionary(lang, 'pages/Home');
  }, [lang]);
  const { data, isLoading } = useSWR('/', fetcher);
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
