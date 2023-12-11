'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useSearchParams } from 'next/navigation';

// http://localhost:3000/en/d/9f1a2304-b8b9-4a12-aabf-fb19fb50e943/invitations?token=5f82e753-1005-4d72-a309-ec94939c0967

export default function InvitationPage({ params: { lang, classId } }) {
  const router = useRouter();

  const { user } = useUser();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const redirectUrl = `d/${classId}/invitations?token=${token}`;

  const addMember = async () => {
    console.log('inside ');
    const response = await fetch('/api/classes/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classId, token }),
    });
  };

  useEffect(() => {
    if (!user) {
      router.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/api/auth/login?returnTo=/${redirectUrl}`);
      // sau khi login thì add member
    }
    if (user) addMember();
  }, [user]);

  return <Spin size="large" />;
}
