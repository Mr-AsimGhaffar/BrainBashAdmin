"use client";

import { Input, message, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/lib/definitions";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes/getQuizzes");
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const { data } = await response.json();
      const formattedData = data.map((quiz: any) => ({
        id: quiz.id,
        title: quiz.title,
      }));
      setQuizzes(formattedData);
    } catch (error) {
      message.error("Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId: string = "") => {
    router.push(`/index/quizzesList/${quizId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-16">
        <h1 className="text-3xl font-bold font-montserrat">Quizz List</h1>
        <div>
          <Input
            placeholder="Search here"
            prefix={<SearchOutlined className="text-blue-500" />}
            className="w-64 border border-blue-500 rounded-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quizzes.map((quiz, index) => (
          <div
            key={index}
            className="shadow-md cursor-pointer"
            onClick={() => handleQuizClick(quiz.id)}
          >
            <div className="grid grid-cols-3">
              <div className="p-4 col-span-1 bg-blue-800 text-center flex flex-col items-center justify-center text-white font-workSans text-lg font-semibold rounded-l-lg">
                {quiz.title}
                <FaArrowRight className="text-orange-300 mt-2" />
              </div>
              <div className="col-span-2">
                <img
                  alt={quiz.title}
                  src="/images/chemistry.png"
                  className="object cover h-40 w-full rounded-r-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination defaultCurrent={1} total={50} pageSize={5} />
      </div>
    </div>
  );
}
