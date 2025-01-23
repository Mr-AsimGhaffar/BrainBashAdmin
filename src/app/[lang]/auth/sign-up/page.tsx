"use client";

import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function SignUpPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || `/${lang}/index/home`;
  const [loadingLogin, setLoadingLogin] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, refreshToken, user } = data.data;

        Cookies.set("accessToken", token.token, { expires: 1 });
        Cookies.set("refreshToken", refreshToken.token, { expires: 7 });
        Cookies.set("id", user.id, { expires: 1 });

        message.success("Successfully logged in!");
        const redirectTo =
          user.role.name === "CUSTOMER"
            ? `/${lang}/index/listings`
            : redirectUrl;
        router.push(redirectTo);
      } else {
        const data = await response.json();
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      message.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = async () => {
    setLoadingLogin(true);
    // Simulate a delay or API request for "forgot password" logic
    setTimeout(() => {
      setLoadingLogin(false); // Stop loading after the request
      router.push(`/${lang}/auth/login`);
    }, 2000); // Simulate a delay of 2 seconds for the request
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spin spinning={loading} size="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl mx-auto">
          <div className="hidden lg:block">
            <img
              src="/images/SignupImage.png"
              alt="Students studying"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-blue-600">
                  Create an account
                </h1>
                <p className="text-lg text-blue-600 mb-8">
                  Connect with your friends today
                </p>
              </div>
              <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                size="large"
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: "Please enter your username" },
                    ]}
                  >
                    <Input
                      placeholder="Enter Your Username"
                      className="h-12 border-blue-500"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                    ]}
                  >
                    <Input
                      placeholder="Enter Your Email"
                      className="h-12 border-blue-500"
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                >
                  <Input
                    placeholder="Phone Number"
                    className="h-12 border-blue-500"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-blue-500" />}
                    placeholder="Enter Your Password"
                    className="h-12 border-blue-500"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-base"
                  >
                    Sign Up
                  </Button>
                </Form.Item>
                <div className="text-center my-4">
                  <span className="text-blue-500 text-xs">Or With</span>
                </div>
                <Button
                  icon={
                    <img
                      src="https://www.google.com/favicon.ico"
                      className="w-5 h-5"
                      alt="Google"
                    />
                  }
                  className="w-full gap-2 border-blue-500 hover:border-blue-600 text-blue-700 text-base font-bold flex items-center justify-center"
                >
                  Login with Google
                </Button>
                <div className="mt-6 flex items-center justify-center">
                  <p className="text-blue-500">Already have an account ? </p>
                  <Button
                    type="link"
                    onClick={handleLoginClick}
                    loading={loadingLogin}
                    className="text-blue-700 font-semibold hover:text-blue-800"
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}
