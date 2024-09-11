import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, List } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import "./JobsPost.css";
import { apiClient } from "./api/aixos";

interface JobPost {
  id: number;
  title: string;
  description: string;
  salaryRange: string;
  location: string;
  _count: {
    Application: number;
  }
}

interface Application {
  id: number;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
}

const fetchJobPosts = async () => {
  const { data } = await apiClient.get("/api/jobs/jobposts");
  return data;
};

const fetchApplications = async (jobPostId: number) => {
  const { data } = await apiClient.get(`/api/jobs/jobposts/${jobPostId}/applications`);
  return data;
};

export const JobPosts: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: jobPosts, isLoading } = useQuery("jobposts", fetchJobPosts);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  const [form] = Form.useForm();

  const handleViewApplications = async (jobPostId: number) => {
    const data = await fetchApplications(jobPostId);
    setApplications(data);
    setIsApplicantsModalOpen(true);
  };

  const mutation = useMutation(
    (newJob: Partial<JobPost>) => {
      if (isEditMode && selectedJob) {
        return apiClient.put(`/api/jobs/jobposts/${selectedJob.id}`, newJob);
      }
      return apiClient.post("/api/jobs/jobposts", newJob);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobposts");
        form.resetFields();
        setIsModalOpen(false);
      },
    }
  );

  const deleteMutation = useMutation(
    (id: number) => apiClient.delete(`/api/jobs/jobposts/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("jobposts");
      },
    }
  );

  const showModal = (job?: JobPost) => {
    if (job) {
      setSelectedJob(job);
      setIsEditMode(true);
      form.setFieldsValue(job);
    } else {
      setIsEditMode(false);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutation.mutate(values);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="job-posts-container">
      <Space>
        <Button className="add-job" type="primary" onClick={() => showModal()}>
          Add Job Post
        </Button>
      </Space>
      <Table dataSource={jobPosts} rowKey="id" pagination={false}>
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
          title="Applications"
          key="applications"
          render={(_text: string, record: JobPost) => {
            console.log(record);
            return <Button
              type="link"
              onClick={() => handleViewApplications(record.id)}
            >
              {record?._count?.Application || 0} Applications
            </Button>
          }}
        />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_text: string, record: JobPost) => (
            <Space>
              <Button onClick={() => showModal(record)}>Edit</Button>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={isEditMode ? "Edit Job Post" : "Add Job Post"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the job title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the job description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="salaryRange"
            label="Salary Range"
            rules={[
              { required: true, message: "Please input the salary range!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please input the location!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="List of Applicants"
        open={isApplicantsModalOpen}
        onCancel={() => setIsApplicantsModalOpen(false)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={applications}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`${item.applicantName} (${item.applicantEmail})`}
                description={item.coverLetter}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};
