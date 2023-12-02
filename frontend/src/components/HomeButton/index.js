import { Button } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/components/HomeButton.module.scss';
import Link from 'next/link';

const cx = classnames.bind(styles);

export default function HomeButton() {
  return (
    <Link href="/">
      <Button
        type="link"
        className={cx('home-btn')}
      >
        <img
          src="/icon-64x64.png"
          alt="grader-logo"
          width="38"
          height="38"
        />
        <h1 className={cx('logo')}>Grader</h1>
      </Button>
    </Link>
  );
}
