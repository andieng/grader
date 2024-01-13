'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { Result, Button, Spin } from 'antd';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/layouts/AdminLayout.module.scss';
import { CLAIM_ROLES } from '@/constants/auth';

const cx = classnames.bind(styles);

export default function AdminLayout({ children, params: { lang } }) {
  const { user } = useUser();

  const d = useMemo(() => {
    return getDictionary(lang, 'layouts/Admin');
  }, [lang]);

  if (user && user[CLAIM_ROLES]?.includes('admin')) {
    return <div>{children}</div>;
  }

  if (user) {
    if (user[CLAIM_ROLES]?.includes('admin')) {
      return <div>{children}</div>;
    } else {
      return (
        <Result
          status="403"
          title="403"
          className={cx('error-result')}
          subTitle={d.error_not_authorized}
          extra={
            <Link href="/">
              <Button
                type="primary"
                className={cx('back-home-btn')}
              >
                {d.back_home}
              </Button>
            </Link>
          }
        />
      );
    }
  }

  return <Spin size="large" />;
}
