'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Result, Spin } from 'antd';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useSearchParams } from 'next/navigation';
import { mutate } from 'swr';
import classnames from 'classnames/bind';
import getDictionary from '@/utils/language';
import styles from '@/styles/pages/Intivation.module.scss';
import Link from 'next/link';

const cx = classnames.bind(styles);

export default function InvitationPage({ params: { lang, classId } }) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  const searchParams = useSearchParams();
  let token = searchParams.get('token');

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/Invitation');
  }, [lang]);

  if (token != null) localStorage.setItem('token', token);
  else token = localStorage.getItem('token');

  const redirectUrl = `d/${classId}/invitations`;

  const addMember = async () => {
    const data = fetch(`/api/classes/${classId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classId, token }),
    }).then((res) => res.json());

    return data;
  };

  useEffect(() => {
    if (!user) {
      router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/api/auth/login?returnTo=/${redirectUrl}`);
    } else {
      addMember()
        .then(() => {
          mutate('/api/classes');
          router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/d/${classId}`);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
          localStorage.removeItem('token');
        });
    }
  }, [user, error]);

  return (
    <>
      {!error && loading && <Spin size="large" />}
      {error && (
        <Result
          className={cx('message')}
          status="404"
          title="404"
          subTitle={d.noClasses}
          extra={
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/dashboard`}>
              <Button type="primary">{d.backToDashboard}</Button>
            </Link>
          }
        />
      )}
    </>
  );
}
