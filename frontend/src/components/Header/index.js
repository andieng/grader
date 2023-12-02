import { Button, Dropdown, Space } from 'antd';
import { LogoutOutlined, DownOutlined, GlobalOutlined, BellOutlined, TeamOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/Header.module.scss';
import HomeButton from '@/components/HomeButton';
import { FlagUSA, FlagVietnam } from '@/assets/icons';

const cx = classnames.bind(styles);

const userItems = [
  {
    label: <a className={cx('user-item')}>My Classes</a>,
    key: '0',
    icon: <TeamOutlined className={cx('dropdown-icon')} />,
  },
  {
    label: <a className={cx('user-item')}>Notifications</a>,
    key: '1',
    icon: <BellOutlined className={cx('dropdown-icon')} />,
  },
  {
    type: 'divider',
  },
  {
    label: (
      <a
        href="/api/auth/logout"
        className={cx('user-item')}
      >
        Log Out
      </a>
    ),
    key: '3',
    icon: <LogoutOutlined className={cx('dropdown-icon')} />,
  },
];

const languageItems = [
  {
    label: <p className={cx('language-item')}>English</p>,
    key: '0',
    icon: <FlagUSA className={cx('dropdown-icon')} />,
  },
  {
    label: <p className={cx('language-item')}>Tiếng Việt</p>,
    key: '1',
    icon: <FlagVietnam className={cx('dropdown-icon')} />,
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
                src={user.avatar || user.picture}
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
          placement="bottomRight"
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
