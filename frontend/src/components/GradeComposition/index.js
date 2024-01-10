'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { mutate } from 'swr';
import * as XLSX from 'xlsx';
import getDictionary from '@/utils/language';
import { Button, Dropdown, Modal, Input, Form } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/GradeComposition.module.scss';

const cx = classnames.bind(styles);

const GradeComposition = ({ lang, grades, gradeCompositionInfo }) => {
  const [editing, setEditing] = useState(Array(grades.length).fill(false));
  const [isPublished, setisPublished] = useState(gradeCompositionInfo.isPublished);
  const gradeCompositionRefs = useRef([]);
  const fileInputRef = useRef(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm] = Form.useForm();
  const [isChanging, setIsChanging] = useState(false);

  const [students, setStudents] = useState(grades);

  let gradesAvg = 0;
  if (students.length !== 0) {
    gradesAvg = students.reduce((total, student) => total + student.gradeValue, 0) / students.length;
  }

  const dateObj = new Date(gradeCompositionInfo.createdAt);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${year}\/${month < 10 ? '0' + month : month}\/${day < 10 ? '0' + day : day}`;

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  useEffect(() => {
    const handleClickOutside = (event, index) => {
      if (
        gradeCompositionRefs.current[index] &&
        !gradeCompositionRefs.current[index].contains(event.target) &&
        editing[index]
      ) {
        const updatedEditing = [...editing];
        updatedEditing[index] = false;
        setEditing(updatedEditing);
      }
    };

    const divClickListeners = students.map((_, index) => {
      return (event) => handleClickOutside(event, index);
    });

    divClickListeners.forEach((listener, index) => {
      document.addEventListener('click', listener);
    });

    return () => {
      divClickListeners.forEach((listener, index) => {
        document.removeEventListener('click', listener);
      });
    };
  }, [editing, students]);

  const handleClickAGrade = (index) => {
    const updatedEditing = [...editing];
    updatedEditing[index] = true;
    setEditing(updatedEditing);
  };

  const handleChangeEnter = (event, index) => {
    if (event.key === 'Enter') {
      const updatedEditing = [...editing];
      updatedEditing[index] = false;
      setEditing(updatedEditing);

      const inputGrade = parseInt(event.target.value);
      if (typeof inputGrade === Number) {
        const updatedGrades = [...students];
        updatedGrades[index].grade = inputGrade;
        setStudents(updatedGrades);
        // call api
      }
    }
  };

  const handleDelete = async () => {
    await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/assignments/${gradeCompositionInfo.assignmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    mutate(`/en/api/classes/${gradeCompositionInfo.classId}/assignments`);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignmentId', gradeCompositionInfo.assignmentId);
      for (var pair of formData.entries()) {
        console.log(pair[1]);
      }
      try {
        const response = await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/grades`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (response.ok) {
          console.log(response);
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

    const data = [['StudentId', 'Grade']];

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
    setOpenEditModal(true);
  };

  const handleChangeCancel = () => {
    setOpenEditModal(false);
    editForm.resetFields();
  };

  const handleChange = async (values) => {
    setIsChanging(true);
    await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/assignments/${gradeCompositionInfo.assignmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assName: values.assName, scale: values.scale, isPublished: isPublished }),
    });
    setIsChanging(false);
    setOpenEditModal(false);
    editForm.resetFields();
    mutate(`/en/api/classes/${gradeCompositionInfo.classId}/assignments`);
  };

  const handlePublish = async (values) => {
    await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/assignments/${gradeCompositionInfo.assignmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assName: values.assName, scale: values.scale, isPublished: true }),
    });
    mutate(`/en/api/classes/${gradeCompositionInfo.classId}/assignments`);
    setisPublished(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const items = [
    {
      key: '1',
      label: (
        <a
          className={cx('option')}
          onClick={() => showCreateModal()}
        >
          {d.edit}
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          className={cx('option')}
          onClick={handlePublish}
        >
          {d.publish}
        </a>
      ),
      disabled: isPublished,
    },
    {
      key: '3',
      label: (
        <a
          className={cx('option')}
          onClick={handleUploadClick}
          type="file"
          accept=".xlsx,.csv"
        >
          <input
            id={cx('upload-input')}
            type="file"
            accept=".xlsx,.csv"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          {d.upload}
        </a>
      ),
    },
    {
      key: '4',
      label: (
        <a
          className={cx('option')}
          onClick={handleDownload}
        >
          {d.download}
        </a>
      ),
    },
    {
      key: '5',
      label: (
        <a
          className={cx('option')}
          onClick={handleDelete}
        >
          {d.delete}
        </a>
      ),
    },
  ];

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

export default GradeComposition;
