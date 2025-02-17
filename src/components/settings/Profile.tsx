"use client";

import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useRouter } from "next/navigation";
import { useSettings } from "@/hooks/context/ProjectSettingContext";

export default function Profile({ params }: { params?: { lang: string } }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const { settings, setSettings } = useSettings();

  const backToDashboard = () => {
    const lang = params?.lang || "en";
    router.push(`/${lang}/index/home`);
  };

  const onFinish = async (values: any) => {
    try {
      const response = await fetch("/api/settings/updateSettings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        form.setFieldsValue(result.data);
        setSettings(result.data);
        window.location.reload();
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      message.error("An error occurred while updating the settings");
    }
  };
  return (
    <div className="max-w-3xl">
      <Card title="Basic Information" className="mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={settings || {}}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Project Title"
              name="title"
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
