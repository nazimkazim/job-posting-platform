import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, Card, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "react-query";
import "./Vacancies.css"; // Add custom styles if needed
import { apiClient } from "./api/aixos";

interface JobPost {
  id: number;
  title: string;
  description: string;
  salaryRange: string;
  location: string;
}

const fetchJobPosts = async () => {
  const { data } = await apiClient.get("/api/jobs/jobposts");
  return data;
};

export const Vacancies: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [form] = Form.useForm();

  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("email") || "";

  const queryClient = useQueryClient();

  const { data: jobPosts, isLoading } = useQuery("jobposts", fetchJobPosts);

  const mutation = useMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (applicationData: any) =>
      apiClient.post(
        `/api/jobs/jobposts/${selectedJob?.id}/applications`,
        applicationData
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobposts");
        setIsModalVisible(false);
        form.resetFields();
      },
    }
  );

  const showApplyModal = (job: JobPost) => {
    form.setFieldsValue({
      applicantName: userName,
      applicantEmail: userEmail,
    });
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleApply = (values: {
    applicantName: string;
    applicantEmail: string;
    coverLetter: string;
    resume: {
      file: {
        originFileObj: File;
      };
    };
  }) => {
    const formData = new FormData();
    formData.append("applicantName", values.applicantName);
    formData.append("applicantEmail", values.applicantEmail);
    formData.append("coverLetter", values.coverLetter);
    formData.append("resume", values?.resume?.file?.originFileObj);

    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  if (isLoading) return <p>Loading vacancies...</p>;

  return (
    <div className="job-posts-container">
      <h1 className="job-posts-title">Available Vacancies</h1>
      <Row gutter={[16, 16]}>
        {jobPosts.map((job: JobPost) => (
          <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
            <Card
              className="job-card"
              title={job.title}
              bordered={false}
              actions={[
                <Button type="primary" onClick={() => showApplyModal(job)}>
                  Apply
                </Button>,
              ]}
            >
              <p>
                <strong>Description:</strong> {job.description}
              </p>
              <p>
                <strong>Salary:</strong> {job.salaryRange}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`Apply for ${selectedJob?.title}`}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleApply}>
          <Form.Item
            name="applicantName"
            label="Full Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="applicantEmail"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="coverLetter"
            label="Cover Letter"
            rules={[
              { required: true, message: "Please provide a cover letter!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="resume"
            label="Resume"
            rules={[{ required: true, message: "Please upload your resume!" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
