import classnames from 'classnames/bind';
import Header from '@/components/Header';
import styles from '@/styles/pages/Home.module.scss';

const cx = classnames.bind(styles);

export default function Home() {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <div className={cx('main')}>
        <h1 className={cx('welcome')}>Welcome to Grader!</h1>
        <h3 className={cx('description')}>Explore our products and services to discover the possibilities.</h3>
      </div>
    </div>
  );
}
