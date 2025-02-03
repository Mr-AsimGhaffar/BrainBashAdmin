"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "antd";
import { Quiz } from "@/lib/definitions";
import { useQuizSession } from "@/hooks/context/QuizSessionContext";

export default function QuizDetailPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const { setQuizSession } = useQuizSession();
  const router = useRouter();
  const searchParams = useParams<{ quizId: string }>();

  const fetchQuizDetails = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quizzes/getQuizzesById?id=${quizId}`);
      const data = await response.json();
      if (data.data) {
        setQuiz(data.data);
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  useEffect(() => {
    const quizId = searchParams?.quizId;
    if (quizId) {
      fetchQuizDetails(quizId);
    }
  }, [searchParams?.quizId]);

  const handleStartQuiz = async () => {
    try {
      const response = await fetch("/api/quizSession/startQuizSession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: searchParams?.quizId,
        }),
      });
      const result = await response.json();

      if (result.data) {
        setIsQuizStarted(true);
        setQuizSession(result.data.quizSession);
        router.push(`/index/startQuiz`);
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  return (
    <div>
      <div>
        <img
          src="/images/quizDetail.png"
          alt="Chemistry Quiz"
          className="rounded-lg w-full"
        />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-12">
        <div className="py-8">
          <h1 className="text-5xl font-bold text-blue-800">
            {quiz?.title || "No Title"}
          </h1>
          <p className="text-gray-400 text-lg mt-4">
            {quiz?.description || "No Description"}
          </p>
          {!isQuizStarted && (
            <Button
              type="primary"
              size="large"
              className="mt-4 bg-yellow-500 border-none text-white hover:bg-yellow-600"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </Button>
          )}
        </div>
        <div>
          <div className="py-8 shadow-2xl rounded-lg flex flex-col items-center justify-center h-full">
            <p className="text-blue-600 font-medium text-lg">
              17 Quiz Questions
            </p>
            <h2 className="text-4xl font-bold text-yellow-500">100/80</h2>
            <p className="text-gray-600 text-yellow-500">Score</p>
            <Button
              type="primary"
              className="mt-3 bg-blue-800 border-none hover:bg-blue-700"
            >
              Excellent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
