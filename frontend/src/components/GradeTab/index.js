'use client';

import { useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { mutate } from 'swr';
import getDictionary from '@/utils/language';
import { Button, Result, Modal, Input, Form } from 'antd';
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

  const [students, setStudents] = useState([
    { studentId: '20120501', grade: 80 },
    { studentId: '20120502', grade: 70 },
    { studentId: '20120503', grade: 67 },
    { studentId: '20120504', grade: 90 },
    { studentId: '20120505', grade: 89 },
    { studentId: '20120506', grade: 72 },
    { studentId: '20120507', grade: 50 },
    { studentId: '20120508', grade: 65 },
    { studentId: '20120509', grade: 90 },
    { studentId: '20120510', grade: 71 },
  ]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [createForm] = Form.useForm();
  const [isCreating, setIsCreating] = useState(false);

  const apiUrl = `/en/api/classes/${classId}/assignments`;
  const assignments = useSWR(apiUrl, fetcher);

  console.log(assignments.data);

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = () => {
    // map grade with student id
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
    mutate(`/en/api/classes/${classId}/assignments`);
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

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
          {assignments.data?.map((assignment) => {
            return (
              <GradeComposition
                key={assignment.assignmentId}
                lang={lang}
                students={students}
                setStudents={setStudents}
                gradeCompositionInfo={assignment}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradeTab;
