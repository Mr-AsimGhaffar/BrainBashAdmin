import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

interface IdeaFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function IdeaForm({
  onSubmit,
  onCancel,
  initialValues,
}: IdeaFormProps) {
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
            {initialValues ? "Edit Idea" : "Add New Idea"}
          </h1>
        </div>

        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: "Please enter idea title" },
            {
              min: 2,
              message: "Title must be at least 2 characters long",
            },
            {
              max: 100,
              message: "Title must be at most 100 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "Title must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter Title" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter description" },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "Description must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter Description" />
        </Form.Item>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          className="font-sansInter"
        >
          {initialValues ? "Update Idea" : "Add Idea"}
        </Button>
      </div>
    </Form>
  );
}
