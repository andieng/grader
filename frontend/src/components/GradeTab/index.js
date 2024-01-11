'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import useSWR from 'swr';
import getDictionary from '@/utils/language';
import { Button, Spin, Modal, Input, Form } from 'antd';
import * as XLSX from 'xlsx';
import classnames from 'classnames/bind';
import styles from '@/styles/components/GradeTab.module.scss';
import ClassMenu from '@/components/ClassMenu';
import GradeComposition from '../GradeComposition';
import StudentsList from '../StudentsList';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const GradeTab = ({ lang, classId }) => {
  const fileInputRef = useRef(null);

  const [assignmentGrades, setAssignmentGrades] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createForm] = Form.useForm();
  const [isCreating, setIsCreating] = useState(false);
  // const [changedTime, setChangedTime] = useState(0);
  const apiUrl = `/en/api/classes/${classId}/grades`;
  const grades = useSWR(apiUrl, fetcher);
  const { data, isLoading, mutate: gradesMutate } = useSWR(apiUrl, fetcher);

  useEffect(() => {
    if (data?.assignmentGrades) {
      setAssignmentGrades([...data.assignmentGrades]);
    }
  }, [data]);

  console.log('Assignment grades changed:', data?.assignmentGrades);

  const mutate = () => {
    // grades.mutate();
    gradesMutate();

    //setAssignmentGrades([...grades.data?.assignmentGrades]);
    //setChangedTime(changedTime + 1);
  };

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('studentMappingFile', file);
      try {
        const response = await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/grades`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          console.log(response);
          // mutate to update list students component
        } else {
          throw new Error('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();

    const data = [['StudentId', 'FullName']];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };
    const fileData = s2ab(wbout);
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const fileName = 'template.xlsx';
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

  if (isLoading || d === null) return <Spin size="large" />;

  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}>
        {/* <Result
          status="warning"
          title={d.uploadNoti}
          extra={
            <>
              <Button
                type="primary"
                key="console"
                onClick={handleUploadClick}
              >
                <input
                  id={cx('upload-input')}
                  type="file"
                  accept=".xlsx,.csv"
                  ref={fileInputRef}
                  onChange={handleUpload}
                />
                {d.upload}
              </Button>{' '}
              <Button
                type="primary"
                key="console"
                onClick={handleDownload}
              >
                {d.download}
              </Button>
            </>
          }
        /> */}
        <Button
          className={cx('create-ass')}
          type="primary"
          key="console"
          onClick={() => showCreateModal()}
        >
          {d.createAss}
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
              label="Assignment Name"
              name="assName"
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
              rules={[
                {
                  required: true,
                  message: d.assNameRequired,
                },
              ]}
            >
              <Input />
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
        <div className={cx('assignments')}>
          {/* <StudentsList
            lang={lang}
            classId={classId}
          /> */}
          {assignmentGrades.map((assignment) => {
            return (
              <GradeComposition
                key={assignment.assignmentId}
                lang={lang}
                mutate={mutate}
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

export default GradeTab;
