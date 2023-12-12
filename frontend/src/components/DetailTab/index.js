'use client';

import { useMemo } from 'react';
import { Menu, Card, Button, Row, Col, Result } from 'antd';
import { MoreOutlined, QuestionOutlined, PlusOutlined } from '@ant-design/icons';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/DetailTab.module.scss';

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

const DetailTab = ({ lang }) => {
  // const d = useMemo(() => {
  //   return getDictionary(lang, 'pages/ClassDetail');
  // }, [lang]);

  return (
    <div className={cx('container')}>
      <div className={cx('cover-img')}>
        <h2>2309-PTUDWNC-20_3</h2>
        <h4>Phát triển ứng dụng web nâng cao</h4>
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
