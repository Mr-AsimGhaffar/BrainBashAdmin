"use client";

import { useQuizSession } from "@/hooks/context/QuizSessionContext";
import FormatTime from "@/utils/FormatTime";
import { useState, useEffect } from "react";

const StartQuizPage = () => {
  const { quizSession } = useQuizSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);

  useEffect(() => {
    if (quizSession?.quiz) {
      const quizEndTime = new Date(quizSession.endTime).getTime();
      const quizStartTime = new Date(quizSession.startTime).getTime();
      const currentTime = new Date().getTime(); // Get the current time

      // Calculate the remaining time in seconds
      const remainingTime = Math.floor((quizEndTime - currentTime) / 1000);

      // Ensure the remaining time is positive, if not set it to 0
      if (remainingTime > 0) {
        setTimer(remainingTime);
      } else {
        setTimer(0);
        setTimeExpired(true);
      }
    }
  }, [quizSession]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeExpired(true);
            handleNextQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleNextQuestion = async () => {
    const response = await fetch("/api/quizSession/submitQuizAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: quizSession?.id,
        questionId: quizSession?.quiz.questions[currentQuestionIndex]?.id,
        answer: selectedAnswer,
      }),
    });

    const result = await response.json();

    if (result.data?.score !== undefined) {
      setScore(result.data.score);
    }

    if (currentQuestionIndex < quizSession?.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeExpired(false);
    } else {
      window.location.href = `/index/startQuiz/${result.data?.score || score}`;
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {quizSession?.quiz.title}
        </h2>
        <div className="flex justify-left mb-4">
          <span className="text-gray-600">
            Questions {currentQuestionIndex + 1} of{" "}
            {quizSession?.quiz.questions.length}
          </span>
        </div>
        <div className="text-red-500 font-bold mb-4">
          Time Remaining: {FormatTime(timer)}
        </div>
        {timeExpired && (
          <div className="text-red-600 font-semibold mb-4">
            Your time has expired!
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {quizSession?.quiz.questions[currentQuestionIndex]?.question}
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {quizSession?.quiz.questions[currentQuestionIndex]?.options.map(
            (option: string) => (
              <button
                key={option}
                className={`py-3 px-4 border rounded-lg text-gray-700 text-sm font-medium transition-colors duration-200 ${
                  selectedAnswer === option
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-blue-200"
                }`}
                onClick={() => setSelectedAnswer(option)}
                disabled={timeExpired}
              >
                {option}
              </button>
            )
          )}
        </div>
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          onClick={handleNextQuestion}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StartQuizPage;
