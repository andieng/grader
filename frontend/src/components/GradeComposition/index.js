'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import getDictionary from '@/utils/language';
import { Button, Input, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/GradeComposition.module.scss';

const cx = classnames.bind(styles);

const GradeComposition = ({ lang, students, setStudents, gradeCompostionInfo }) => {
  const [editing, setEditing] = useState(Array(students.length).fill(false));
  const [isPublic, setIsPublic] = useState(false);
  const gradeCompositionRefs = useRef([]);
  const fileInputRef = useRef(null);

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
      const updatedGrades = [...students];
      updatedGrades[index].grade = inputGrade;
      setStudents(updatedGrades);
    }
  };

  const handleDelete = () => {
    // ...
  };

  const handlePublic = () => {
    // call api, upload a post in general
    setIsPublic(true);
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

  const items = [
    {
      key: '1',
      label: (
        <a
          className={cx('option')}
          onClick={handlePublic}
        >
          {d.public}
        </a>
      ),
      disabled: isPublic,
    },
    {
      key: '2',
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
      key: '3',
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
      key: '4',
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
          <p>{gradeCompostionInfo.createdDate}</p>
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
        </div>
        <p className={cx('name')}>{gradeCompostionInfo.name}</p>
        {!isPublic && <p className={cx('draft')}>{d.draft}</p>}
        <hr />
        <p>{gradeCompostionInfo.scale}%</p>
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
