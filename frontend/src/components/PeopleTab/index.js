'use client';

import { useMemo } from 'react';
import { Menu, Card, Button, Row, Col, Result } from 'antd';
import { MoreOutlined, QuestionOutlined, UserAddOutlined } from '@ant-design/icons';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/PeopleTab.module.scss';

const cx = classnames.bind(styles);

const DUMMY_STUDENTS = [
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
  {
    name: 'Hạnh Thư Nguyễn',
    avatar: '10:29',
  },
];

const PeopleTab = ({ lang }) => {
  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetail');
  }, [lang]);

  return (
    <div className={cx('container')}>
      <Card
        className={cx('card')}
        title={
          <div className={cx('card-title')}>
            <h2>{d.teachers}</h2>
            <Button
              type="primary"
              shape="circle"
              icon={<UserAddOutlined />}
            />
          </div>
        }
      >
        {DUMMY_STUDENTS.map((item, index) => (
          <div key={index}>
            <Row>
              <div className={cx('card-post-info')}>
                <img
                  className={cx('user-avatar')}
                  src={'/user.png'}
                  alt="User"
                />

                <p>{item.name}</p>
                <Button
                  type="text"
                  shape="circle"
                  size="large"
                  icon={<MoreOutlined className={cx('more-btn')} />}
                />
              </div>
            </Row>
            {index !== DUMMY_STUDENTS.length - 1 && <hr className={cx('horizontal-line')} />}{' '}
          </div>
        ))}
      </Card>
      <Card
        className={cx('card')}
        title={
          <div className={cx('card-title')}>
            <h2>{d.students}</h2>
            <Button
              type="primary"
              shape="circle"
              icon={<UserAddOutlined />}
            />
          </div>
        }
      >
        {DUMMY_STUDENTS.map((item, index) => (
          <div key={index}>
            <Row>
              <div className={cx('card-post-info')}>
                <img
                  className={cx('user-avatar')}
                  src={'/user.png'}
                  alt="User"
                />

                <p>{item.name}</p>
                <Button
                  type="text"
                  shape="circle"
                  size="large"
                  icon={<MoreOutlined className={cx('more-btn')} />}
                />
              </div>
            </Row>
            {index !== DUMMY_STUDENTS.length - 1 && <hr className={cx('horizontal-line')} />}{' '}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default PeopleTab;
