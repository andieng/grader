'use client';

import { useMemo } from 'react';
import getDictionary from '@/utils/language';
import { Card, Button, Row, Col } from 'antd';
import { MoreOutlined, QuestionOutlined, CopyOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/ReviewTab.module.scss';
import ClassMenu from '../ClassMenu';

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

const ReviewTab = ({ lang, classId }) => {
  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}>
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

export default ReviewTab;
