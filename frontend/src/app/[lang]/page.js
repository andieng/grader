'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { Spin, Button, Col, Row } from 'antd';
import { NextResponse } from 'next/server';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';
import getDictionary from '@/utils/language';
import { ERROR_ROLE_NOT_FOUND } from '@/constants/messages';
import { Connection } from '@/assets/vectors';

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
      <div className={cx('wrapper') + ' overflow-hidden'}>
        <Header
          lang={lang}
          user={data?.user}
        />
        <Row className={cx('main')}>
          <Col
            span={12}
            className={cx('image-container')}
          >
            <Connection className={cx('connection')} />
          </Col>
          <Col
            span={12}
            className={cx('introduction')}
          >
            <h2 className={cx('slogan-first-sentence')}>{d.slogan_first_sentence}</h2>
            <h2 className={cx('slogan-second-sentence')}>{d.slogan_second_sentence}</h2>
            <Button
              className={cx('get-started')}
              type="primary"
              href={`${lang}/dashboard`}
            >
              {d.get_started}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className={cx('wrapper') + ' overflow-hidden'}>
      <Header
        lang={lang}
        user={data?.user}
      />
      <Row className={cx('main')}>
        <Col
          span={12}
          className={cx('image-container')}
        >
          <Connection className={cx('connection')} />
        </Col>
        <Col
          span={12}
          className={cx('introduction')}
        >
          <h2 className={cx('slogan-first-sentence')}>{d.slogan_first_sentence}</h2>
          <h2 className={cx('slogan-second-sentence')}>{d.slogan_second_sentence}</h2>
          <Button
            className={cx('get-started')}
            type="primary"
            href={`${lang}/dashboard`}
          >
            {d.get_started}
          </Button>
        </Col>
      </Row>
    </div>
  );
}
