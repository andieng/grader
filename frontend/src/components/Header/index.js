import { Button } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/components/Header.module.scss';
import HomeButton from '@/components/HomeButton';

const cx = classnames.bind(styles);

export default function Header() {
  return (
    <header className={cx('header')}>
      <HomeButton />
      <nav></nav>
      <div className={cx('auth')}>
        <Button
          href="/api/auth/login"
          type="transparent"
          className={cx('login-btn')}
        >
          Log in/Sign up
        </Button>
      </div>
    </header>
  );
}
