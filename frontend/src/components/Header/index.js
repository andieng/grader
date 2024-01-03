import { Button, Dropdown, Space, Modal, Input, Form } from 'antd';
import { mutate } from 'swr';
import { useMemo, useCallback, useState } from 'react';
import { LogoutOutlined, DownOutlined, GlobalOutlined, BellOutlined, TeamOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import { useRouter, usePathname } from 'next/navigation';
import { FlagUSA, FlagVietnam } from '@/assets/icons';
import getDictionary from '@/utils/language';
import HomeButton from '@/components/HomeButton';
import styles from '@/styles/components/Header.module.scss';
import Link from 'next/link';

const cx = classnames.bind(styles);

const languageItems = [
  {
    label: <p className={cx('language-item')}>English</p>,
    key: '0',
    icon: <FlagUSA className={cx('dropdown-icon')} />,
  },
  {
    label: <p className={cx('language-item')}>Tiếng Việt</p>,
    key: '1',
    icon: <FlagVietnam className={cx('dropdown-icon')} />,
  },
];

export default function Header({ user, lang, isInDashboard }) {
  const router = useRouter();
  const pathname = usePathname();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const onFinish = async (values) => {
    form.resetFields();
    setLoading(true);

    const response = await fetch('/api/classes/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ className: values }),
    });

    const data = await response.json();
    setLoading(false);
    setOpen(false);
    mutate('/api/classes');
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  let redirectLocale = '';

  if (pathname.includes('/en')) redirectLocale = '/en/dashboard';
  else redirectLocale = '/vi/dashboard';

  const d = useMemo(() => {
    return getDictionary(lang, 'components/Header');
  }, [lang]);

  const userItems = useMemo(
    () => [
      {
        label: (
          <Link href={redirectLocale}>
            <p className={cx('user-item')}>{d.my_classes}</p>
          </Link>
        ),
        key: '0',
        icon: <TeamOutlined className={cx('dropdown-icon')} />,
      },
      {
        label: <a className={cx('user-item')}>{d.notifications}</a>,
        key: '1',
        icon: <BellOutlined className={cx('dropdown-icon')} />,
      },
      {
        type: 'divider',
      },
      {
        label: (
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/api/auth/logout`}
            className={cx('user-item')}
          >
            {d.logout}
          </a>
        ),
        key: '3',
        icon: <LogoutOutlined className={cx('dropdown-icon')} />,
      },
    ],
    [d, lang],
  );

  const switchLanguagesHandler = useCallback(
    (event) => {
      let updatePathname = '';

      switch (event.key) {
        case '0': //en
          updatePathname = pathname.replace(/\/vi(\/|$)/, '/en$1');
          router.push(updatePathname);
          break;
        case '1': //vi
          updatePathname = pathname.replace(/\/en(\/|$)/, '/vi$1');
          router.push(updatePathname);
          break;
      }
    },
    [pathname, router],
  );

  console.log(user);

  return (
    <header className={cx('header')}>
      <HomeButton />
      <nav></nav>
      <div className={cx('auth')}>
        {!user && (
          <>
            <Button
              type="text"
              className={cx('login-btn')}
              href={`${lang}/api/auth/login`}
            >
              {d.login}
            </Button>
            <Button
              type="transparent"
              className={cx('signup-btn')}
              href={`${lang}/api/auth/signup`}
            >
              {d.signup}
            </Button>
          </>
        )}

        {isInDashboard && (
          <Button
            className={cx('create-class-btn')}
            type="primary"
            onClick={() => showModal()}
          >
            {d.createClass}
          </Button>
        )}

        {user && !isInDashboard && (
          <Button
            type="text"
            href={redirectLocale}
            className={cx('dashboard-btn')}
          >
            {d.dashboard}
          </Button>
        )}

        {user && (
          <Dropdown
            menu={{
              items: userItems,
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <a
              className={cx('avatar')}
              onClick={(e) => e.preventDefault()}
            >
              <img
                src={user.avatar || user.picture}
                alt="User"
              />
            </a>
          </Dropdown>
        )}
        <Dropdown
          menu={{
            items: languageItems,
            onClick: switchLanguagesHandler,
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <a
            className={cx('language')}
            onClick={(e) => e.preventDefault()}
          >
            <Space>
              <GlobalOutlined />

              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Modal
          className={cx('create-modal')}
          open={open}
          title={<h2>{d.createClass}</h2>}
          onCancel={handleCancel}
          footer={[]}
        >
          <p>{d.className}</p>
          <Form
            name="form"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="className"
              rules={[
                {
                  required: true,
                  message: d.classNameRequired,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item className={cx('modal-btn')}>
              <Button
                key="cancel"
                type="white"
                onClick={handleCancel}
              >
                {d.cancel}
              </Button>
              <Button
                key="submit"
                htmlType="submit"
                type="primary"
                loading={loading}
              >
                {d.create}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </header>
  );
}
