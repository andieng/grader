'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';
import { getDictionary } from '../../get-dictionaries';

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
      dict.locale = lang;
      setDictionary(dict);
    };

    fetchDictionary();
  }, [lang]);

  const { data, isLoading } = useSWR('/api/profile', fetcher);

  if (isLoading || dictionary === null) return <Spin size="large" />;

  if (data?.error) {
    return (
      <div className={cx('wrapper')}>
        <Header
          dictionary={dictionary.components.header}
          locale={dictionary.locale}
        />
        <div className={cx('main')}>
          <h1 className={cx('welcome')}>{dictionary.pages.home.welcome}</h1>
          <h3 className={cx('description')}>{dictionary.pages.home.introduce}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('wrapper')}>
      <Header
        user={data?.user}
        dictionary={dictionary?.components.header}
        locale={dictionary.locale}
      />
      <div className={cx('main')}>
        <h1 className={cx('welcome')}>{dictionary.pages.home.welcome}</h1>
        <h3 className={cx('description')}>{dictionary.pages.home.introduce}</h3>
      </div>
    </div>
  );
}
