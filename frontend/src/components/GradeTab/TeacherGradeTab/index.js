'use client';

import { useMemo, useRef } from 'react';
import useSWR from 'swr';
import getDictionary from '@/utils/language';
import { Button, Spin, Result } from 'antd';
import * as XLSX from 'xlsx';
import classnames from 'classnames/bind';
import ClassMenu from '@/components/ClassMenu';
import styles from '@/styles/components/TeacherGradeTab.module.scss';
import GradeBoard from '@/components/GradeBoard';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const TeacherGradeTab = ({ lang, classId }) => {
  const fileInputRef = useRef(null);
  const apiUrl = useMemo(() => `/en/api/classes/${classId}/student-mapping`, [classId]);
  const { data, isLoading, error, mutate } = useSWR(apiUrl, fetcher);

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
        const response = await fetch(`/en/api/classes/${classId}/student-mapping`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          console.log(response);
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

  if (isLoading || data?.length < 0) return <Spin size="large" />;

  if (error) {
    console.error(error);
    return (
      <Result
        title="Error"
        subTitle={d.somethingWentWrong}
      />
    );
  }
  if (data?.length > 0) {
    return (
      <GradeBoard
        lang={lang}
        classId={classId}
        students={data}
        role="teacher"
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
        title={d.uploadMappingFile}
        subTitle={d.uploadNoti}
        extra={
          <>
            <Button
              key="download"
              onClick={handleDownload}
            >
              {d.download}
            </Button>
            <Button
              type="primary"
              key="upload"
              onClick={handleUploadClick}
            >
              <input
                id={cx('upload-input')}
                type="file"
                accept=".xlsx,.csv"
                ref={fileInputRef}
                onChange={handleUpload}
              />
              {d.uploadMappingFile}
            </Button>
          </>
        }
      />
    </div>
  );
};

export default TeacherGradeTab;
