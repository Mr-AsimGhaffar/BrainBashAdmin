"use client";

import { useUser } from "@/hooks/context/AuthContext";
import { Button, Card } from "antd";
import { useRouter } from "next/navigation";

export default function CreateQuizPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const { user } = useUser();

  const CreateQuizRoute = () => {
    router.push(`/${lang}/index/manageQuizzes`);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-44">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          How to Create Quizz
        </h2>
        <p className="text-gray-600 mt-2">
          Quizzes help students learn and engage with subjects in a fun and
          challenging way, expanding general knowledge and encouraging critical
          thinking.
        </p>
        <ul className="text-gray-500 mt-4 list-decimal pl-5">
          <li>Quizzes help students learn and engage with subjects</li>
          <li>Quizzes help students learn and engage</li>
          <li>Expanding general knowledge</li>
          <li>Quizzes help students learn and engage</li>
          <li>Quizzes help students learn and engage with subjects</li>
        </ul>
        {user && (
          <Button
            type="primary"
            className="mt-4 bg-blue-700"
            onClick={CreateQuizRoute}
          >
            Create Quizz
          </Button>
        )}
      </div>
      <Card className="border border-blue-500 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-700">How to Play Quizz</h2>
        <p className="text-gray-600 mt-2">
          Quizzes help students learn and engage with subjects in a fun and
          challenging way, expanding general knowledge and encouraging critical
          thinking.
        </p>
      </Card>
    </div>
  );
}
