"use client";

import { useQuizSession } from "@/hooks/context/QuizSessionContext";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { Button, Spin } from "antd";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FormatTime from "@/utils/FormatTime";

const StartQuizPage = () => {
  const { quizSession } = useQuizSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialTime, setInitialTime] = useState<number>(0);

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
        setInitialTime(remainingTime);
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
    setLoading(true);

    try {
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

      const finalScore = result.data?.score ?? score;
      const quizId = quizSession?.quiz.id ?? "";
      const totalQuestions = quizSession?.quiz.questions.length;

      const encryptedScore = CryptoJS.AES.encrypt(
        JSON.stringify({
          score: finalScore,
          totalQuestions,
        }),
        "secret_key"
      ).toString();

      if (currentQuestionIndex < quizSession?.quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeExpired(false);
        setLoading(false);
      } else {
        window.location.href = `/index/startQuiz/${encodeURIComponent(
          encryptedScore
        )}/${quizId}`;
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setLoading(false);
    }
  };
  const progress = initialTime > 0 ? (timer / initialTime) * 100 : 0;
  const getColor = () => {
    if (progress > 60) return "#4CAF50";
    if (progress > 30) return "#FFC107";
    return "#F44336";
  };

  return (
    <Spin spinning={loading} size="large">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 text-center border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-800">
              {quizSession?.quiz.title}
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div className="w-12 h-12">
                <CircularProgressbar
                  value={progress}
                  text={FormatTime(timer)}
                  styles={buildStyles({
                    textSize: "24px",
                    pathColor: getColor(),
                    textColor: "#000",
                    trailColor: "#E0E0E0",
                    strokeLinecap: "round",
                  })}
                />
              </div>
              <div>
                <span className="text-blue-800 font-bold text-xl">
                  {currentQuestionIndex + 1} of{" "}
                  {quizSession?.quiz.questions.length}
                </span>
              </div>
              <div className="bg-blue-800 text-white px-4 py-2 rounded-md font-semibold">
                Score {score}
              </div>
            </div>
          </div>
          {timeExpired && (
            <div className="text-red-600 font-semibold mb-4">
              Your time has expired!
            </div>
          )}
          <div className="border-t-2 border-dotted border-gray-400 w-full mb-8"></div>
          <h3 className="text-xl font-bold text-gray-500 mb-6">
            {quizSession?.quiz.questions[currentQuestionIndex]?.question}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {quizSession?.quiz.questions[currentQuestionIndex]?.options.map(
              (option: string) => (
                <button
                  key={option}
                  className={`py-3 px-4 border rounded-lg text-sm font-medium bg-white border-black text-gray-500 transition-colors duration-200 ${
                    selectedAnswer === option
                      ? option ===
                        quizSession?.quiz.questions[currentQuestionIndex]
                          ?.correctAnswer
                        ? "text-green-500 border-green-500"
                        : "text-red-500 border-red-500"
                      : "bg-gray-100 hover:bg-blue-800 hover:text-white"
                  }`}
                  onClick={() => setSelectedAnswer(option)}
                  disabled={timeExpired}
                >
                  {option}
                </button>
              )
            )}
          </div>
          <Button
            type="primary"
            className="bg-blue-800 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            Next
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default StartQuizPage;
