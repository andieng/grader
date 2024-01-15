'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import getDictionary from '@/utils/language';
import { Button, Dropdown, Modal, Input, Form } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/GradeComposition.module.scss';

const cx = classnames.bind(styles);

const GradeComposition = ({ lang, grades, gradeCompositionInfo, mutate, role }) => {
  const [editing, setEditing] = useState(Array(grades.length).fill(false));
  const [isPublished, setisPublished] = useState(gradeCompositionInfo.isPublished);
  const gradeCompositionRefs = useRef([]);
  const fileInputRef = useRef(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm] = Form.useForm();
  const [isChanging, setIsChanging] = useState(false);

  const [assignmentGrades, setAssignmentGrades] = useState(grades);

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewForm] = Form.useForm();

  const [currentAssignment, setCurrentAssignment] = useState({});

  console.log(assignmentGrades);
  let gradesAvg = 0;
  if (assignmentGrades.length !== 0) {
    const totalGrade = assignmentGrades.reduce(
      (total, assignmentGrade) => total + (parseFloat(assignmentGrade.gradeValue) || 0),
      0,
    );
    gradesAvg = totalGrade / assignmentGrades.length;
  }

  const dateObj = new Date(gradeCompositionInfo.createdAt);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const formattedDate = `${month < 10 ? '0' + month : month}\/${day < 10 ? '0' + day : day}\/${year}`;

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

    const divClickListeners = assignmentGrades.map((_, index) => {
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
  }, [editing, assignmentGrades]);

  const handleClickAGrade = (index) => {
    if (role === 'teacher') {
      const updatedEditing = [...editing];
      updatedEditing[index] = true;
      setEditing(updatedEditing);
    }
  };

  const handleChangeEnter = async (event, index) => {
    if (event.key === 'Enter') {
      const updatedEditing = [...editing];
      updatedEditing[index] = false;
      setEditing(updatedEditing);

      if (!isNaN(event.target.value)) {
        const inputGrade = parseFloat(event.target.value);
        if (inputGrade >= 0 && inputGrade <= 10) {
          const updatedGrades = [...assignmentGrades];
          updatedGrades[index].gradeValue = inputGrade;
          setAssignmentGrades(updatedGrades);

          await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/grades`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              assignmentId: gradeCompositionInfo.assignmentId,
              studentId: updatedGrades[index].studentId,
              gradeValue: inputGrade,
            }),
          });
        }
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
    mutate();
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('assignmentGradeFile', file);
      formData.append('assignmentId', gradeCompositionInfo.assignmentId);
      try {
        const response = await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/grades/upload`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          mutate();
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
    mutate();
  };

  const handlePublish = async (values) => {
    await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/assignments/${gradeCompositionInfo.assignmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assName: values.assName, scale: values.scale, isPublished: true }),
    });
    mutate();
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

  const showReviewModal = () => {
    setOpenReviewModal(true);
  };

  const handleReviewCancel = () => {
    setOpenReviewModal(false);
    reviewForm.resetFields();
  };

  const handleSendReview = async (values) => {
    setIsChanging(true);
    await fetch(`/en/api/classes/${gradeCompositionInfo.classId}/grades/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: values.reason,
        expectedGrade: values.expectedGrade,
        currentGrade: currentAssignment.gradeValue,
        assignmentId: gradeCompositionInfo.assignmentId,
      }),
    });

    setIsChanging(false);
    setOpenReviewModal(false);
    reviewForm.resetFields();
    // mutate(); ???
  };

  const studentItems = [
    {
      key: '1',
      label: (
        <a
          className={cx('option')}
          onClick={() => showReviewModal()}
        >
          {d.reviewReq}
        </a>
      ),
    },
  ];

  return (
    <div className={cx('wrap')}>
      <div className={cx('grade-information')}>
        <div className={cx('header')}>
          <p className={cx('date-created')}>{formattedDate}</p>
          <Dropdown
            className={role === 'student' && cx('hidden')}
            menu={{
              items,
            }}
            placement="bottomRight"
          >
            <Button
              type="text"
              shape="circle"
              className={cx('more-btn')}
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
        <hr />
        <p className={cx('grade-scale')}>{gradeCompositionInfo.assignmentGradeScale * 10}%</p>
        {!isPublished && role === 'teacher' && <p className={cx('draft')}>{d.draft}</p>}
        {isPublished && role === 'teacher' && <p className={cx('draft')}>{d.published}</p>}
      </div>
      <div className={cx('grades')}>
        {role === 'teacher' && (
          <div className={cx('grades-avg')}>
            <p>{Math.round((gradesAvg + Number.EPSILON) * 100) / 100}</p>
          </div>
        )}
        {role === 'student' && <hr />}

        {assignmentGrades.map((assignmentGrade, index) => {
          return (
            <div
              key={assignmentGrade.studentId}
              className={cx('grade-row')}
              onClick={() => handleClickAGrade(index)}
              ref={(node) => (gradeCompositionRefs.current[index] = node)}
            >
              {editing[index] ? (
                <p className={cx('editing')}>
                  <Input onKeyDown={(event) => handleChangeEnter(event, index)} />
                  /10
                </p>
              ) : (
                assignmentGrade.gradeValue && (
                  <span className={cx('grade-cell')}>
                    <p>{Math.round((parseFloat(assignmentGrade.gradeValue) + Number.EPSILON) * 100) / 100}</p>
                    <Dropdown
                      className={role === 'teacher' && cx('hidden')}
                      menu={{
                        items: studentItems,
                      }}
                      placement="bottomRight"
                    >
                      <Button
                        type="text"
                        shape="circle"
                        className={cx('more-btn')}
                        onClick={() => setCurrentAssignment(assignmentGrade)}
                      >
                        <MoreOutlined />
                      </Button>
                    </Dropdown>
                  </span>
                )
              )}
              <Modal
                className={cx('modal')}
                open={openReviewModal}
                title={
                  <h2 className={cx('modal-title')}>
                    {d.reviewReq}: {gradeCompositionInfo?.assignmentName}
                  </h2>
                }
                onCancel={handleReviewCancel}
                footer={[]}
              >
                <Form
                  name="reviewForm"
                  form={reviewForm}
                  onFinish={handleSendReview}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                >
                  <Form.Item
                    className={cx('review-form')}
                    name="reason"
                    label={d.reason}
                    rules={[
                      {
                        required: true,
                        message: d.reasonRequired,
                      },
                    ]}
                  >
                    <Input placeholder="Aa" />
                  </Form.Item>
                  <Form.Item
                    className={cx('review-form')}
                    name="expectedGrade"
                    label={d.expectedGrade}
                    rules={[
                      {
                        required: true,
                        message: d.expectedGradeRequired,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item className={cx('modal-btn')}>
                    <Button
                      key="submit"
                      htmlType="submit"
                      type="primary"
                      loading={isChanging}
                    >
                      {d.send}
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradeComposition;
