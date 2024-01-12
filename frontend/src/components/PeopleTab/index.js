'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Input, Card, Button, Row, Modal, message, Spin, Form, Divider } from 'antd';
import { CopyOutlined, UserAddOutlined } from '@ant-design/icons';
import getDictionary from '@/utils/language';
import classnames from 'classnames/bind';
import styles from '@/styles/components/PeopleTab.module.scss';
import ClassMenu from '@/components/ClassMenu';
import { generateInviteLink } from '@/utils/generator';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const PeopleTab = ({ lang, classId }) => {
  const [targetInvitation, setTargetInvitation] = useState('Teachers');
  const [showInvitationLink, setShowInvitationLink] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const apiUrl = useMemo(() => `/en/api/classes/${classId}/members`, [classId]);

  const classes = useSWR('/en/api/classes', fetcher);
  const members = useSWR(apiUrl, fetcher);

  const teachingClass = useMemo(() => {
    const filterTeachingClass = classes.data?.teaching?.filter((teaching) => teaching.classId === classId)[0];
    if (!filterTeachingClass) {
      return null;
    }
    return {
      ...filterTeachingClass,
      classInviteStudentLink: generateInviteLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/d`,
        classId,
        filterTeachingClass.classCode,
      ),
    };
  }, [classes]);
  const isStudent = useMemo(() => (teachingClass ? false : true), [teachingClass]);

  const { students, teachers } = useMemo(() => {
    return {
      students: members.data?.filter((student) => student.role === 'student'),
      teachers: members.data?.filter((student) => student.role === 'teacher'),
    };
  }, [members]);

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
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

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

  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}>
        {contextHolder}
        <Card
          className={cx('card')}
          bordered={false}
          title={
            <div className={cx('card-title')}>
              <h2>{d.teachers}</h2>
              <div className={cx('title-info')}>
                <span>
                  {teachers.length} teacher{teachers.length > 1 && 's'}
                </span>
                {!isStudent && (
                  <Button
                    type="text"
                    shape="circle"
                    className={cx('user-invite-btn')}
                    icon={<UserAddOutlined />}
                    onClick={() => showModal(d.inviteTeachers)}
                  />
                )}
              </div>
            </div>
          }
        >
          {teachers.map((item, index, teachers) => (
            <div key={index}>
              <Row>
                <div className={cx('card-post-info')}>
                  <img
                    className={cx('user-avatar')}
                    src={item.member.avatar}
                    alt="User"
                  />
                  <p>{item.member.email}</p>
                </div>
              </Row>
              {index !== teachers.length - 1 && <Divider className={cx('user-divider')} />}
            </div>
          ))}
        </Card>
        <Card
          bordered={false}
          className={cx('card')}
          title={
            <div className={cx('card-title')}>
              <h2>{d.students}</h2>
              <div className={cx('title-info')}>
                <span>
                  {students.length} student{students.length > 1 && 's'}
                </span>
                {!isStudent && (
                  <Button
                    type="text"
                    shape="circle"
                    className={cx('user-invite-btn')}
                    icon={<UserAddOutlined />}
                    onClick={() => showModal(d.inviteStudents)}
                  />
                )}
              </div>
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
                  <p>{item.member.email}</p>
                </div>
              </Row>
              {index !== students.length - 1 && <Divider className={cx('user-divider')} />}
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
                <p>{teachingClass?.classInviteStudentLink}</p>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => copyHandler(teachingClass?.classInviteStudentLink)}
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
                {d.invite}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PeopleTab;
