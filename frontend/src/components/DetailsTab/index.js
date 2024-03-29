'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { Card, Button, Row, Col, message } from 'antd';
import { FileTextOutlined, CopyOutlined } from '@ant-design/icons';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/DetailsTab.module.scss';
import ClassMenu from '@/components/ClassMenu';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const DetailsTab = ({ lang, classId }) => {
  const apiUrl = `/en/api/classes/${classId}`;
  const currentClass = useSWR(apiUrl, fetcher);
  const [messageApi, contextHolder] = message.useMessage();

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
          {currentClass.data?.gradePublications.length > 0 && (
            <Col className={cx('posts')}>
              {currentClass.data.gradePublications.map((item, index) => (
                <Row key={index}>
                  <Card className={cx('card-post')}>
                    <div className={cx('card-post-info')}>
                      <FileTextOutlined className={cx('post-icon')} />
                      <div>
                        <p className={cx('publication')}>
                          {d.publicNoti} {item.assignment.assignmentName}
                        </p>
                        <p className={cx('created-at')}>{new Date(item.createdAt).toLocaleString('en-GB')}</p>
                      </div>
                    </div>
                  </Card>
                </Row>
              ))}
            </Col>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
