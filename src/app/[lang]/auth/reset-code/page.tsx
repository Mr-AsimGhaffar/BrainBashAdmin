"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, message, Spin } from "antd";

export default function ResetCodePage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, email }),
        }
      );

      if (response.ok) {
        message.success("Reset code verified successfully.");
        // Redirect to reset password page
        router.push(
          `/${lang}/auth/reset-password?email=${email}&code=${values.code}`
        );
      } else {
        const errorData = await response.json();
        message.error(
          errorData.message || "Invalid reset code. Please try again."
        );
      }
    } catch (error) {
      message.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spin size="large" spinning={loading}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Verify Reset Code
          </h2>
          <p className="mt-2 text-gray-600">
            Enter the reset code sent to your email.
          </p>
        </div>

        <Form
          name="reset-code"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="code"
            rules={[
              { required: true, message: "Please input the reset code!" },
            ]}
          >
            <Input placeholder="Reset Code" className="h-12 border-blue-500" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Verify Code
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}
