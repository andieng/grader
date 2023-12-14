'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { Card, Button, Row, Col } from 'antd';
import { MoreOutlined, QuestionOutlined } from '@ant-design/icons';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/DetailTab.module.scss';
import { usePathname } from 'next/navigation';

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
];

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const DetailTab = ({ lang }) => {
  // const d = useMemo(() => {
  //   return getDictionary(lang, 'pages/ClassDetail');
  // }, [lang]);
  const pathname = usePathname();
  let parts = pathname.split('/');
  let classId = parts[parts.length - 1];

  const params = {
    classId,
  };
  const apiUrl = `/en/api/classes/details?${new URLSearchParams(params)}`;
  const currentClass = useSWR(apiUrl, fetcher);

  return (
    <div className={cx('container')}>
      <div className={cx('cover-img')}>
        <h2>{currentClass.data?.className}</h2>
      </div>
      <div className={cx('class-info')}>
        <Col className={cx('posts')}>
          {DUMMY_CARDS.map((item, index) => (
            <Row key={index}>
              <Card className={cx('card-post')}>
                <div className={cx('card-post-info')}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<QuestionOutlined />}
                  />
                  <div>
                    <p>{item.content}</p>
                    <p>{item.time}</p>
                  </div>
                  <Button
                    type="text"
                    shape="circle"
                    size="large"
                    icon={<MoreOutlined className={cx('more-btn')} />}
                  />
                </div>
              </Card>
            </Row>
          ))}
        </Col>
      </div>
    </div>
  );
};

export default DetailTab;
