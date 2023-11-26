'use client';

import { Button, Input, Form, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import { Facebook, Google } from '@/assets/icons';
import HomeButton from '@/components/HomeButton';
import styles from '@/styles/pages/Login.module.scss';

const cx = classnames.bind(styles);

const Login = () => {
  return (
    <Form className={cx('wrapper')}>
      <HomeButton />
      <h1 className={cx('title')}>Log in to Grader</h1>
      <div className={cx('info')}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input
            className={cx('input')}
            placeholder="Email"
            prefix={<MailOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password
            className={cx('input')}
            placeholder="Password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
      </div>

      <div className={cx('forgot-password')}>
        <Button
          type="link"
          href="/forgot-password"
        >
          Forgot password?
        </Button>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        className={cx('submit-btn')}
      >
        Log in
      </Button>
      <span className={cx('redirect')}>
        Don't have an account?
        <Button
          type="link"
          href="/signup"
        >
          &nbsp;Sign up now
        </Button>
      </span>
      <Divider style={{ fontSize: 14, color: '#888' }}>or</Divider>
      <Button
        type="white"
        icon={<Google />}
        className={cx('social-login-btn')}
      >
        Log in with Google
      </Button>
      <Button
        type="white"
        icon={<Facebook />}
        className={cx('social-login-btn')}
      >
        Log in with Facebook
      </Button>
    </Form>
  );
};

export default Login;
