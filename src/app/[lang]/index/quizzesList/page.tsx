"use client";

import { message, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import QuizCard from "@/components/quiz/QuizCard";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/quizzes/getQuizzes?page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const { quizzes, pagination } = await response.json();
      setQuizzes(quizzes);
      setTotalItems(pagination.total);
    } catch (error) {
      message.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-16">
        <h1 className="text-3xl font-bold font-montserrat">Quiz List</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <>
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
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
            />
          </div>
        </>
      )}
    </div>
  );
}
