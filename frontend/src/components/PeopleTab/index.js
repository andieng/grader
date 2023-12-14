'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Input, Card, Button, Row, Modal, message, Spin, Form } from 'antd';
import { MoreOutlined, CopyOutlined, UserAddOutlined } from '@ant-design/icons';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/PeopleTab.module.scss';
import { usePathname } from 'next/navigation';

const cx = classnames.bind(styles);

// const fetcher = async ({ url, args }) => {
//   // const response = await fetch(`${url}?role=${args}`);
//   const response = await fetch(`${url}?role=students`);
//   return response.json();
// };
const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const PeopleTab = ({ lang }) => {
  const [targetInvitation, setTargetInvitation] = useState('Teachers');
  const [showInvitationLink, setShowInvitationLink] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const pathname = usePathname();
  let parts = pathname.split('/');
  let classId = parts[parts.length - 1];

  const onFinish = async (values) => {
    setLoading(true);

    let role = 'teacher';
    const email = values.email;

    if (showInvitationLink) role = 'student';

    const response = await fetch('/api/classes/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ classId, role, email }),
    });

    setLoading(false);
    setOpen(false);
    form.resetFields();
    // mutate('/api/classes');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetail');
  }, [lang]);

  const params = {
    classId,
  };
  const apiUrl = `/en/api/classes/members?${new URLSearchParams(params)}`;

  const classes = useSWR('/api/classes', fetcher);
  const members = useSWR(apiUrl, fetcher);
  const curClass = classes.data.teaching?.filter((teaching) => teaching.classId === classId)[0];

  if (curClass?.classInviteStudentLink) {
    if (isStudent === true) setIsStudent(false);
  }

  console.log(classes.data);

  const copyHandler = (link) => {
    navigator.clipboard.writeText(link);
    messageApi.open({
      type: 'success',
      content: `${d.copied}`,
    });
  };

  const showModal = (title) => {
    if (title === d.inviteTeachers) setShowInvitationLink(false);
    else if (title === d.inviteStudents) setShowInvitationLink(true);
    setOpen(true);
    setTargetInvitation(title);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  if (members.isLoading || classes.isLoading || d === null) return <Spin size="large" />;
  if (classes.error || members.error)
    return (
      <div>
        {classes.error?.message}
        {members.error?.message}
      </div>
    );

  console.log(members.data);

  const students = members.data?.filter((student) => student.role === 'student');
  const teachers = members.data?.filter((student) => student.role === 'teacher');

  return (
    <div className={cx('container')}>
      {contextHolder}
      <Card
        className={cx('card')}
        title={
          <div className={cx('card-title')}>
            <h2>{d.teachers}</h2>
            {!isStudent && (
              <Button
                type="primary"
                shape="circle"
                icon={<UserAddOutlined />}
                onClick={() => showModal(d.inviteTeachers)}
              />
            )}
          </div>
        }
      >
        {teachers.map((item, index) => (
          <div key={index}>
            <Row>
              <div className={cx('card-post-info')}>
                <img
                  className={cx('user-avatar')}
                  src={item.member.avatar}
                  alt="User"
                />
                <p>{item.member.name}</p>
                <Button
                  type="text"
                  shape="circle"
                  size="large"
                  icon={<MoreOutlined className={cx('more-btn')} />}
                />
              </div>
            </Row>
            {index !== teachers.length - 1 && <hr className={cx('horizontal-line')} />}{' '}
          </div>
        ))}
      </Card>
      <Card
        className={cx('card')}
        title={
          <div className={cx('card-title')}>
            <h2>{d.students}</h2>
            {!isStudent && (
              <Button
                type="primary"
                shape="circle"
                icon={<UserAddOutlined />}
                onClick={() => showModal(d.inviteStudents)}
              />
            )}
          </div>
        }
      >
        {students.map((item, index) => (
          <div key={index}>
            <Row>
              <div className={cx('card-post-info')}>
                <img
                  className={cx('user-avatar')}
                  src={item.member.avatar}
                  alt="User"
                />
                <p>{item.member.name}</p>
                <Button
                  type="text"
                  shape="circle"
                  size="large"
                  icon={<MoreOutlined className={cx('more-btn')} />}
                />
              </div>
            </Row>
            {index !== students.length - 1 && <hr className={cx('horizontal-line')} />}{' '}
          </div>
        ))}
      </Card>
      <Modal
        className={cx('invitation-modal')}
        open={open}
        title={<h2>{targetInvitation}</h2>}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        {showInvitationLink && (
          <>
            <h4>{d.inviteUrl}</h4>
            <div className={cx('invitation-link')}>
              <p>{curClass?.classInviteStudentLink}</p>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => copyHandler(curClass?.classInviteStudentLink)}
              ></Button>
            </div>
          </>
        )}
        <Form
          name="form"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: d.requiredMail,
              },
            ]}
          >
            <Input placeholder={d.inviteInput} />
          </Form.Item>
          <Form.Item className={cx('invite-btn')}>
            <Button
              key="back"
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
              {d.invite}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PeopleTab;
