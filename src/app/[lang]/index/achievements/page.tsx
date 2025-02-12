"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message, Space, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { FaEdit } from "react-icons/fa";
import { Achievement } from "@/lib/definitions";
import AchievementForm from "@/components/achievements/AchievementForm";
import FormatString from "@/utils/FormatString";

export default function SubjectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievements, setSelectedAchievements] =
    useState<Achievement | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/achievements/getAchievements`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAchievements(
          data.data.map((item: Achievement) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch achievements");
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      message.error("An error occurred while fetching achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const columns: ColumnsType<Achievement> = [
    {
      title: <span className="flex items-center gap-2">Name</span>,
      dataIndex: "name",
      key: "name",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Description</span>,
      dataIndex: "description",
      key: "description",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Criteria Type</span>,
      dataIndex: "criteriaType",
      key: "criteriaType",
      className: "font-workSans",
      render: (text) => <p>{FormatString(text)}</p>,
    },
    {
      title: (
        <span className="flex items-center gap-2">Criteria Threshold</span>
      ),
      dataIndex: "criteriaThreshold",
      key: "criteriaThreshold",
      className: "font-workSans",
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

  const handleAddAchievement = () => {
    setSelectedAchievements(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `/api/achievements/deleteAchievement?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete achievement");

      message.success("achievement deleted successfully");
      fetchAchievements();
    } catch (error) {
      let errorMessage = "Failed to fetch achievement";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    }
  };

  const handleEdit = async (achievement: Achievement) => {
    try {
      const response = await fetch(
        `/api/achievements/getAchievementsById?id=${achievement.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedAchievements(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch achievement details");
      }
    } catch (error) {
      console.error("Error fetching achievement data:", error);
      message.error("An error occurred while fetching achievement details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedAchievements) {
      try {
        const response = await fetch("/api/achievements/updateAchievement", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedAchievements.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setAchievements((prevAchievements) =>
            prevAchievements.map((achievement) =>
              achievement.id === result.data.id ? result.data : achievement
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update achievement");
        }
      } catch (error) {
        console.error("Error updating achievement:", error);
        message.error("An error occurred while updating the achievement");
      }
    } else {
      try {
        const response = await fetch("/api/achievements/createAchievement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setAchievements((prevAchievements) => [
            result.data,
            ...prevAchievements,
          ]);
          message.success("Successfully added achievement");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add achievement");
        }
      } catch (error) {
        console.error("Error adding achievement:", error);
        message.error("An error occurred while adding the achievement");
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
          <h1 className="text-3xl font-bold font-montserrat">Achievements</h1>
        </div>
        <div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddAchievement}
            className="font-sansInter"
          >
            Add Achievement
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={achievements}
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
        <AchievementForm
          initialValues={selectedAchievements}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
