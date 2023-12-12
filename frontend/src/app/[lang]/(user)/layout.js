'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { Result, Button } from 'antd';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/layouts/UserLayout.module.scss';

const cx = classnames.bind(styles);

export default function UserLayout({ children }) {
  const { user } = useUser();
  const d = useMemo(() => {
    return getDictionary(lang, 'layouts/User');
  }, [lang]);

  if (user && !user?.email_verified) {
    return (
      <Result
        status="403"
        title="403"
        className={cx('error-result')}
        subTitle={d.error_not_verified}
        extra={
          <Link href="/">
            <Button type="primary">{d.back_home}</Button>
          </Link>
        }
      />
    );
  }

  return <div>{children}</div>;
}
