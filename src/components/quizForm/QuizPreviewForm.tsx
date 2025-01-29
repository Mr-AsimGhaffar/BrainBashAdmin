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
    <Modal title="Quiz Preview" open={!!quiz} onCancel={onClose} footer={null}>
      {quiz && (
        <div>
          <p>
            <strong>Title:</strong> {quiz.title}
          </p>
          <p>
            <strong>Description:</strong> {quiz.description}
          </p>
          <p>
            <strong>Category:</strong> {quiz.category}
          </p>
          <p>
            <strong>Max Score:</strong> {quiz.maxScore}
          </p>
          <p>
            <strong>Duration:</strong> {quiz.duration} minutes
          </p>
          <p>
            <strong>Publish Date:</strong>{" "}
            {dayjs(quiz.publishDate).format("YYYY-MM-DD HH:mm")}
          </p>
          <p>
            <strong>Expiry Date:</strong>{" "}
            {dayjs(quiz.expiryDate).format("YYYY-MM-DD HH:mm")}
          </p>
          <h4>Questions:</h4>
          <ul>
            {quiz?.questions && quiz.questions.length > 0 ? (
              <ul>
                {quiz.questions.map((q) => (
                  <li key={q.id}>
                    <strong>{q.question}</strong>
                    <ul>
                      {q.options?.map((option, index) => (
                        <li key={index}>{option}</li>
                      )) || <li>No options available</li>}
                    </ul>
                    <p>
                      <strong>Answer:</strong>{" "}
                      {q.answer || "No answer provided"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No questions available</p>
            )}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default QuizPreviewForm;
