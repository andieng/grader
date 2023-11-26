'use client';

import { Button, Input, Form } from 'antd';
import classnames from 'classnames/bind';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import HomeButton from '@/components/HomeButton';
import styles from '@/styles/pages/Signup.module.scss';

const cx = classnames.bind(styles);

const Signup = () => {
  return (
    <Form className={cx('wrapper')}>
      <HomeButton />
      <h1 className={cx('title')}>Sign up for Grader</h1>
      <div className={cx('info')}>
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Full name is required' }]}
        >
          <Input
            className={cx('input')}
            placeholder="Full name"
            prefix={<UserOutlined />}
          />
        </Form.Item>
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
        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            className={cx('input')}
            placeholder="Confirm password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        className={cx('submit-btn')}
      >
        Sign up
      </Button>
      <span className={cx('redirect')}>
        Already have an account?
        <Button
          type="link"
          href="/login"
        >
          &nbsp;Log in
        </Button>
      </span>
    </Form>
  );
};

export default Signup;
