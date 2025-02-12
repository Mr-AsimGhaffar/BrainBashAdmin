import { message } from "antd";

const handleExportAccessLog = async () => {
  try {
    const response = await fetch(`/api/accessLogs/exportAccessLogs`, {
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
      a.download = "access_logs.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      message.success("CSV file downloaded successfully!");
    } else {
      message.error("Failed to export logs.");
    }
  } catch (error) {
    console.error("Error exporting logs:", error);
    message.error("An error occurred while exporting logs.");
  }
};

export default handleExportAccessLog;
