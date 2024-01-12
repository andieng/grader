import { Button } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/components/HomeButton.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const cx = classnames.bind(styles);

export default function HomeButton() {
  const pathname = usePathname();
  let redirectLocale = '';

  if (pathname.includes('/en')) redirectLocale = '/en';
  else redirectLocale = '/vi';

  return (
    <Link href={redirectLocale}>
      <Button
        type="link"
        className={cx('home-btn')}
      >
        <img
          src="/icon-64x64.png"
          alt="grader-logo"
          width="35"
          height="35"
        />
        <h1 className={cx('logo')}>Grader</h1>
      </Button>
    </Link>
  );
}
