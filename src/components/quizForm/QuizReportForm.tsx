import { ApiQuiz } from "@/app/[lang]/index/manageQuizzes/page";
import { Modal } from "antd";

const QuizReportForm = ({
  quiz,
  onClose,
}: {
  quiz: ApiQuiz | null;
  onClose: () => void;
}) => {
  return (
    <Modal
      title={
        <h2 className="text-xl font-semibold text-gray-800">Quiz Report</h2>
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
              <strong>Total Participants:</strong> {quiz?.totalParticipants}
            </p>
            <p className="text-gray-700">
              <strong>Average Score:</strong> {quiz?.averageScore}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default QuizReportForm;
