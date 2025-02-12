"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message, Space, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { FaEdit } from "react-icons/fa";
import { Subject } from "@/lib/definitions";
import dayjs from "dayjs";
import SubjectForm from "@/components/subject/SubjectForm";

export default function SubjectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subject/getSubjects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubjects(
          data.data.map((item: Subject) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      message.error("An error occurred while fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const columns: ColumnsType<Subject> = [
    {
      title: <span className="flex items-center gap-2">Name</span>,
      dataIndex: "name",
      key: "name",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Date</span>,
      dataIndex: "updatedAt",
      key: "updatedAt",
      className: "font-workSans",
      render: (date: string) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Action",
      key: "action",
      className: "font-workSans",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            <FaEdit className="text-lg text-teal-800" />
          </Button>
          <Popconfirm
            title="Are you sure to delete this subject?"
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

  const handleAddSubject = () => {
    setSelectedSubjects(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/subject/deleteSubject?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete subject");

      message.success("Subject deleted successfully");
      fetchSubjects();
    } catch (error) {
      let errorMessage = "Failed to fetch subejects";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    }
  };

  const handleEdit = async (subject: Subject) => {
    try {
      const response = await fetch(
        `/api/subject/getSubjectsById?id=${subject.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedSubjects(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch subject details");
      }
    } catch (error) {
      console.error("Error fetching subject data:", error);
      message.error("An error occurred while fetching subject details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedSubjects) {
      try {
        const response = await fetch("/api/subject/updateSubject", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedSubjects.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setSubjects((prevSubjects) =>
            prevSubjects.map((subject) =>
              subject.id === result.data.id ? result.data : subject
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update subject");
        }
      } catch (error) {
        console.error("Error updating subject:", error);
        message.error("An error occurred while updating the subject");
      }
    } else {
      try {
        const response = await fetch("/api/subject/createSubject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setSubjects((prevSubjects) => [result.data, ...prevSubjects]);
          message.success("Successfully added subject");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add subject");
        }
      } catch (error) {
        console.error("Error adding subject:", error);
        message.error("An error occurred while adding the subject");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-montserrat">Subjects</h1>
        </div>
        <div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddSubject}
            className="font-sansInter"
          >
            Add Subject
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={subjects}
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={720}
        destroyOnClose
      >
        <SubjectForm
          initialValues={selectedSubjects}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
