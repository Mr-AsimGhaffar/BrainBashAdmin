"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin, Select } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

export default function SignUpPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [phoneValue, setPhoneValue] = useState<string>();

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
      const response = await fetch(`/api/auth/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          phoneNumber: phoneValue,
        }),
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
        const data = await response.json();
        message.error(data.message || "Signup failed");
      }
    } catch (error) {
      message.error("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = async () => {
    setLoadingLogin(true);
    setTimeout(() => {
      setLoadingLogin(false);
      router.push(`/${lang}/auth/login`);
    }, 2000);
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
    window.location.href = googleAuthUrl;
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
                <h1 className="text-3xl font-bold text-blue-700">
                  Create an account
                </h1>
                <p className="text-lg text-blue-600 mb-8">
                  Connect with your friends today
                </p>
              </div>
              <Form
                name="signup"
                initialValues={{ countryCode: "+1" }}
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
                    () => ({
                      validator(_, value) {
                        if (!phoneValue || !isValidPhoneNumber(phoneValue)) {
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
                    onChange={setPhoneValue}
                    className="border border-blue-500 text-blue-500 rounded-md pl-2 flex items-center gap-4 h-12"
                    flagComponent={({ country }) => (
                      <div></div>
                      // <img
                      //   src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
                      //   alt={country}
                      //   className="w-5 h-4 object-cover ml-2"
                      //   loading="lazy"
                      // />
                    )}
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
                  onClick={handleGoogleLogin}
                  className="w-full gap-2 border-blue-500 hover:border-blue-600 text-blue-700 text-base font-bold flex items-center justify-center"
                >
                  Sign Up Google
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
