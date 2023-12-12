'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/pages/ClassDetail.module.scss';
import DetailTab from '@/components/DetailTab';
import PeopleTab from '@/components/PeopleTab';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const cx = classnames.bind(styles);

export default withPageAuthRequired(
  function ClassDetail({ params: { lang } }) {
    const pathname = usePathname();

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
  },
  {
    returnTo: `/dashboard`,
  },
);
