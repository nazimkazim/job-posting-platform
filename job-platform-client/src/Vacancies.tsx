/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "react-query";
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

  const queryClient = useQueryClient();

  const { data: jobPosts, isLoading } = useQuery("jobposts", fetchJobPosts);

  const mutation = useMutation(
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
    <div>
      <h1>Available Vacancies</h1>
      <Table dataSource={jobPosts} rowKey="id">
        <Table.Column title="Title" dataIndex="title" key="title" />
        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
        />
        <Table.Column
          title="Salary Range"
          dataIndex="salaryRange"
          key="salaryRange"
        />
        <Table.Column title="Location" dataIndex="location" key="location" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_, record: JobPost) => (
            <Button type="primary" onClick={() => showApplyModal(record)}>
              Apply
            </Button>
          )}
        />
      </Table>

      {/* Modal for Applying */}
      <Modal
        title={`Apply for ${selectedJob?.title}`}
        visible={isModalVisible}
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