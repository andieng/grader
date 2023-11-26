import classnames from 'classnames/bind';
import styles from '@/styles/layouts/AuthLayout.module.scss';

const cx = classnames.bind(styles);

export default function AuthLayout({ children }) {
  return <div className={cx('auth-form')}>{children}</div>;
}
