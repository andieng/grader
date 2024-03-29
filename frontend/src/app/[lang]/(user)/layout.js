'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { Result, Button } from 'antd';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/layouts/UserLayout.module.scss';
import { CLAIM_ROLES } from '@/constants/auth';
import { useRouter } from 'next/navigation';

const cx = classnames.bind(styles);

export default function UserLayout({ children, params: { lang } }) {
  const { user } = useUser();
  const router = useRouter();

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

  if (user && user[CLAIM_ROLES].includes('admin')) {
    router.push('/admin/dashboard');
  }

  return <div>{children}</div>;
}
