"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Spin } from "antd";
import { Quiz } from "@/lib/definitions";
import { useQuizSession } from "@/hooks/context/QuizSessionContext";
import { QRCodeCanvas } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QuizDetailPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
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
    setLoading(true);
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
        router.push(`/${lang}/index/startQuiz`);
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes.length > 0) {
      const result = detectedCodes[0];
      if (result.text) {
        router.push(result.text);
      }
    }
  };

  return (
    <Spin spinning={loading} size="large">
      <div>
        <div>
          <img
            src="/images/quizDetail.png"
            alt="Quiz Detail"
            className="rounded-lg w-full"
          />
        </div>
        <div className="mt-10 grid grid-cols-3 items-center">
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
            <p className="text-lg font-semibold mb-4">
              Scan QR Code to Start Quiz
            </p>
            <QRCodeCanvas
              value={`${window.location.origin}/${lang}/index/startQuiz`}
              size={128}
            />
          </div>
          <div>
            <div className="py-8 shadow-2xl rounded-lg flex flex-col items-center justify-center h-full">
              <p className="text-blue-600 font-medium text-lg">
                17 Quiz Questions
              </p>
              <h2 className="text-4xl font-bold text-yellow-500">100/80</h2>
              <p className="text-gray-600 text-yellow-500">Score</p>
            </div>
          </div>
        </div>
        {isScanning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <Scanner
                onScan={handleScan}
                onError={(err) => console.error(err)}
              />
              <Button onClick={() => setIsScanning(false)} className="mt-4">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
}
