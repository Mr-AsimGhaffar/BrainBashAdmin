import { message } from "antd";

const handleExportQuizzes = async () => {
  try {
    const response = await fetch(`/api/quizzes/exportQuiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quiz_logs.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      message.success("CSV file downloaded successfully!");
    } else {
      message.error("Failed to export quizzes.");
    }
  } catch (error) {
    console.error("Error exporting quizzes:", error);
    message.error("An error occurred while exporting quizzes.");
  }
};

export default handleExportQuizzes;
