'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useUser } from '@auth0/nextjs-auth0/client';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';
import { getDictionary } from '../../dictionaries/dictionaries';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export default function Home({ params: { lang } }) {
  const [dictionary, setDictionary] = useState(null);
  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };

    fetchDictionary();
  }, [lang]);

  const { user } = useUser();
  const { data, isLoading } = useSWR(user ? '/api/profile' : null, fetcher);

  if (isLoading) return <Spin size="large" />;

  console.log(dictionary);

  return (
    <div className={cx('wrapper')}>
      <Header user={data?.user} />
      <div className={cx('main')}>
        <h1 className={cx('welcome')}>Welcome to Grader!</h1>
        <h3 className={cx('description')}>Explore our products and services to discover the possibilities.</h3>
      </div>
    </div>
  );
}
