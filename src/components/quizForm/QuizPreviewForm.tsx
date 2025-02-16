import { ApiQuiz } from "@/app/[lang]/index/manageQuizzes/page";
import { Modal } from "antd";
import dayjs from "dayjs";

const QuizPreviewForm = ({
  quiz,
  onClose,
}: {
  quiz: ApiQuiz | null;
  onClose: () => void;
}) => {
  return (
    <Modal
      title={
        <h2 className="text-xl font-semibold text-gray-800">Quiz Preview</h2>
      }
      open={!!quiz}
      onCancel={onClose}
      footer={null}
      centered
    >
      {quiz && (
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong>Title:</strong> {quiz.title}
            </p>
            <p className="text-gray-700">
              <strong>Category:</strong> {quiz.category}
            </p>
            <p className="text-gray-700">
              <strong>Max Score:</strong> {quiz.maxScore}
            </p>
            <p className="text-gray-700">
              <strong>Duration:</strong> {quiz.duration} minutes
            </p>
            <p className="text-gray-700">
              <strong>Publish Date:</strong>{" "}
              {dayjs(quiz.publishDate).format("YYYY-MM-DD HH:mm")}
            </p>
            <p className="text-gray-700">
              <strong>Expiry Date:</strong>{" "}
              {dayjs(quiz.expiryDate).format("YYYY-MM-DD HH:mm")}
            </p>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
            {quiz?.questions && quiz.questions.length > 0 ? (
              <ul className="space-y-3">
                {quiz.questions.map((q) => (
                  <li key={q.id} className="p-4 border rounded-lg bg-gray-100">
                    <p className="font-medium text-gray-800">{q.question}</p>
                    <ul className="mt-2 space-y-1 pl-4 list-disc list-inside">
                      {q.options?.map((option, index) => (
                        <li key={index} className="text-gray-700">
                          {option}
                        </li>
                      )) || (
                        <li className="text-gray-500">No options available</li>
                      )}
                    </ul>
                    <p className="mt-2 text-green-700 font-semibold">
                      Answer: {q.answer || "No answer provided"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No questions available</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default QuizPreviewForm;
