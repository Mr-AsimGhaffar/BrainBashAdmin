import { message } from "antd";

const handleExportFeedback = async () => {
  try {
    const response = await fetch(`/api/feedback/exportFeedback`, {
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
      a.download = "feedback_logs.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      message.success("CSV file downloaded successfully!");
    } else {
      message.error("Failed to export feedbacks.");
    }
  } catch (error) {
    console.error("Error exporting feedbacks:", error);
    message.error("An error occurred while exporting feedbacks.");
  }
};

export default handleExportFeedback;
