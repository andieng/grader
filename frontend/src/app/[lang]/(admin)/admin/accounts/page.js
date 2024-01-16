'use client';

import useSWR from 'swr';
import { useMemo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import getDictionary from '@/utils/language';
import { Spin, Card, Row, Col, Modal, Form, Select, Button } from 'antd';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import classnames from 'classnames/bind';
import AdminSideBar from '@/components/AdminSideBar';
import Header from '@/components/Header';
import styles from '@/styles/pages/Accounts.module.scss';

const cx = classnames.bind(styles);

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default withPageAuthRequired(
  function AdminAccounts({ params: { lang } }) {
    const { data, isLoading, error } = useSWR('/api/admin/profile', fetcher);
    const users = useSWR('/api/admin/accounts', fetcher);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isSendingFinal, setIsSendingFinal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentValue, setCurrentValue] = useState(null);
    const [userForm] = Form.useForm();

    let selectedMenuItem = 1;
    console.log(users.data);

    const d = useMemo(() => {
      return getDictionary(lang, 'pages/Accounts');
    }, [lang]);

    const handleClickMenuItem = (key) => {
      selectedMenuItem = key;
    };

    const handleOpenCard = async (item) => {
      setIsDetailOpen(true);
      setSelectedItem(item);
      setCurrentValue(selectedItem?.role);
    };

    const handleCloseCard = () => {
      setIsDetailOpen(false);
      setCurrentValue(null);
      userForm.resetFields();
    };

    const handleFinalize = async (values) => {
      setIsSendingFinal(true);
      await fetch(`/en/api/admin/accounts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedItem.id,
          role: currentValue,
        }),
      });
      users.mutate();
      userForm.resetFields();
    };

    const onFinalizeFailed = (errorInfo) => {
      console.error('Failed:', errorInfo);
    };

    const handleChange = (value) => {
      console.log(`selected ${value}`);
      setCurrentValue(value);
    };

    const handleBan = async () => {
      await fetch(`/en/api/admin/accounts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedItem.id,
          isBanned: true,
        }),
      });
      users.mutate();
    };

    const handleUnban = async () => {
      await fetch(`/en/api/admin/accounts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedItem.id,
          isBanned: false,
        }),
      });
      users.mutate();
    };

    if (isLoading || users.isLoading) return <Spin size="large" />;
    if (error) return <div>{error?.message}</div>;

    return (
      <>
        <Header
          user={data.user}
          lang={lang}
        />
        <div className={cx('container')}>
          <AdminSideBar
            lang={lang}
            isInDashboard={true}
            handleClick={handleClickMenuItem}
          />
          <div className={cx('content')}>
            <Col className={cx('posts')}>
              {users.data.map((item, index) => (
                <Row key={index}>
                  <Card
                    className={cx('card-post')}
                    onClick={() => handleOpenCard(item)}
                  >
                    <div className={cx('card-post-info')}>
                      <img
                        className={cx('user-avatar')}
                        src={item.avatar}
                        alt="User"
                      />
                      <div>
                        <p>{item.id}</p>
                        <p>{item.email}</p>
                      </div>
                      {!item.isBanned && (
                        <p
                          className={
                            item.role === 'admin'
                              ? cx('pending-on-row')
                              : item.role === 'user'
                              ? cx('finalized-on-row')
                              : ''
                          }
                        >
                          {item.role}
                        </p>
                      )}
                      {item.isBanned && <p className={cx('banned-on-row')}>{d.banned}</p>}
                    </div>
                  </Card>
                </Row>
              ))}
            </Col>
            <Modal
              className={cx('review-details')}
              open={isDetailOpen}
              onCancel={handleCloseCard}
              footer={[]}
            >
              {selectedItem && (
                <>
                  <h2 className={cx('header')}>{d.info}</h2>
                  <div className={cx('review-header')}>
                    <p>
                      <span className={cx('fw-500')}>
                        {d.id}: {selectedItem.id}
                      </span>
                    </p>
                    <p>
                      {!selectedItem.isBanned && (
                        <span
                          className={
                            selectedItem.role === 'admin' && selectedItem.isBanned === false
                              ? cx('pending')
                              : selectedItem.role === 'user' && selectedItem.isBanned === false
                              ? cx('finalized')
                              : ''
                          }
                        >
                          {selectedItem.role}
                        </span>
                      )}
                      {selectedItem.isBanned && <span className={cx('banned')}>{d.banned}</span>}
                    </p>
                  </div>
                  <div className={cx('review-header')}>
                    <p>
                      <span className={cx('fw-500')}>Email: {selectedItem.email}</span>
                    </p>
                    <p>
                      <span className={cx('fw-500')}>
                        {d.joinDate}: {new Date(selectedItem.createdAt).toLocaleDateString('en-US')}
                      </span>
                    </p>
                  </div>

                  <Form
                    className={cx('user-form')}
                    name="userForm"
                    form={userForm}
                    onFinish={handleFinalize}
                    onFinishFailed={onFinalizeFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Role"
                      name="role"
                      initialValue={currentValue}
                    >
                      <Select
                        style={{
                          width: 120,
                        }}
                        onChange={handleChange}
                        options={[
                          {
                            value: 'Admin',
                            label: 'Admin',
                          },
                          {
                            value: 'User',
                            label: 'User',
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item className={cx('modal-btn')}>
                      {!selectedItem.isBanned && (
                        <Button
                          type="primary"
                          loading={isSendingFinal}
                          danger
                          onClick={handleBan}
                        >
                          {d.ban}
                        </Button>
                      )}
                      {selectedItem.isBanned && (
                        <Button
                          loading={isSendingFinal}
                          onClick={handleUnban}
                        >
                          {d.unban}
                        </Button>
                      )}
                      <Button
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        loading={isSendingFinal}
                        disabled={currentValue === selectedItem.role}
                      >
                        {d.change}
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              )}
            </Modal>
          </div>
        </div>
      </>
    );
  },
  {
    returnTo: '/admin/dashboard',
  },
);
