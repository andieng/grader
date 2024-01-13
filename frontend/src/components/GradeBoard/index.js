'use client';

import { useMemo, useState, useEffect } from 'react';
import useSWR from 'swr';
import getDictionary from '@/utils/language';
import { Button, Spin, Modal, Input, Form } from 'antd';
import classnames from 'classnames/bind';
import styles from '@/styles/components/GradeBoard.module.scss';
import ClassMenu from '@/components/ClassMenu';
import GradeComposition from '@/components/GradeComposition';
import StudentList from '@/components/StudentList';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const formatAssignmentGrades = (assignmentGrades, students) => {
  assignmentGrades.forEach((assignmentGrade) => {
    students.forEach((student) => {
      if (!assignmentGrade.grades.find((gradeItem) => gradeItem.studentId === student.studentId)) {
        assignmentGrade.grades.push({
          studentId: student.studentId,
          gradeValue: null,
        });
      }
    });
    assignmentGrade.grades.sort((a, b) => (a.studentId > b.studentId ? 1 : b.studentId > a.studentId ? -1 : 0));
  });
};

const GradeBoard = ({ lang, classId, students, role }) => {
  const [assignmentGrades, setAssignmentGrades] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createForm] = Form.useForm();
  const [isCreating, setIsCreating] = useState(false);
  const apiUrl = `/en/api/classes/${classId}/grades`;
  const { data, isLoading, mutate: gradesMutate } = useSWR(apiUrl, fetcher);
  const [refetch, setRefetch] = useState(false);
  const [numRefetch, setNumRefetch] = useState(0);

  useEffect(() => {
    if (data?.assignmentGrades) {
      setAssignmentGrades((prev) => [...data.assignmentGrades]);
      formatAssignmentGrades(data.assignmentGrades, students);
      setNumRefetch(numRefetch + 1);
    }
  }, [refetch, data?.assignmentGrades]);

  const mutate = () => {
    gradesMutate();
    setRefetch(!refetch);
  };

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const showCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCreateCancel = () => {
    setOpenCreateModal(false);
    createForm.resetFields();
  };

  const handleCreate = async (values) => {
    setIsCreating(true);

    await fetch(`/en/api/classes/${classId}/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assName: values.assName, scale: values.scale }),
    });

    setIsCreating(false);
    setOpenCreateModal(false);
    createForm.resetFields();
    mutate();
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const handleExportGrades = () => {
    const assignmentNames = assignmentGrades.map((assignment) => assignment.assignmentName);

    const headerLine = ['StudentId', ...assignmentNames].join(', ');

    // Creating lines for each student
    const studentLines = students.map((student) => {
      const studentGrades = assignmentGrades.map((assignment) => {
        const grade = assignment.grades.find((gradeItem) => gradeItem.studentId === student.studentId);
        return grade ? grade.gradeValue : 'N/A';
      });

      return [student.studentId, ...studentGrades].join(', ');
    });

    const exportData = [headerLine, ...studentLines].join('\n');

    const blob = new Blob([exportData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'grades_export.csv';
    link.click();
  };

  if (isLoading || d === null) return <Spin size="large" />;

  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}>
        {role === 'teacher' && (
          <>
            <Button
              className={cx('create-ass')}
              type="primary"
              key="console"
              onClick={() => showCreateModal()}
            >
              {d.createAss}
            </Button>
            <Button
              className={cx('create-ass')}
              type="default"
              key="console"
              onClick={handleExportGrades}
            >
              {d.exportGrades}
            </Button>
            <Modal
              className={cx('modal')}
              open={openCreateModal}
              title={<h2 className={cx('modal-title')}>{d.createAss}</h2>}
              onCancel={handleCreateCancel}
              footer={[]}
            >
              <Form
                name="createForm"
                form={createForm}
                onFinish={handleCreate}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  className={cx('form')}
                  label={d.assignmentName}
                  name="assName"
                  rules={[
                    {
                      required: true,
                      message: d.assNameRequired,
                    },
                  ]}
                >
                  <Input placeholder={d.enterAssName} />
                </Form.Item>
                <Form.Item
                  className={cx('form')}
                  label={d.gradeScale}
                  name="scale"
                  rules={[
                    {
                      required: true,
                      message: d.gradeScaleRequired,
                    },
                  ]}
                >
                  <Input placeholder={d.enterGradeScale} />
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
          </>
        )}

        <div
          className={cx('assignments')}
          key={numRefetch}
        >
          <StudentList
            lang={lang}
            students={students}
            role={role}
          />
          {assignmentGrades.map((assignment) => {
            if (role === 'student' && !assignment.isPublished) {
              return null;
            }
            return (
              <GradeComposition
                key={assignment.assignmentId}
                lang={lang}
                mutate={mutate}
                refetch
                role={role}
                grades={assignment.grades}
                gradeCompositionInfo={{
                  assignmentId: assignment.assignmentId,
                  assignmentName: assignment.assignmentName,
                  assignmentGradeScale: assignment.assignmentGradeScale,
                  isPublished: assignment.isPublished,
                  lineNumber: assignment.lineNumber,
                  classId: assignment.classId,
                  createdAt: assignment.createdAt,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradeBoard;
