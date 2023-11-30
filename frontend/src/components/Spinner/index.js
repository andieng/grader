import { Spin } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/components/Spinner.module.scss';

const cx = classnames.bind(styles);

const Spinner = () => (
  <Spin
    className={cx('spinner')}
    size="large"
  >
    <div className="content" />
  </Spin>
);
export default Spinner;
