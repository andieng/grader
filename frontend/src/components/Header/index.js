import { Button, Dropdown, Space, Modal, Input, Form } from 'antd';
import { mutate } from 'swr';
import { useMemo, useCallback, useState } from 'react';
import {
  LogoutOutlined,
  DownOutlined,
  GlobalOutlined,
  BellOutlined,
  TeamOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import classnames from 'classnames/bind';
import { useRouter, usePathname } from 'next/navigation';
import { FlagUSA, FlagVietnam } from '@/assets/icons';
import getDictionary from '@/utils/language';
import HomeButton from '@/components/HomeButton';
import styles from '@/styles/components/Header.module.scss';
import Link from 'next/link';
import { CLAIM_ROLES } from '@/constants/auth';

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
  const [createForm] = Form.useForm();
  const [joinForm] = Form.useForm();

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinResult, setJoinResult] = useState({});
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [openJoinFailedModal, setOpenJoinFailedModal] = useState(false);

  const showCreateModal = () => {
    setOpenCreateModal(true);
  };

  const showJoinModal = () => {
    setOpenJoinModal(true);
  };

  const handleCreate = async (values) => {
    setIsCreating(true);

    await fetch('/api/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ className: values.className }),
    });

    setIsCreating(false);
    setOpenCreateModal(false);
    createForm.resetFields();
    mutate('/api/classes');
  };

  const handleJoin = async (values) => {
    setIsJoining(true);

    const response = await fetch('/api/classes/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: values.classCode }),
    });

    const data = await response.json();

    setJoinResult(data);
    setIsJoining(false);

    if (!data.error) {
      setOpenJoinModal(false);
      mutate('/api/classes');
      joinForm.resetFields();
    } else {
      setOpenJoinFailedModal(true);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const handleJoinCancel = () => {
    setOpenJoinModal(false);
    joinForm.resetFields();
    setJoinResult({});
  };

  const handleJoinFailedOk = () => {
    setOpenJoinFailedModal(false);
  };

  const handleCreateCancel = () => {
    setOpenCreateModal(false);
    createForm.resetFields();
  };

  let redirectLocale = '';

  if (user && user[CLAIM_ROLES]?.includes('admin')) {
    redirectLocale = `/${lang}/admin/dashboard`;
  } else {
    redirectLocale = `/${lang}/dashboard`;
  }

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
    [d, lang, redirectLocale],
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

  const isInHome = pathname === `/${lang}`;

  return (
    <header
      className={cx('header')}
      style={!isInHome ? { borderBottom: '1px solid rgba(0, 0, 0, 0.1)' } : {}}
    >
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
          <>
            <Button
              className={cx('create-class-btn')}
              onClick={() => showCreateModal()}
            >
              {d.createClass}
            </Button>
            <Button
              className={cx('join-class-btn')}
              type="primary"
              onClick={() => showJoinModal()}
            >
              {d.joinClass}
            </Button>
          </>
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
          getPopupContainer={(trigger) => trigger.parentNode}
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
          className={cx('modal')}
          open={openCreateModal}
          title={<h2 className={cx('modal-title')}>{d.createClass}</h2>}
          onCancel={handleCreateCancel}
          footer={[]}
        >
          <p>{d.className}</p>
          <Form
            name="createForm"
            form={createForm}
            onFinish={handleCreate}
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
              <Input placeholder={d.enterClassName} />
            </Form.Item>
            <Form.Item className={cx('modal-btn')}>
              <Button
                key="cancel"
                type="white"
                onClick={handleCreateCancel}
              >
                {d.cancel}
              </Button>
              <Button
                key="submit"
                htmlType="submit"
                type="primary"
                loading={isCreating}
              >
                {d.create}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          className={cx('modal')}
          open={openJoinModal}
          title={<h2 className={cx('modal-title')}>{d.joinClass}</h2>}
          onCancel={handleJoinCancel}
          footer={[]}
        >
          <p>{d.classCode}</p>
          <Form
            name="joinForm"
            form={joinForm}
            onFinish={handleJoin}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="classCode"
              rules={[
                {
                  required: true,
                  message: d.classCodeRequired,
                },
              ]}
            >
              <Input placeholder={d.enterClassCode} />
            </Form.Item>
            <Form.Item className={cx('modal-btn')}>
              <Button
                key="cancel"
                type="white"
                onClick={handleJoinCancel}
              >
                {d.cancel}
              </Button>
              <Button
                key="submit"
                htmlType="submit"
                type="primary"
                loading={isJoining}
              >
                {d.join}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          className={cx('error-modal')}
          open={openJoinFailedModal}
          title={
            <h2 className={cx('error-modal-title')}>
              <CloseCircleFilled />
              {d.error}
            </h2>
          }
          onCancel={handleJoinFailedOk}
          footer={[]}
        >
          <p>{joinResult.status === 409 ? d.alreadyJoined : d.somethingWentWrong}</p>
          <div className={cx('modal-btn')}>
            <Button
              type="primary"
              className={cx('join-failed-ok')}
              onClick={handleJoinFailedOk}
            >
              {d.ok}
            </Button>
          </div>
        </Modal>
      </div>
    </header>
  );
}
