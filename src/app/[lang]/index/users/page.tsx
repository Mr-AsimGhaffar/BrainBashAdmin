"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Table,
  Tag,
  Modal,
  message,
  Input,
  Space,
  Popconfirm,
} from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import UserForm from "@/components/user/UserForm";
import FormatString from "@/utils/FormatString";
import debounce from "lodash.debounce";
import SearchFilterUsers from "@/components/user/SearchFilterUsers";
import handleExportUser from "@/components/export/ExportUser";

interface User {
  key: string;
  id: number;
  username: string;
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
  const [searchUserName, setSearchUserName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const searchRef = useRef<string[]>([]);
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: [] as string[],
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
        ...(currentFilters.username
          ? { username: currentFilters.username }
          : {}),
        ...(currentFilters.email ? { email: currentFilters.email } : {}),
        ...(currentFilters.role ? { role: currentFilters.role } : {}),
        ...(currentFilters.status ? { status: currentFilters.status } : {}),
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

  const debouncedFetchCompanies = debounce(
    (currentFilters) => fetchUsers(currentFilters),
    500,
    { leading: true, trailing: false }
  );
  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    debouncedFetchCompanies(updatedFilters);
  };
  const handleGeneralSearch = (
    value: string,
    newFilters: { role: string[]; status: string[] }
  ) => {
    setSearch(value);
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (newFilters.role.length > 0) {
        updatedFilters["role"] = newFilters.role;
      } else {
        delete (updatedFilters as Partial<typeof updatedFilters>)["role"];
      }
      if (newFilters.status.length > 0) {
        updatedFilters["status"] = newFilters.status;
      } else {
        delete (updatedFilters as Partial<typeof updatedFilters>)["status"];
      }

      return updatedFilters;
    });
  };
  const handleSort = (field: string) => {
    let newSortParams = [...sortParams];
    const existingIndex = newSortParams.findIndex(
      (param) => param.field === field
    );

    if (existingIndex !== -1) {
      const currentOrder = newSortParams[existingIndex].order;
      if (currentOrder === "asc") {
        newSortParams[existingIndex].order = "desc";
      } else if (currentOrder === "desc") {
        newSortParams.splice(existingIndex, 1);
      }
    } else {
      newSortParams.push({ field, order: "asc" });
    }

    setSortParams(newSortParams);
  };

  useEffect(() => {
    fetchUsers();
  }, [sortParams, search, filters]);

  const columns: ColumnsType<User> = [
    {
      title: (
        <span className="flex items-center gap-2">
          Username
          {sortParams.find((param) => param.field === "username") ? (
            sortParams.find((param) => param.field === "username")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("username")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("username")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("username")}
            />
          )}
        </span>
      ),
      dataIndex: "username",
      key: "username",
      className: "font-workSans",
      render: (text) => <p>{FormatString(text)}</p>,
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search User Name"
            value={searchUserName}
            suffix={
              <SearchOutlined
                style={{ color: searchUserName ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const newSearchValue = "username";
              setSearchUserName(e.target.value);
              if (!searchRef.current.includes(newSearchValue)) {
                searchRef.current.push(newSearchValue);
              }
              handleFilterChange("username", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("firstName", searchUserName)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchUserName("");
                handleFilterChange("username", "");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchUserName ? "blue" : "gray" }} />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          Email
          {sortParams.find((param) => param.field === "email") ? (
            sortParams.find((param) => param.field === "email")!.order ===
            "asc" ? (
              <FaSortUp
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("email")}
              />
            ) : (
              <FaSortDown
                className="cursor-pointer text-blue-500"
                onClick={() => handleSort("email")}
              />
            )
          ) : (
            <FaSort
              className="cursor-pointer text-gray-400"
              onClick={() => handleSort("email")}
            />
          )}
        </span>
      ),
      dataIndex: "email",
      key: "email",
      className: "font-workSans",
      filterDropdown: (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Email"
            value={searchEmail}
            suffix={
              <SearchOutlined
                style={{ color: searchEmail ? "blue" : "gray" }}
              />
            }
            onChange={(e) => {
              const searchValue = "email";
              setSearchEmail(e.target.value);
              if (!searchRef.current.includes(searchValue)) {
                searchRef.current.push(searchValue);
              }
              handleFilterChange("email", e.target.value);
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFilterChange("email", searchEmail)}
              style={{ marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchEmail("");
                handleFilterChange("email", "");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      ),
      filterIcon: () => (
        <SearchOutlined style={{ color: searchEmail ? "blue" : "gray" }} />
      ),
    },
    {
      title: <span className="flex items-center gap-2">Role</span>,
      dataIndex: "role",
      key: "role",
      className: "font-workSans",
      render: (role) => {
        if (role) {
          return <p>{FormatString(role)}</p>;
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
          DISABLED: "gray",
        };
        return (
          <Tag color={statusColors[status] || "default"}>
            {FormatString(status)}
          </Tag>
        );
      },
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
            title="Are you sure to delete this user?"
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
          fetchUsers();
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          message.error(error.message || "Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        message.error("An error occurred while updating the user");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/deleteUser?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      let errorMessage = "Failed to fetch users";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 rounded-lg">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold font-montserrat">
            Manage Users
          </h1>
        </div>
        <div className="w-full lg:w-auto">
          <SearchFilterUsers onFilterChange={handleGeneralSearch} />
        </div>
        <div>
          <Button type="primary" onClick={handleExportUser}>
            Export CSV
          </Button>
        </div>
      </div>

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
