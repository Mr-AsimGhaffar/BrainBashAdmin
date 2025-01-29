"use client";

import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useUser } from "@/hooks/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { user, setUser } = useUser();

  const backToDashboard = () => {
    router.push(`/index/home`);
  };

  const onFinish = async (values: any) => {
    try {
      const response = await fetch("/api/updateUsers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
          ...values,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        form.setFieldsValue(result.data);
        setUser(result.data);
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("An error occurred while updating the user");
    }
  };
  return (
    <div className="max-w-3xl">
      <Card title="Basic Information" className="mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={user || {}}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Project Title"
              name="projectTitle"
              required
              rules={[
                { required: true, message: "Please input your project title" },
              ]}
            >
              <Input placeholder="Enter Project Title" />
            </Form.Item>

            <Form.Item label="Email" name="email" required>
              <Input placeholder="Enter Email" />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-4">
            <Button onClick={backToDashboard}>Back to Dashboard</Button>
            <Button type="primary" htmlType="submit" className="font-sansInter">
              Confirm Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
