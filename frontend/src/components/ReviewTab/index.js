'use client';

import { useMemo, useState } from 'react';
import getDictionary from '@/utils/language';
import { Card, Button, Row, Col, Spin, Modal, Form, Input } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/ReviewTab.module.scss';
import ClassMenu from '../ClassMenu';

const cx = classnames.bind(styles);

const DUMMY_CARDS = [
  {
    assignmentName: 'Exam 1',
    studentId: '20120206',
    status: 'Pending',
    currentGrade: 6,
    expectedGrade: 6.5,
    finalGrade: null,
    studentExplanation: 'Chấm sai câu 1',
    avatar: '/user.png',
    fullName: 'Nguyễn Ngọc Thùy',
    comments: [
      {
        avatar: '/user.png',
        fullName: 'Nguyễn Ngọc Thùy',
        content: 'Xin hãy giúp em!',
        createdAt: '2024/1/10',
      },
      {
        avatar: '/user.png',
        fullName: 'You',
        content: 'Okay!',
        createdAt: '2024/1/11',
      },
    ],
  },
  {
    assignmentName: 'Exam 2',
    studentId: '20120206',
    status: 'Finalized',
    currentGrade: 6,
    expectedGrade: 6.5,
    finalGrade: 6.5,
    studentExplanation: 'Chấm sai câu 1',
    avatar: '/user.png',
    fullName: 'Nguyễn Ngọc Thùy',
    comments: [
      {
        avatar: '/user.png',
        fullName: 'Nguyễn Ngọc Thùy',
        content: 'Xin hãy giúp em!',
        createdAt: '2024/1/10',
      },
      {
        avatar: '/user.png',
        fullName: 'You',
        content: 'Okay!',
        createdAt: '2024/1/11',
      },
    ],
  },
  {
    assignmentName: 'Exam 3',
    studentId: '20120206',
    status: 'Pending',
    currentGrade: 6,
    expectedGrade: 6.5,
    finalGrade: null,
    studentExplanation: 'Chấm sai câu 1',
    avatar: '/user.png',
    fullName: 'Nguyễn Ngọc Thùy',
    comments: [
      {
        avatar: '/user.png',
        fullName: 'Nguyễn Ngọc Thùy',
        content: 'Xin hãy giúp em!',
      },
    ],
  },
  {
    assignmentName: 'Exam 2',
    studentId: '20120589',
    status: 'Pending',
    currentGrade: 6,
    expectedGrade: 6.5,
    finalGrade: null,
    studentExplanation: 'Chấm sai câu 1',
    avatar: '/user.png',
    fullName: 'Nguyễn Ngọc Thùy',
    comments: [
      {
        avatar: '/user.png',
        fullName: 'Nguyễn Ngọc Thùy',
        content: 'Xin hãy giúp em!',
      },
    ],
  },
  {
    assignmentName: 'Exam 1',
    studentId: '20120589',
    status: 'Pending',
    currentGrade: 6,
    expectedGrade: 6.5,
    finalGrade: null,
    studentExplanation: 'Chấm sai câu 1',
    avatar: '/user.png',
    fullName: 'Nguyễn Ngọc Thùy',
    comments: [
      {
        avatar: '/user.png',
        fullName: 'Nguyễn Ngọc Thùy',
        content: 'Xin hãy giúp em!',
      },
    ],
  },
  {
    assignmentName: 'Exam 1',
    studentId: '20120581',
    status: 'Pending',
    currentGrade: 6,
    expectedGrade: 6.5,
    finalGrade: null,
    studentExplanation: 'Chấm sai câu 1',
    avatar: '/user.png',
    fullName: 'Nguyễn Ngọc Thùy',
    comments: [
      {
        avatar: '/user.png',
        fullName: 'Nguyễn Ngọc Thùy',
        content: 'Xin hãy giúp em!',
      },
    ],
  },
];

const ReviewTab = ({ lang, classId }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [reviewForm] = Form.useForm();
  const [commentForm] = Form.useForm();

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const handleOpenCard = (item) => {
    setIsDetailOpen(true);
    setSelectedItem(item);
  };

  const handleCloseCard = () => {
    setIsDetailOpen(false);
    reviewForm.resetFields();
  };

  const handleFinalize = (values) => {
    setIsChanging(true);
    // change status, update final grade

    setIsChanging(false);
    setIsDetailOpen(false);
    reviewForm.resetFields();
  };

  const onFinalizeFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const handleComment = (values) => {
    if (values.comment !== '') {
      // mutate cmts
    }
    commentForm.resetFields();
  };

  const onCommentFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}>
        <Col className={cx('posts')}>
          {DUMMY_CARDS.map((item, index) => (
            <Row key={index}>
              <Card
                className={cx('card-post')}
                onClick={() => handleOpenCard(item)}
              >
                <div className={cx('card-post-info')}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<QuestionOutlined />}
                  />
                  <div>
                    <p>{item.assignmentName}</p>
                    <p>{item.studentId}</p>
                  </div>
                  <p>{item.status}</p>
                </div>
              </Card>
            </Row>
          ))}
        </Col>
        <Modal
          className={cx('review-details')}
          open={isDetailOpen}
          onCancel={handleCloseCard}
          footer={[]}
        >
          {selectedItem && (
            <>
              <h2>
                {d.reviewDetails}: {selectedItem.assignmentName}
              </h2>
              <div className={cx('review-header')}>
                <p>
                  {d.from}: {selectedItem.studentId} - {selectedItem.fullName}
                </p>
                <p>
                  {d.status}:{' '}
                  <span
                    className={
                      selectedItem.status === 'Pending'
                        ? cx('redStatus')
                        : selectedItem.status === 'Finalized'
                        ? cx('greenStatus')
                        : ''
                    }
                  >
                    {selectedItem.status}
                  </span>
                </p>
              </div>
              <p>
                {d.reason}: {selectedItem.studentExplanation}
              </p>
              <div className={cx('review-header')}>
                <p>
                  {d.currentGrade}: {selectedItem.currentGrade}
                </p>
                <p>
                  {d.expectedGrade}: {selectedItem.expectedGrade}
                </p>
              </div>
              <div className={cx('comments')}>
                <Col className={cx('comment')}>
                  {selectedItem.comments.map((cmt, index) => (
                    <Row key={index}>
                      <Card className={cx('comment-line')}>
                        <div className={cx('comment-line-info')}>
                          <img
                            className={cx('cmt-avatar')}
                            src={cmt.avatar}
                            alt="User"
                          />
                          <div>
                            <p>{cmt.fullName}</p>
                            <p>{cmt.content}</p>
                          </div>
                          <p>{cmt.createdAt}</p>
                        </div>
                      </Card>
                    </Row>
                  ))}
                </Col>
                {selectedItem.status === 'Pending' && (
                  <Form
                    name="commentForm"
                    form={commentForm}
                    onFinish={handleComment}
                    onFinishFailed={onCommentFailed}
                    autoComplete="off"
                    className={cx('cmt-Form')}
                  >
                    <Form.Item name="comment">
                      <Input />
                    </Form.Item>
                    <Form.Item className={cx('modal-btn')}>
                      <Button
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        loading={isChanging}
                      >
                        {d.comment}
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </div>
              {selectedItem.status === 'Finalized' && (
                <p className={cx('final-grade')}>
                  {d.finalGrade}: {selectedItem.finalGrade}
                </p>
              )}
              {selectedItem.status === 'Pending' && (
                <Form
                  name="reviewForm"
                  form={reviewForm}
                  onFinish={handleFinalize}
                  onFinishFailed={onFinalizeFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label={d.finalGrade}
                    name="finalGrade"
                    rules={[
                      {
                        required: true,
                        message: d.finalGradeRequired,
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
                      {d.finalize}
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReviewTab;
