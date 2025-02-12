"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function LoginPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);

  const extractTokensFromUrl = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const refreshToken = queryParams.get("refreshToken");
    const role = queryParams.get("role");
    const id = queryParams.get("id");

    if (token && refreshToken && role) {
      document.cookie = `accessToken=${token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;
      document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `id=${id}; path=/; max-age=${60 * 60 * 24 * 7}`;

      // Redirect based on role
      if (role === "USER") {
        router.push(`/${lang}/index/quizHome`);
      } else {
        router.push(`/${lang}/index/home`);
      }
    }
  };

  useEffect(() => {
    extractTokensFromUrl();
  }, [router, lang]);

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

      const data = await response.json();

      if (response.ok) {
        if (!data.user) {
          message.error("User data not found in response");
          return;
        }
        if (!data.user.role) {
          message.error("Role not found in user data");
          return;
        }

        const userRole = data.user.role;
        let redirectUrl = `/${lang}/index/home`;

        if (userRole === "USER") {
          redirectUrl = `/${lang}/index/quizHome`;
        }

        message.success("Successfully logged in!");
        router.push(redirectUrl);
      } else {
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
    window.location.href = googleAuthUrl;
  };

  const handleForgotPasswordClick = async () => {
    setLoadingForgotPassword(true);
    setTimeout(() => {
      setLoadingForgotPassword(false);
      router.push(`/${lang}/auth/forgot-password`);
    }, 2000);
  };
  const handleSignUpClick = async () => {
    setLoadingSignUp(true);
    setTimeout(() => {
      setLoadingSignUp(false);
      router.push(`/${lang}/auth/sign-up`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spin spinning={loading} size="large">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl mx-auto">
          <div className="hidden lg:block">
            <img
              src="/images/loginImage.png"
              alt="Students studying"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
              <h1 className="text-center text-3xl font-bold text-blue-700 mb-8">
                Login Details
              </h1>
              <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                size="large"
                className="space-y-4"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please input your Email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-blue-500" />}
                    placeholder="Enter Your Email"
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
                  <div className="flex items-center justify-between">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox className="text-blue-500">Remember me</Checkbox>
                    </Form.Item>
                    <Button
                      type="link"
                      onClick={handleForgotPasswordClick}
                      loading={loadingForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold text-base"
                  >
                    Login
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
                  onClick={handleGoogleLogin}
                  loading={loading}
                  className="w-full gap-2 border-blue-500 hover:border-blue-600 text-blue-700 text-base font-bold  flex items-center justify-center"
                >
                  Login with Google
                </Button>
                <div className="mt-6 flex items-center justify-center">
                  <p className="text-blue-500">Don't have an account ? </p>
                  <Button
                    type="link"
                    onClick={handleSignUpClick}
                    loading={loadingSignUp}
                    className="text-blue-700 font-semibold hover:text-blue-800"
                  >
                    Sign Up
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
