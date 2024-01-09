'use client';

import useSWR from 'swr';
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import getDictionary from '@/utils/language';
import { Spin, Card, Space, Button, Tooltip, message, Result } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/pages/Dashboard.module.scss';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { CopyOutlined } from '@ant-design/icons';

const cx = classnames.bind(styles);
const { Meta } = Card;

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(
  function Dashboard({ params: { lang } }) {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const d = useMemo(() => {
      return getDictionary(lang, 'pages/Dashboard');
    }, [lang]);
    const classes = useSWR('/api/classes', fetcher);

    const allClasses = useMemo(() => {
      const allClasses = classes.data ? [...classes.data.teaching, ...classes.data.enrolled] : [];
      allClasses.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return allClasses;
    }, [classes]);

    const handleCopyClassCode = useCallback(
      (classCode) => {
        navigator.clipboard.writeText(classCode);
        messageApi.open({
          type: 'success',
          content: `${d.classCodeCopied}`,
        });
      },
      [d, messageApi],
    );

    const chooseClassHandler = (classId) => {
      router.push(`/${lang}/d/${classId}`);
    };

    if (d === null || classes.isLoading) return <Spin size="large" />;
    if (classes.error) return <div>{error.message}</div>;

    return (
      <>
        {allClasses.length === 0 ? (
          <Result
            className={cx('no-data')}
            icon={
              <img
                src="https://www.basilica.hr/build/images/background/no-results-bg.2d2c6ee3.png"
                height="200"
              />
            }
            title="No data"
            subTitle="Oops! Seem like you haven't joined any classes"
          />
        ) : (
          <Space className={cx('wrapper')}>
            {contextHolder}
            {allClasses.map((classItem) => (
              <Card
                key={classItem.classId}
                className={cx('card')}
                onClick={() => chooseClassHandler(classItem.classId)}
                cover={
                  <img
                    className={cx('class-picture')}
                    alt={classItem.className}
                    src={classItem.classPicture}
                  />
                }
                actions={[
                  <span key="class-code">{classItem.classCode}</span>,
                  <Tooltip
                    key="copy-btn"
                    title="Copy"
                  >
                    <Button
                      type="white"
                      className={cx('copy-btn')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyClassCode(classItem.classCode);
                      }}
                      icon={
                        <CopyOutlined
                          key="copy"
                          className={cx('copy')}
                        />
                      }
                    />
                  </Tooltip>,
                ]}
              >
                <Meta
                  title={classItem.className}
                  className={cx('card-title')}
                  description={
                    <>
                      <p>
                        {classItem.numTeachers} {d.teachers}
                      </p>
                      <p>
                        {classItem.numStudents} {d.students}
                      </p>
                    </>
                  }
                />
              </Card>
            ))}
          </Space>
        )}
      </>
    );
  },
  {
    returnTo: '/dashboard',
  },
);
