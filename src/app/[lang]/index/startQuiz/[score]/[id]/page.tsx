"use client";

import { LeaderboardEntry } from "@/lib/definitions";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const EndQuizPage = () => {
  const params = useParams<{ score: string; id: string }>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState("Score");

  const encryptedScore = params?.score ?? "";
  const quizId = params?.id ?? "";

  let finalScore = 0;
  let totalQuestions = 0;

  if (encryptedScore) {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(
        decodeURIComponent(encryptedScore),
        "secret_key"
      );
      const decryptedData = JSON.parse(
        decryptedBytes.toString(CryptoJS.enc.Utf8)
      );
      finalScore = decryptedData.score || 0;
      totalQuestions = decryptedData.totalQuestions || 0;
    } catch (error) {
      console.error("Error decrypting score:", error);
    }
  }

  const handlePlayAgain = () => {
    window.location.href = "/index/quizzesList";
  };

  useEffect(() => {
    if (activeTab === "Leaderboard" && leaderboard.length === 0) {
      const fetchLeaderboard = async () => {
        try {
          const response = await fetch(
            `/api/leaderboard/getLeaderboard?id=${quizId}`
          );
          const data = await response.json();
          if (response.ok) {
            setLeaderboard(data.data);
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error("Error fetching leaderboard:", error);
          alert("Failed to load leaderboard");
        }
      };

      fetchLeaderboard();
    }
  }, [activeTab, quizId, leaderboard.length]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 text-center">
        <div className="flex justify-center gap-8 border-b pb-4 mb-4">
          {["Score", "Leaderboard"].map((tab) => (
            <button
              key={tab}
              className={`text-lg font-semibold ${
                activeTab === tab ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-800 transition`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Score" && (
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
              CONGRATULATIONS
            </h1>
            <p className="text-5xl font-bold text-gray-600 mb-6">
              {finalScore}/{totalQuestions}
            </p>
            <p className="text-3xl font-bold text-gray-800 mb-6">
              <span className="bg-blue-800 text-white px-10 py-2 rounded-md font-semibold">
                Score {finalScore}
              </span>
            </p>
            <p>
              <button
                onClick={handlePlayAgain}
                className="text-blue-700 underline hover:text-blue-900 transition"
              >
                Play Again
              </button>
            </p>
          </div>
        )}

        {activeTab === "Leaderboard" && (
          <div className="mt-4 bg-gray-100 p-4 rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Leaderboard
            </h2>
            <ul className="space-y-2">
              {leaderboard.map((entry, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-gray-800"
                >
                  <span className="flex-1 text-left">
                    {index + 1}. {entry?.username}
                  </span>
                  <span className="flex-1 text-left">
                    {entry?.rank} Ranking
                  </span>

                  <span className="flex-1 text-left font-bold text-blue-600">
                    {entry?.score} Score
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndQuizPage;
