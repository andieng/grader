'use client';
import classnames from 'classnames/bind';
import styles from '@/styles/pages/ClassDetails.module.scss';
import DetailsTab from '@/components/DetailsTab';
import PeopleTab from '@/components/PeopleTab';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const cx = classnames.bind(styles);

export default withPageAuthRequired(
  function ClassDetails({ params: { lang, tab, classId } }) {
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
    ) : (
      <div>grades</div>
    );
  },
  {
    returnTo: `/dashboard`,
  },
);
