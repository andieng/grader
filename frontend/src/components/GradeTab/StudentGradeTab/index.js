'use client';

import { useMemo, useState, useEffect } from 'react';
import getDictionary from '@/utils/language';
import { Button, Result, Form, Input, Alert, Spin } from 'antd';
import classnames from 'classnames/bind';
import ClassMenu from '@/components/ClassMenu';
import GradeBoard from '@/components/GradeBoard';
import styles from '@/styles/components/StudentGradeTab.module.scss';

const cx = classnames.bind(styles);

const StudentGradeTab = ({ lang, classId, member }) => {
  const [form] = Form.useForm();
  const [isMapping, setIsMapping] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  useEffect(() => {
    async function fetchStudent() {
      if (member.studentId) {
        const response = await fetch(`/en/api/classes/${classId}/student-mapping/${member.studentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.error) {
            setStudent(data);
          }
        }
      }
    }
    fetchStudent();
  }, [member]);

  const onFinish = async (values) => {
    setIsMapping(true);
    const response = await fetch(`/en/api/classes/${classId}/student-mapping/${values.studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.error) {
        console.error(data);
        setError(data.error);
      } else {
        setStudent(data);
      }
    }
    setIsMapping(false);
    form.resetFields();
  };
  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  // Loading
  if (member.studentId && !student) {
    return <Spin size="large" />;
  }

  if (student) {
    return (
      <GradeBoard
        lang={lang}
        classId={classId}
        students={[student]}
        role="student"
      />
    );
  }

  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <Result
        status="warning"
        className={cx('no-data')}
        icon={
          <img
            src="https://www.basilica.hr/build/images/background/no-results-bg.2d2c6ee3.png"
            height="160"
          />
        }
        title={d.mapStudentId}
        subTitle={d.mapStudentIdMessage}
      />
      <div className={cx('form-wrapper')}>
        <Form
          form={form}
          name="mapForm"
          className={cx('form')}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="studentId"
            rules={[
              {
                required: true,
                message: d.studentIdRequired,
              },
            ]}
          >
            <Input placeholder={d.enterStudentId} />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            loading={isMapping}
          >
            {d.map}
          </Button>
          {error && (
            <Alert
              className={cx('alert')}
              message="Error"
              description={error}
              type="error"
              showIcon
            />
          )}
        </Form>
      </div>
    </div>
  );
};

export default StudentGradeTab;
