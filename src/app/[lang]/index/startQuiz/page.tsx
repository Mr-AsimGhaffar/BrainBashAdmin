"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const StartQuizPage = () => {
  const searchParams = useParams<{ sessionId: string }>();

  const [quizSession, setQuizSession] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);

  const fetchSession = async (sessionId: string) => {
    const response = await fetch(
      `/api/quizSession/getQuizSession?sessionId=${sessionId}`
    );
    const result = await response.json();
    setQuizSession(result.data);
    const quizEndTime = new Date(result.data.endTime).getTime();
    const quizStartTime = new Date(result.data.startTime).getTime();
    setTimer((quizEndTime - quizStartTime) / 1000);
  };

  useEffect(() => {
    const sessionId = searchParams?.sessionId;
    if (sessionId) {
      fetchSession(sessionId);
    }
  }, [searchParams?.sessionId]);

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
    if (
      selectedAnswer ===
      quizSession?.quiz.questions[currentQuestionIndex]?.correctAnswer
    ) {
      setScore(score + 1);
    }

    await fetch("/api/quizSession/submitQuizAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: searchParams?.sessionId,
        questionId: quizSession?.quiz.questions[currentQuestionIndex]?.id,
        selectedAnswer,
      }),
    });

    if (currentQuestionIndex < quizSession?.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeExpired(false);
    } else {
      window.location.href = `/index/endQuiz?score=${score}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          What Very Big Thing Happened on This Day?
        </h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">
            {currentQuestionIndex + 1} of {quizSession?.quiz.questions.length}
          </span>
          <span className="text-gray-600">Score: {score}</span>
        </div>
        <div className="text-red-500 font-bold mb-4">
          Time Remaining: {timer} seconds
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
