'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { Result, Button } from 'antd';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/layouts/VerifyLayout.module.scss';

const cx = classnames.bind(styles);

export default function Verify({ params: { lang } }) {
  const d = useMemo(() => {
    return getDictionary(lang, 'pages/Verify');
  }, [lang]);
  const { user } = useUser();

  if (!user) {
    return (
      <Result
        status="401"
        title="401"
        className={cx('error-result')}
        subTitle={d.error_not_authenticated}
        extra={
          <Link href="/">
            <Button type="primary">{d.back_home}</Button>
          </Link>
        }
      />
    );
  }

  if (!user?.email_verified) {
    return (
      <Result
        icon={
          <img
            alt="Verify email"
            src="/verify-email.jpg"
          />
        }
        status="info"
        title={d.verify_email}
        className={cx('error-result')}
        subTitle={d.verify_message}
        extra={
          <Link href="/">
            <Button type="primary">{d.back_home}</Button>
          </Link>
        }
      />
    );
  }

  return <div>Verified</div>;
}
