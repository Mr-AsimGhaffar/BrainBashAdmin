"use client";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { Question, Quiz } from "@/lib/definitions";
import QuizForm from "@/components/quizForm/QuizForm";
import dayjs from "dayjs";
import QuizPreviewForm from "@/components/quizForm/QuizPreviewForm";

export interface ApiQuiz {
  id: string;
  title: string;
  description?: string;
  category: string;
  maxScore: number;
  duration: number;
  publishDate: string;
  expiryDate: string;
  subjectId: number;
  questions: Question[];
}

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState<ApiQuiz[]>([]);
  const [previewQuiz, setPreviewQuiz] = useState<ApiQuiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState<string>("all");
  const [form] = Form.useForm();

  const mapApiQuizToForm = (quiz: ApiQuiz): Quiz => ({
    ...quiz,
    publishDate: dayjs(quiz.publishDate),
    expiryDate: dayjs(quiz.expiryDate),
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quizzes/getQuizzes");
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const { data } = await response.json();
      const formattedData = data.map((quiz: any) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.subject?.name || "N/A",
        maxScore: quiz.maxScore,
        duration: quiz.duration,
        publishDate: quiz.publishDate,
        expiryDate: quiz.expiryDate,
        createdAt: quiz.createdAt,
        questions: quiz.questions,
      }));
      setQuizzes(formattedData);
    } catch (error) {
      message.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (values: Quiz) => {
    try {
      const payload = {
        ...values,
        subjectId: values.category,
        publishDate: values.publishDate.toISOString(),
        expiryDate: values.expiryDate.toISOString(),
        maxScore: Number(values.maxScore),
        duration: Number(values.duration),
      };
      const response = await fetch("/api/quizzes/createQuize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create quiz");
      message.success("Quiz created successfully");
      fetchQuizzes();
    } catch (error) {
      message.error("Failed to create quiz");
    }
  };

  const handleUpdateQuiz = async (values: Quiz) => {
    try {
      const payload = {
        ...values,
        publishDate: values.publishDate.toISOString(),
        expiryDate: values.expiryDate.toISOString(),
        maxScore: Number(values.maxScore),
        duration: Number(values.duration),
      };
      const response = await fetch(
        `/api/quizzes/updateQuiz?id=${selectedQuiz?.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update quiz");
      message.success("Quiz updated successfully");
      fetchQuizzes();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update quiz");
    }
  };

  const handleEdit = (quiz: ApiQuiz) => {
    setSelectedQuiz(mapApiQuizToForm(quiz));
    setIsModalVisible(true);
  };
  const handlePreview = async (quiz: ApiQuiz) => {
    try {
      const response = await fetch(
        `/api/quizzes/getQuizzesById?id=${quiz.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPreviewQuiz(data.data);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch quizzes");
      }
    } catch (error) {
      console.error("Error fetching quizzes data:", error);
      message.error("An error occurred while fetching quizzes details");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/quizzes/deleteQuiz?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quiz");

      message.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (error) {
      let errorMessage = "Failed to fetch quizzes";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    }
  };

  const handleDuplicate = async (quiz: ApiQuiz) => {
    const duplicatedQuiz = { ...mapApiQuizToForm(quiz), id: undefined }; // Reset the id to undefined
    setSelectedQuiz(duplicatedQuiz);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<ApiQuiz> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => format(new Date(date), "yyyy-MM-dd HH:mm:ss"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleDuplicate(record)}>Duplicate</Button>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handlePreview(record)}>Preview</Button>
          <Popconfirm
            title="Are you sure to delete this quiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-montserra">Manage Quizzes</h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedQuiz(null);
            setIsModalVisible(true);
          }}
        >
          Add New Quiz
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quizzes}
        loading={loading}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <QuizPreviewForm
        quiz={previewQuiz}
        onClose={() => setPreviewQuiz(null)}
      />

      <Modal
        title={selectedQuiz ? "Edit Quiz" : "Create New Quiz"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedQuiz(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <QuizForm
          form={form}
          onFinish={selectedQuiz?.id ? handleUpdateQuiz : handleCreateQuiz}
          onCancel={() => setIsModalVisible(false)}
          initialValues={selectedQuiz || undefined}
          quizId={Number(selectedQuiz?.id) ?? undefined}
        />
      </Modal>
    </div>
  );
};

export default ManageQuizzes;
