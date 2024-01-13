'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { Card, Button, Row, Col, message } from 'antd';
import { MoreOutlined, FileTextOutlined, CopyOutlined } from '@ant-design/icons';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/DetailsTab.module.scss';
import ClassMenu from '@/components/ClassMenu';

const cx = classnames.bind(styles);

const DUMMY_CARDS = [
  {
    content: 'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Vũ trụ được tạo ra như thế nào?',
    time: '10:29',
  },
  {
    content: 'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Sông nào dài nhất Việt Nam?',
    time: '10:29',
  },
  {
    content: 'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Sông nào dài nhất Việt Nam?',
    time: '10:29',
  },
  {
    content: 'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Sông nào dài nhất Việt Nam?',
    time: '10:29',
  },
  {
    content: 'Hạnh Thư Nguyễn đã đăng một câu hỏi mới: Sông nào dài nhất Việt Nam?',
    time: '10:29',
  },
];

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const DetailsTab = ({ lang, classId }) => {
  const apiUrl = `/en/api/classes/${classId}`;
  const currentClass = useSWR(apiUrl, fetcher);
  const [messageApi, contextHolder] = message.useMessage();

  const publicList = useSWR(`/en/api/classes/${classId}/grades`, fetcher);

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const handleCopyClassCode = (classCode) => {
    navigator.clipboard.writeText(classCode);
    messageApi.open({
      type: 'success',
      content: `${d.classCodeCopied}`,
    });
  };

  return (
    <div className={cx('wrap')}>
      {contextHolder}
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}>
        <div className={cx('cover-img')}>
          <h2>{currentClass.data?.className}</h2>
        </div>
        <div className={cx('class-info')}>
          <Col>
            <Row>
              <Card className={cx('class-code')}>
                <div className={cx('card-class-code')}>
                  <p>{d.classCode}</p>
                  <div className={cx('copy-class-code')}>
                    <h2>{currentClass.data?.classCode}</h2>
                    <Button
                      type="white"
                      className={cx('copy-btn')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyClassCode(currentClass.data?.classCode);
                      }}
                      icon={
                        <CopyOutlined
                          key="copy"
                          className={cx('copy')}
                        />
                      }
                    />
                  </div>
                </div>
              </Card>
            </Row>
          </Col>
          <Col className={cx('posts')}>
            {publicList?.data?.assignmentGrades.map((item, index) => {
              const createdAtDate = new Date(item.createdAt);

              const day = createdAtDate.getDate();
              const month = createdAtDate.getMonth() + 1;
              const year = createdAtDate.getFullYear();

              const formattedDate = `${month}/${day}/${year}`;
              if (item.isPublished)
                return (
                  <Row key={index}>
                    <Card className={cx('card-post')}>
                      <div className={cx('card-post-info')}>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<FileTextOutlined />}
                        />
                        <div>
                          <p>
                            {d.publicNoti}
                            {item.assignmentName}
                          </p>
                          <p>{formattedDate}</p>
                        </div>
                        {/* <Button
                      type="text"
                      shape="circle"
                      size="large"
                      icon={<MoreOutlined className={cx('more-btn')} />}
                    /> */}
                      </div>
                    </Card>
                  </Row>
                );
            })}
          </Col>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
