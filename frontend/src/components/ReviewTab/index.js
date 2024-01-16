'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import getDictionary from '@/utils/language';
import { Card, Button, Row, Col, Spin, Modal, Form, Input, Result } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import classnames from 'classnames/bind';
import styles from '@/styles/components/ReviewTab.module.scss';
import ClassMenu from '../ClassMenu';

const cx = classnames.bind(styles);

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const ReviewTab = ({ lang, classId, role }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSendingFinal, setIsSendingFinal] = useState(false);
  const [reviewForm] = Form.useForm();
  const [commentForm] = Form.useForm();

  const reviews = useSWR(`/en/api/classes/${classId}/grades/review`, fetcher);

  const d = useMemo(() => {
    return getDictionary(lang, 'pages/ClassDetails');
  }, [lang]);

  const handleOpenCard = async (item) => {
    setIsDetailOpen(true);
    const response = await fetch(`/en/api/classes/${classId}/grades/review/${item.gradeReviewId}`);
    const responseData = await response.json();
    setSelectedItem(responseData);
  };

  const handleCloseCard = () => {
    setIsDetailOpen(false);
    reviewForm.resetFields();
  };

  const handleFinalize = async (values) => {
    setIsSendingFinal(true);
    await fetch(`/en/api/classes/${classId}/grades/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        finalGrade: values.finalGrade,
        status: 'finalized',
        gradeReviewId: selectedItem.gradeReviewId,
      }),
    });
    setIsSendingFinal(false);
    setIsDetailOpen(false);
    reviews.mutate();
    reviewForm.resetFields();
  };

  const onFinalizeFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const handleComment = async (values) => {
    if (values.comment !== '') {
      setIsCommenting(true);
      await fetch(`/en/api/classes/${classId}/grades/review/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: values.comment, gradeReviewId: selectedItem.gradeReviewId }),
      });
      setIsCommenting(false);
      reviews.mutate();
    }
    commentForm.resetFields();
  };

  const onCommentFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  if (reviews.isLoading) return <Spin size="large" />;

  if (reviews?.data.error) {
    return (
      <div className={cx('wrap')}>
        <ClassMenu lang={lang}></ClassMenu>
        <Result
          status="warning"
          title={d.mustMappingNoti}
        />
      </div>
    );
  }

  return (
    <div className={cx('wrap')}>
      <ClassMenu lang={lang}></ClassMenu>
      <div className={cx('container')}>
        <Col className={cx('posts')}>
          {reviews?.data.map((item, index) => (
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
                    <p>{item.assignment.assignmentName}</p>
                    <p>{item.studentUser.studentId}</p>
                  </div>
                </Card>
              </Row>
            ))
          ) : (
            <Result
              className={cx('no-data')}
              icon={
                <img
                  src="https://www.basilica.hr/build/images/background/no-results-bg.2d2c6ee3.png"
                  height="200"
                />
              }
              title={d.noData}
            />
          )}
        </Col>
        {reviews.data.length > 0 && (
          <Modal
            className={cx('review-details')}
            open={isDetailOpen}
            onCancel={handleCloseCard}
            footer={[]}
          >
            {selectedItem && (
              <>
                <h2 className={cx('header')}>{selectedItem.assignment.assignmentName}</h2>
                <div className={cx('review-header')}>
                  <p>
                    <span className={cx('fw-500')}>{d.from}: </span>
                    {selectedItem.studentUser.studentId}
                  </p>
                  <p>
                    <span
                      className={
                        selectedItem.status === 'pending'
                          ? cx('pending')
                          : selectedItem.status === 'finalized'
                          ? cx('finalized')
                          : ''
                      }
                    >
                      {selectedItem.status}
                    </span>
                  </p>
                </div>
                <p className={cx('explanation')}>
                  <span className={cx('fw-500')}>{d.reason}: </span>
                  {selectedItem.studentExplanation}
                </p>
                <p>
                  <span className={cx('fw-500')}>{d.currentGrade}: </span>
                  {selectedItem.currentGrade}
                </p>
                <p>
                  <span className={cx('fw-500')}>{d.expectedGrade}: </span>
                  {selectedItem.expectedGrade}
                </p>
                <div className={cx('comments')}>
                  <Col className={cx('comment')}>
                    {selectedItem.gradeReviewComments.map((cmt, index) => {
                      const createdAtDate = new Date(cmt.createdAt);
                      const day = createdAtDate.getDate();
                      const month = createdAtDate.getMonth() + 1;
                      const year = createdAtDate.getFullYear();
                      const formattedDate = `${month}/${day}/${year}`;
                      return (
                        <Row key={index}>
                          <Card className={cx('comment-line')}>
                            <div className={cx('comment-line-info')}>
                              <img
                                className={cx('cmt-avatar')}
                                src={cmt.user.avatar}
                                alt="User"
                              />
                              <div>
                                <p>{cmt.user.fullName}</p>
                                <p>{cmt.content}</p>
                              </div>
                              <p>{formattedDate}</p>
                            </div>
                          </Card>
                        </Row>
                      );
                    })}
                  </Col>
                  {selectedItem.status === 'pending' && (
                    <Form
                      name="commentForm"
                      form={commentForm}
                      onFinish={handleComment}
                      onFinishFailed={onCommentFailed}
                      autoComplete="off"
                      className={cx('cmt-Form')}
                    >
                      <Form.Item name="comment">
                        <Input placeholder="Aa" />
                      </Form.Item>
                      <Form.Item className={cx('modal-btn')}>
                        <Button
                          key="submit"
                          htmlType="submit"
                          type="default"
                          loading={isCommenting}
                        >
                          {d.comment}
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </div>
                {selectedItem.status === 'finalized' && (
                  <p className={cx('final-grade')}>
                    {d.finalGrade}: {selectedItem.finalGrade}
                  </p>
                )}
                {selectedItem.status === 'pending' && role === 'teacher' && (
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
                      <Input placeholder={d.enterFinalGrade} />
                    </Form.Item>
                    <Form.Item className={cx('modal-btn')}>
                      <Button
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        loading={isSendingFinal}
                      >
                        {d.finalize}
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </>
            )}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ReviewTab;
