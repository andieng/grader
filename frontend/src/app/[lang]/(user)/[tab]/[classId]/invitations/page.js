'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useSearchParams } from 'next/navigation';
import { mutate } from 'swr';

const saveTokenToLocalStorage = (token) => {
  localStorage.setItem('token', token);
};

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

const removeTokenFromLocalStorage = () => {
  localStorage.removeItem('token');
};

export default function InvitationPage({ params: { lang, classId } }) {
  const router = useRouter();

  const { user } = useUser();

  const searchParams = useSearchParams();
  let token = searchParams.get('token');

  if (token != null) saveTokenToLocalStorage(token);
  else token = getTokenFromLocalStorage();

  console.log(token);

  const redirectUrl = `d/${classId}/invitations`;

  const addMember = async () => {
    const response = await fetch('/api/classes/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classId, token }),
    });
    removeTokenFromLocalStorage();
  };

  useEffect(() => {
    if (!user) {
      router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/api/auth/login?returnTo=/${redirectUrl}`);
    } else {
      addMember();
      mutate('/api/classes');
      router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/d/${classId}`);
    }
  }, [user]);

  return <Spin size="large" />;
}
