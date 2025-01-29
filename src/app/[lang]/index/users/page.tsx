"use client";

import React, { useEffect, useState } from "react";
import { Button, Table, Tag, Modal, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { FaEdit } from "react-icons/fa";
import UserForm from "@/components/user/UserForm";

interface User {
  key: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  contacts: string;
  status: string;
  createdBy: number;
  role: string;
}

export default function UserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    "role.name": [] as string[],
    password: "",
    confirmPassword: "",
    status: [] as string[],
    search: "",
  });
  const [sortParams, setSortParams] = useState<
    { field: string; order: string }[]
  >([]);

  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("");

  const fetchUsers = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const filtersObject = {
        ...(currentFilters.status ? { status: currentFilters.status } : {}),
        ...(currentFilters.username
          ? { username: currentFilters.username }
          : {}),
        ...(currentFilters.email ? { email: currentFilters.email } : {}),
        ...(currentFilters["role.name"]
          ? { "role.name": currentFilters["role.name"] }
          : {}),
      };
      const sort = sortParams
        .map((param) => `${param.field}:${param.order}`)
        .join(",");
      const query = new URLSearchParams({
        sort,
        filters: JSON.stringify(filtersObject),
        search,
        searchFields: "username,email",
      }).toString();
      const response = await fetch(`/api/listUsers?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "skipBrowserWarning",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(
          data.data.map((item: User) => ({
            ...item,
            key: item.id.toString(),
          }))
        );
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortParams, search, filters]);

  const formatString = (str: any) => {
    if (!str) return "";
    return str
      .split("_") // Split by underscore
      .map(
        (word: any) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ) // Capitalize first letter of each word
      .join(" "); // Join the words back together with spaces
  };

  const columns: ColumnsType<User> = [
    {
      title: <span className="flex items-center gap-2">Username</span>,
      dataIndex: "username",
      key: "username",
      className: "font-workSans",
      render: (text) => <p>{formatString(text)}</p>,
    },
    {
      title: <span className="flex items-center gap-2">Email</span>,
      dataIndex: "email",
      key: "email",
      className: "font-workSans",
    },
    {
      title: <span className="flex items-center gap-2">Role</span>,
      dataIndex: "role",
      key: "role",
      className: "font-workSans",
      render: (role) => {
        if (role) {
          return <p>{formatString(role)}</p>;
        }
        return null;
      },
    },
    {
      title: <span className="flex items-center gap-2">Status</span>,
      dataIndex: "status",
      key: "status",
      className: "font-workSans",
      render: (status: string) => {
        const statusColors: { [key: string]: string } = {
          ACTIVE: "green",
          IN_ACTIVE: "gray",
          SUSPENDED: "red",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {formatString(status)}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      className: "font-workSans",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          <FaEdit className="text-lg text-teal-800" />
        </Button>
      ),
    },
  ];

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (company: User) => {
    try {
      const response = await fetch(`/api/getUserById?id=${company.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.data);
        setIsModalOpen(true);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("An error occurred while fetching user details");
    }
  };

  const handleModalOk = async (values: any) => {
    if (selectedUser) {
      // Update user
      try {
        const response = await fetch("/api/updateUsers", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: selectedUser.id,
            ...values,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === result.data.id ? result.data : user
            )
          );
          message.success(result.message);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        message.error("An error occurred while updating the user");
      }
    } else {
      // Add user
      try {
        const response = await fetch("/api/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const result = await response.json();
          setUsers((prevUsers) => [result.data, ...prevUsers]);
          message.success("Successfully added user");
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to add user");
        }
      } catch (error) {
        console.error("Error adding user:", error);
        message.error("An error occurred while adding the user");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-montserrat">Manage Users</h1>
      </div>
      {/* <div className="flex justify-between items-center  mb-4">
        <div className="flex items-center gap-4">
          <Button
            type="primary"
            size="large"
            icon={<UserAddOutlined />}
            onClick={handleAddUser}
            className="font-sansInter"
          >
            Add User
          </Button>
        </div>
      </div> */}

      <Table
        columns={columns}
        dataSource={users}
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
        <UserForm
          initialValues={selectedUser}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
}
