'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { MoreOutlined, QuestionOutlined, PlusOutlined } from '@ant-design/icons';
import { Menu, Card, Button, Row, Col, Result } from 'antd';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/pages/ClassDetail.module.scss';
import DetailTab from '@/components/DetailTab';
import PeopleTab from '@/components/PeopleTab';

const cx = classnames.bind(styles);

const DUMMY_CARDS = [
  {
    content: 'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Ai đã đặt tên cho dòng sông',
    time: '10:29',
  },
  {
    content:
      'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè',
    time: '10:27',
  },
  {
    content:
      'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè',
    time: '10:27',
  },
  {
    content:
      'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè',
    time: '10:27',
  },
  {
    content:
      'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè',
    time: '10:27',
  },
  {
    content:
      'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè',
    time: '10:27',
  },
  {
    content:
      'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Bao nhiêu lâu thì bán được 1 tỷ gói mè',
    time: '10:27',
  },
];

const ClassDetail = ({ params: { lang } }) => {
  const router = useRouter();
  const pathname = usePathname();

  let redirectLocale = '';

  if (pathname.includes('/en')) redirectLocale = '/en/dashboard';
  else redirectLocale = '/vi/dashboard';

  let activeTab = '';
  if (pathname.includes('/p/') && activeTab !== 'people') activeTab = 'people';
  else if (pathname.includes('/g/') && activeTab !== 'grades') activeTab = 'grades';
  else if (pathname.includes('/d/') && activeTab !== 'detail') activeTab = 'detail';

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetail');
  }, [lang]);

  if (activeTab === 'detail') return <DetailTab lang={lang} />;
  else if (activeTab === 'people') return <PeopleTab lang={lang} />;
  else if (activeTab === 'grades') return <div>grades</div>;
  // else
  //   return (
  //     <Result
  //       status="404"
  //       title="404"
  //       subTitle="Sorry, the page you visited does not exist."
  //       extra={
  //         <Link href={`${redirectLocale}`}>
  //           <Button type="primary">Back</Button>
  //         </Link>
  //       }
  //     />
  //   );
};

export default ClassDetail;
