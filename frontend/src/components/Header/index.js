import { Button, Dropdown, Space } from 'antd';
import { LogoutOutlined, DownOutlined, GlobalOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/Header.module.scss';
import HomeButton from '@/components/HomeButton';

const cx = classnames.bind(styles);

const userItems = [
  {
    label: <a>My Classes</a>,
    key: '0',
  },
  {
    label: <a>Notifications</a>,
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: <a href="/api/auth/logout">Log Out</a>,
    key: '3',
    icon: <LogoutOutlined />,
  },
];

const languageItems = [
  {
    label: 'English',
    key: '0',
  },
  {
    label: 'Tiếng Việt',
    key: '1',
  },
];

export default function Header({ user }) {
  return (
    <header className={cx('header')}>
      <HomeButton />
      <nav></nav>
      <div className={cx('auth')}>
        {!user && (
          <>
            <Button
              type="transparent"
              className={cx('login-btn')}
              href="/api/auth/login"
            >
              Log in
            </Button>
            <Button
              type="primary"
              className={cx('signup-btn')}
              href="/api/auth/signup"
            >
              Sign up
            </Button>
          </>
        )}

        {user && (
          <Dropdown
            menu={{
              items: userItems,
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <a
              className={cx('avatar')}
              onClick={(e) => e.preventDefault()}
            >
              <img
                src={user.picture}
                alt="User"
              />
            </a>
          </Dropdown>
        )}
        <Dropdown
          menu={{
            items: languageItems,
          }}
          trigger={['click']}
          placement="bottom"
        >
          <a
            className={cx('language')}
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              <GlobalOutlined />

              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </header>
  );
}
