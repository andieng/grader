'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import getDictionary from '@/utils/language';
import { Button, Dropdown, Modal, Input, Form } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/GradeComposition.module.scss';

const cx = classnames.bind(styles);

const GradeComposition = ({ lang, students, setStudents, gradeCompositionInfo }) => {
  const [editing, setEditing] = useState(Array(students.length).fill(false));
  const [isPublished, setisPublished] = useState(gradeCompositionInfo.isPublished);
  const gradeCompositionRefs = useRef([]);
  const fileInputRef = useRef(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm] = Form.useForm();
  const [isChanging, setIsChanging] = useState(false);

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
    await fetch(`/en/api/classes/${classId}/assignments/${gradeCompositionInfo.assignmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    mutate(`/en/api/classes/${classId}/assignments`);
  };

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
    await fetch(`/en/api/classes/${classId}/assignments`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assName: values.className, scale: values.scale, isPublished: isPublished }),
    });
    mutate(`/en/api/classes/${classId}/assignments`);
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
          onClick={handleChange}
        >
          {d.public}
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
                rules={[
                  {
                    required: true,
                    message: d.assNameRequired,
                  },
                ]}
              >
                <Input defaultValue={gradeCompositionInfo.assignmentName} />
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
                <Input defaultValue={gradeCompositionInfo.assignmentGradeScale} />
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
        <hr />
        <p>{gradeCompositionInfo.assignmentGradeScale * 10}%</p>
      </div>
      <div className={cx('grades')}>
        <div className={cx('grades-avg')}>80</div>
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
