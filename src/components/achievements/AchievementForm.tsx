import React, { useEffect } from "react";
import { Form, Input, Button, Select } from "antd";

interface AchievementFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function AchievementForm({
  onSubmit,
  onCancel,
  initialValues,
}: AchievementFormProps) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
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
          <h1 className="font-medium text-base">
            {" "}
            {initialValues ? "Edit Achievement" : "Add New Achievement"}
          </h1>
        </div>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please enter achievement name" },
            {
              min: 2,
              message: "achievement name must be at least 2 characters long",
            },
            {
              max: 100,
              message: "achievement name must be at most 100 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "achievement name must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter achievement name" />
        </Form.Item>
        <Form.Item
          label="Criteria Type"
          name="criteriaType"
          rules={[
            { required: true, message: "Please select the criteria type!" },
          ]}
        >
          <Select placeholder="Select criteria type">
            <Select.Option value="LOGIN_STREAK">Login Streak</Select.Option>
            <Select.Option value="TOTAL_QUIZZES">Total Quizzes</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Criteria Threshold"
          name="criteriaThreshold"
          rules={[
            { required: true, message: "Please input the criteria threshold!" },
          ]}
        >
          <Input type="number" placeholder="Enter criteria threshold" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          className="font-sansInter"
        >
          {initialValues ? "Update Achievement" : "Add Achievement"}
        </Button>
      </div>
    </Form>
  );
}
