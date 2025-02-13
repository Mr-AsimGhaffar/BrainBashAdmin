"use client";
import QuizCard from "@/components/quiz/QuizCard";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function QuizHome() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const carouselRef = useRef<CarouselRef>(null);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes/getQuizzes");
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const { data } = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to fetch quizzes", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Popular Quizzes
        </h2>

        <div className="relative">
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 shadow-md"
            onClick={() => carouselRef.current?.prev()}
          >
            <FaArrowLeft />
          </button>
          <Carousel
            ref={carouselRef}
            autoplay
            dots={false}
            slidesToShow={4}
            className="space-x-4"
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 768, settings: { slidesToShow: 1 } },
            ]}
          >
            {quizzes.map((quiz: any, index: number) => (
              <div key={index} className="px-2">
                <QuizCard
                  id={quiz.id.toString()}
                  title={quiz.title}
                  image={
                    quiz?.file?.base64Content
                      ? `data:image/png;base64,${quiz.file.base64Content}`
                      : "/images/NoImage.png"
                  }
                />
              </div>
            ))}
          </Carousel>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10 shadow-md"
            onClick={() => carouselRef.current?.next()}
          >
            <FaArrowRight />
          </button>
        </div>
      </section>
      <div className="flex justify-between items-center">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-blue-800">
              Hi! Welcome To Quiz Website, Are you ready to learn?
            </h1>
            <p className="text-gray-600 mb-8">
              Quizzes help students learn and engage with subjects in a fun and
              challenging way, expanding general knowledge and encouraging
              critical thinking.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
              Start Learning
            </button>
          </div>
        </div>
        <div>
          <img src="/images/quizHome.png" className="rounded-md" />
        </div>
      </div>
    </div>
  );
}
