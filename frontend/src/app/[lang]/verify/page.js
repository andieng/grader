'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Result, Button, Spin } from 'antd';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/pages/Verify.module.scss';

const cx = classnames.bind(styles);

export default function Verify({ params: { lang } }) {
  const d = useMemo(() => {
    return getDictionary(lang, 'pages/Verify');
  }, [lang]);
  const { user } = useUser();
  const router = useRouter();

  if (user?.email_verified) {
    router.push(`/dashboard`);
  }

  if (user && !user?.email_verified) {
    return (
      <Result
        icon={
          <img
            className={cx('verified-img')}
            alt="Verify email"
            src="/verify-email.jpg"
          />
        }
        status="info"
        title={d.verify_email}
        className={cx('error-result')}
        subTitle={d.verify_message}
        extra={
          <Button
            type="primary"
            href={`/${lang}`}
            className={cx('back-home-btn')}
          >
            {d.back_home}
          </Button>
        }
      />
    );
  }

  return <Spin size="large" />;
}
