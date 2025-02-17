"use client";

import { Input, message, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import QuizCard from "@/components/quiz/QuizCard";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes/getQuizzes");
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const { data } = await response.json();
      setQuizzes(data);
    } catch (error) {
      message.error("Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between py-16">
        <h1 className="text-3xl font-bold font-montserrat">Quiz List</h1>
        <div>
          <Input
            placeholder="Search here"
            prefix={<SearchOutlined className="text-blue-500" />}
            className="w-64 border border-blue-500 rounded-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quizzes.map((quiz: any, index: number) => (
          <QuizCard
            key={index}
            id={quiz.id.toString()}
            title={quiz.title}
            image={
              quiz?.file?.base64Content
                ? `data:image/png;base64,${quiz.file.base64Content}`
                : "/images/NoImage.png"
            }
          />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination defaultCurrent={1} total={50} pageSize={5} />
      </div>
    </div>
  );
}
