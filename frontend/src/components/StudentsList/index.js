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

const StudentsList = ({ lang, classId }) => {
  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const apiUrl = useMemo(() => `/en/api/classes/${classId}/students`, [classId]);
  const students = useSWR(apiUrl, fetcher);

  return (
    <div className={cx('wrap')}>
      <div className={cx('grade-information')}>
        <div className={cx('header')}>
          <p>{formattedDate}</p>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
          >
            <Button
              type="text"
              shape="circle"
            >
              <MoreOutlined />
            </Button>
          </Dropdown>
          <Modal
            className={cx('modal')}
            open={openEditModal}
            title={<h2 className={cx('modal-title')}>{d.editAssignment}</h2>}
            onCancel={handleChangeCancel}
            footer={[]}
          >
            <Form
              name="editForm"
              form={editForm}
              onFinish={handleChange}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                className={cx('form')}
                label="Assignment Name"
                name="assName"
                initialValue={gradeCompositionInfo?.assignmentName}
                rules={[
                  {
                    required: true,
                    message: d.assNameRequired,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={cx('form')}
                label="Grade Scale"
                name="scale"
                initialValue={gradeCompositionInfo?.assignmentGradeScale}
                rules={[
                  {
                    required: true,
                    message: d.gradeScaleRequired,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item className={cx('modal-btn')}>
                <Button
                  key="cancel"
                  type="white"
                  onClick={handleChangeCancel}
                >
                  {d.cancel}
                </Button>
                <Button
                  key="submit"
                  htmlType="submit"
                  type="primary"
                  loading={isChanging}
                >
                  {d.change}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <p className={cx('name')}>{gradeCompositionInfo.assignmentName}</p>
        {!isPublished && <p className={cx('draft')}>{d.draft}</p>}
        {isPublished && <p className={cx('draft')}>{d.published}</p>}
        <hr />
        <p>{gradeCompositionInfo.assignmentGradeScale * 10}%</p>
      </div>
      <div className={cx('grades')}>
        <div className={cx('grades-avg')}>{gradesAvg}</div>
        {students.map((student, index) => {
          return (
            <div
              key={student.studentId}
              className={cx('grade-row')}
              onClick={() => handleClickAGrade(index)}
              ref={(node) => (gradeCompositionRefs.current[index] = node)}
            >
              {!editing[index] && <p>{student.grade}</p>}
              {editing[index] && (
                <p className={cx('editing')}>
                  <Input onKeyDown={(event) => handleChangeEnter(event, index)} />
                  /100
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentsList;
