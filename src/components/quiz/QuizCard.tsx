"use client";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface QuizCardProps {
  id: string;
  title: string;
  image: string;
}

export default function QuizCard({ id, title, image }: QuizCardProps) {
  const router = useRouter();

  const handleQuizClick = () => {
    router.push(`/index/quizzesList/${id}`);
  };

  return (
    <div className="shadow-md cursor-pointer" onClick={handleQuizClick}>
      <div className="grid grid-cols-3">
        <div className="p-4 col-span-1 bg-blue-800 text-center flex flex-col items-center justify-center text-white font-workSans text-lg font-semibold rounded-l-lg">
          {title}
          <FaArrowRight className="text-orange-300 mt-2" />
        </div>
        <div className="col-span-2">
          <img
            alt={title}
            src={image}
            className="object-cover h-40 w-full rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
}
