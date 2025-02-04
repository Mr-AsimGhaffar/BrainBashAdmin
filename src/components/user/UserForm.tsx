import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

interface UserFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function UserForm({
  onSubmit,
  onCancel,
  initialValues,
}: UserFormProps) {
  const [form] = Form.useForm();
  const [phoneValue, setPhoneValue] = useState<string>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        phoneNumber: initialValues.phoneNumber || "",
      });
      setPhoneValue(initialValues.phoneNumber || "");
    } else {
      form.resetFields();
      setPhoneValue("");
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      preserve={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 text-center">
          <h1 className="font-medium text-base">Edit User</h1>
        </div>

        <Form.Item
          name="username"
          label="User Name"
          rules={[
            { required: true, message: "Please enter user name" },
            {
              min: 2,
              message: "User Name must be at least 2 characters long",
            },
            {
              max: 50,
              message: "User Name must be at most 50 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "User Name must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter User Name" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: "Please enter your phone number",
            },
            () => ({
              validator(_, value) {
                const phoneToValidate =
                  value || form.getFieldValue("phoneNumber");
                if (!phoneToValidate || !isValidPhoneNumber(phoneToValidate)) {
                  return Promise.reject(
                    new Error("Invalid phone number format")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <PhoneInput
            international
            defaultCountry="US"
            value={phoneValue}
            onChange={(value) => {
              setPhoneValue(value);
              form.setFieldsValue({ phoneNumber: value }); // Keep form and state in sync
            }}
            className="border rounded-md pl-2 flex items-center h-8"
            flagComponent={({ country }) => <div></div>}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select placeholder="Select Status">
            <Select.Option value="ACTIVE">Active</Select.Option>
            <Select.Option value="DISABLED">Disabled</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            <Select.Option value="USER">User</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
            <Select.Option value="SUPER_ADMIN">Super Admin</Select.Option>
          </Select>
        </Form.Item>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          className="font-sansInter"
        >
          Update User
        </Button>
      </div>
    </Form>
  );
}
