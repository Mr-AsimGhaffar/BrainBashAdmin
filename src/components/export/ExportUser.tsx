import { message } from "antd";

const handleExportUser = async () => {
  try {
    const response = await fetch(`/api/exportUser`, {
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
      a.download = "user_logs.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      message.success("CSV file downloaded successfully!");
    } else {
      message.error("Failed to export users.");
    }
  } catch (error) {
    console.error("Error exporting users:", error);
    message.error("An error occurred while exporting users.");
  }
};

export default handleExportUser;
