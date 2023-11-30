'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import classnames from 'classnames/bind';
import Header from '@/components/Header';
import Spinner from '@/components/Spinner';
import styles from '@/styles/pages/Home.module.scss';

const cx = classnames.bind(styles);

const items = [
  {
    label: <a href="https://www.antgroup.com">My Classes</a>,
    key: '0',
  },
  {
    label: <a href="https://www.aliyun.com">Notifications</a>,
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: 'Log Out',
    key: '3',
  },
];

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <Spinner />;
  if (error) return <div>{error.message}</div>;
  console.log(user);

  return (
    <>
      {user && (
        <div>
          <img
            src={user.picture}
            alt={user.name}
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Click me
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      {!user && (
        <div className={cx('wrapper')}>
          <Header />
          <div className={cx('main')}>
            <h1 className={cx('welcome')}>Welcome to Grader!</h1>
            <h3 className={cx('description')}>Explore our products and services to discover the possibilities.</h3>
          </div>
        </div>
      )}
    </>
  );
}
