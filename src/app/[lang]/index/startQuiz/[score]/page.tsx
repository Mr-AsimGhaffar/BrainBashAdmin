"use client";
import { useParams } from "next/navigation";

const EndQuizPage = () => {
  const searchParams = useParams<{ score: string }>();

  const finalScore = searchParams?.score
    ? parseInt(searchParams?.score, 10)
    : 0;

  const handlePlayAgain = () => {
    window.location.href = "/index/quizzesList";
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-800 mb-4">
          Your Score:{" "}
          <span className="font-bold text-blue-600">{finalScore}</span>
        </p>
        <button
          onClick={handlePlayAgain}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default EndQuizPage;
