'use client';

import { useMemo, useState } from 'react';
import { Input, Card, Button, Row, Modal, message } from 'antd';
import { MoreOutlined, CopyOutlined, UserAddOutlined } from '@ant-design/icons';
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
  const [targetInvitation, setTargetInvitation] = useState('Teachers');

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetail');
  }, [lang]);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const copyHandler = (link) => {
    navigator.clipboard.writeText(link);
    messageApi.open({
      type: 'success',
      content: `${d.copied}`,
    });
  };

  const showModal = (title) => {
    setOpen(true);
    setTargetInvitation(title);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className={cx('container')}>
      {contextHolder}
      <Card
        className={cx('card')}
        title={
          <div className={cx('card-title')}>
            <h2>{d.teachers}</h2>
            <Button
              type="primary"
              shape="circle"
              icon={<UserAddOutlined />}
              onClick={() => showModal(d.inviteTeachers)}
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
              onClick={() => showModal(d.inviteStudents)}
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
      <Modal
        className={cx('invitation-modal')}
        open={open}
        title={<h2>{targetInvitation}</h2>}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            onClick={handleCancel}
          >
            {d.cancel}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            {d.invite}
          </Button>,
        ]}
      >
        <h4>{d.inviteUrl}</h4>
        <div className={cx('invitation-link')}>
          <p>https://classroom.google.com/c/NjQ1MTM5MTE3NjQ1?cjc=ck5vu6z</p>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => copyHandler('https://classroom.google.com/c/NjQ1MTM5MTE3NjQ1?cjc=ck5vu6z')}
          ></Button>
        </div>
        <Input placeholder={d.inviteInput} />
      </Modal>
    </div>
  );
};

export default PeopleTab;
