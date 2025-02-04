import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SearchFiltersUsersProps {
  onFilterChange: (
    value: string,
    filters: { role: string[]; status: string[] }
  ) => void;
}

const FilterBar: React.FC<SearchFiltersUsersProps> = ({ onFilterChange }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onFilterChange(value, { role: selectedRole, status: selectedStatus });
  };
  const handleRoleChange = (selectedKeys: React.Key[]) => {
    setSelectedRole(selectedKeys as string[]);
    onFilterChange(searchValue, {
      role: selectedKeys as string[],
      status: selectedStatus,
    });
  };

  const handleStatusChange = (selectedKeys: React.Key[]) => {
    setSelectedStatus(selectedKeys as string[]);
    onFilterChange(searchValue, {
      role: selectedRole,
      status: selectedKeys as string[],
    });
  };

  const menuItemsRole = [
    { key: "ADMIN", label: "Admin" },
    { key: "USER", label: "User" },
    { key: "SUPER_ADMIN", label: "Super Admin" },
  ];
  const menuItemsStatus = [
    { key: "ACTIVE", label: "Active" },
    { key: "DISABLED", label: "Disabled" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Input
            placeholder="Search users"
            prefix={<SearchOutlined className="text-blue-500" />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            mode="multiple"
            placeholder="Select Role"
            value={selectedRole}
            onChange={handleRoleChange}
            style={{ width: 220 }}
            options={menuItemsRole.map((item) => ({
              label: item.label,
              value: item.key,
            }))}
            className="custom-select"
          />
          <Select
            mode="multiple"
            placeholder="Select Status"
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{ width: 200 }}
            options={menuItemsStatus.map((item) => ({
              label: item.label,
              value: item.key,
            }))}
            className="custom-select"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
