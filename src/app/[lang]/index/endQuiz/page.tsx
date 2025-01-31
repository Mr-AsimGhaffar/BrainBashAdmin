"use client";
import { useSearchParams } from "next/navigation";

const EndQuizPage = () => {
  const searchParams = useSearchParams();
  const score = searchParams?.get("score");

  const handlePlayAgain = () => {
    window.location.href = "/index/quizDetail";
  };

  return (
    <div>
      <h1>Congratulations!</h1>
      <p>Your Score: {score}</p>
      <button onClick={handlePlayAgain}>Play Again</button>
    </div>
  );
};

export default EndQuizPage;
