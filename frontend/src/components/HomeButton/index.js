import { Button } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/components/HomeButton.module.scss';

const cx = classnames.bind(styles);

export default function HomeButton() {
  return (
    <Button
      type="link"
      className={cx('home-btn')}
      href="/"
    >
      <img
        src="/icon-64x64.png"
        alt="grader-logo"
        width="38"
        height="38"
      />
      <h1 className={cx('logo')}>Grader</h1>
    </Button>
  );
}
