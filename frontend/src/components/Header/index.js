import { Button, Dropdown } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/Header.module.scss';
import HomeButton from '@/components/HomeButton';

const cx = classnames.bind(styles);

const items = [
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
    label: 'Log Out',
    key: '3',
    icon: <LogoutOutlined />,
  },
];

export default function Header({ user }) {
  return (
    <header className={cx('header')}>
      <HomeButton />
      <nav></nav>
      <div className={cx('auth')}>
        {!user && (
          <Button
            href="/api/auth/login"
            type="transparent"
            className={cx('login-btn')}
          >
            Log in/Sign up
          </Button>
        )}
        {user && (
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
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
      </div>
    </header>
  );
}
