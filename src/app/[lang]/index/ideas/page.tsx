"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Space, message, Popconfirm } from "antd";
import { message as antdMessage } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { FaEdit } from "react-icons/fa";
import { Idea } from "@/lib/definitions";
import dayjs from "dayjs";
import IdeaForm from "@/components/ideas/IdeaForm";
import mqtt from "mqtt";

export default function IdeasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ideas/getIdeas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIdeas(
          data.data.map((item: Idea) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch ideas");
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
      message.error("An error occurred while fetching ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
    const client = mqtt.connect(`${process.env.NEXT_PUBLIC_IDEAS_BASE_URL}`);

    client.on("connect", () => {
      client.subscribe("notification/ideas");
    });

    client.on("message", (topic, message) => {
      if (topic === "notification/ideas") {
        try {
          const newIdea: Idea = JSON.parse(message.toString());
          setIdeas((prevIdeas) => [
            { ...newIdea, key: newIdea.id.toString() },
            ...prevIdeas,
          ]);
          antdMessage.success("New idea received!");
        } catch (error) {
          console.error("Error parsing MQTT message:", error);
        }
      }
    });

    return () => {
      client.end();
    };
  }, []);

  const columns: ColumnsType<Idea> = [
    {
      title: <span className="flex items-center gap-2">Title</span>,
      dataIndex: "title",
      key: "title",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Description</span>,
      dataIndex: "description",
      key: "description",
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
            title="Are you sure to delete this idea?"
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

  const handleAddIdea = () => {
    setSelectedIdeas(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/ideas/deleteIdea?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete idea");

      message.success("idea deleted successfully");
      fetchIdeas();
    } catch (error) {
      let errorMessage = "Failed to fetch idea";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    }
  };

  const handleEdit = async (idea: Idea) => {
    try {
      const response = await fetch(`/api/ideas/getIdeasById?id=${idea.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedIdeas(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch ideas details");
      }
    } catch (error) {
      console.error("Error fetching ideas data:", error);
      message.error("An error occurred while fetching ideas details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedIdeas) {
      try {
        const response = await fetch("/api/ideas/updateIdea", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedIdeas.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setIdeas((prevIdeas) =>
            prevIdeas.map((ideas) =>
              ideas.id === result.data.id ? result.data : ideas
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update idea");
        }
      } catch (error) {
        console.error("Error updating idea:", error);
        message.error("An error occurred while updating the idea");
      }
    } else {
      try {
        const response = await fetch("/api/ideas/createIdea", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setIdeas((prevIdeas) => [result.data, ...prevIdeas]);
          message.success("Successfully added idea");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add idea");
        }
      } catch (error) {
        console.error("Error adding idea:", error);
        message.error("An error occurred while adding the idea");
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
          <h1 className="text-3xl font-bold font-montserrat">Ideas</h1>
        </div>
        <div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddIdea}
            className="font-sansInter"
          >
            Add Idea
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={ideas}
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
        <IdeaForm
          initialValues={selectedIdeas}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
