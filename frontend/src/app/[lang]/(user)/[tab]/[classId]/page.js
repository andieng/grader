'use client';
import { Spin } from 'antd';
import { useMemo } from 'react';
import useSWR from 'swr';
import DetailsTab from '@/components/DetailsTab';
import PeopleTab from '@/components/PeopleTab';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import GradeTab from '@/components/GradeTab';
import ReviewTab from '@/components/ReviewTab';
import getDictionary from '@/utils/language';

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export default withPageAuthRequired(
  function ClassDetails({ params: { lang, tab, classId } }) {
    const { user } = useUser();
    const apiUrl = `/en/api/classes/${classId}/members`;
    const d = useMemo(() => {
      return getDictionary(lang, 'pages/ClassDetails');
    }, [lang]);
    const { data, isLoading, error } = useSWR(apiUrl, fetcher);

    const member = useMemo(() => {
      if (!data || data.length === 0) return null;
      const result = data?.find((member) => member.member.email === user.email);
      return {
        classId: result?.classId,
        userId: result?.memberId,
        role: result?.role,
        studentId: result?.member?.studentId,
      };
    }, [data]);

    if (isLoading) return <Spin size="large" />;
    if (error) {
      console.error(error);
      return (
        <Result
          title="Error"
          subTitle={d.somethingWentWrong}
        />
      );
    }

    return tab === 'd' ? (
      <DetailsTab
        lang={lang}
        classId={classId}
      />
    ) : tab === 'p' ? (
      <PeopleTab
        lang={lang}
        classId={classId}
      />
    ) : tab === 'g' ? (
      <GradeTab
        lang={lang}
        classId={classId}
        member={member}
      />
    ) : (
      <ReviewTab
        lang={lang}
        classId={classId}
      />
    );
  },
  {
    returnTo: `/dashboard`,
  },
);
