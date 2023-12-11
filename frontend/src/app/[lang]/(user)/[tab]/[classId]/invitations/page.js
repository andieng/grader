'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MoreOutlined, QuestionOutlined, PlusOutlined } from '@ant-design/icons';
import { Menu, Card, Button, Row, Col, Result } from 'antd';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/pages/ClassDetail.module.scss';
import DetailTab from '@/components/DetailTab';
import PeopleTab from '@/components/PeopleTab';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const cx = classnames.bind(styles);

// http://localhost:3000/en/d/8b42872f-feef-4015-8c54-a35f5faf271a/invitations?token=da1222c3-e8f4-4565-953e-fb09a1b7ad10

export default withPageAuthRequired(
  function InvitationPage({ params: { lang } }) {
    const router = useRouter();
    const invitationUrl = window.location.href;
    // const pathname = usePathname();

    // const [token, setToken] = useState('');
    // useEffect(() => {

    //   if (tokenFromUrl) {
    //     setToken(tokenFromUrl);
    //   }
    // }, []);

    const url = new URL(invitationUrl);
    const searchParams = new URLSearchParams(url.search);
    const token = searchParams.get('token');
    const pathname = url.pathname;
    const parts = pathname.split('/');
    const classId = parts[3];

    console.log(classId);
    console.log(token);

    const addMember = async () => {
      const response = await fetch('/api/classes/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, token }),
      });
    };

    addMember();

    let redirectLocale = '';

    if (pathname.includes('/en')) redirectLocale = '/en/dashboard';
    else redirectLocale = '/vi/dashboard';

    const d = useMemo(() => {
      return getDictionary(lang, 'pages/ClassDetail');
    }, [lang]);

    return <div>invite</div>;
  },
  {
    // doesn't work
    returnTo: '/something',
  },
);
