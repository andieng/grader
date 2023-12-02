'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { Result, Button } from 'antd';
import classnames from 'classnames/bind';
import { ERROR_NOT_VERIFIED } from '@/constants/messages';
import styles from '@/styles/layouts/UserLayout.module.scss';

const cx = classnames.bind(styles);

export default function UserLayout({ children }) {
  const { user } = useUser();

  if (user && !user?.email_verified) {
    return (
      <Result
        status="403"
        title="403"
        className={cx('error-result')}
        subTitle={ERROR_NOT_VERIFIED}
        extra={
          <Link href="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }

  return <div>{children}</div>;
}
