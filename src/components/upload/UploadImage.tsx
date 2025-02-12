"use client";

import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useState } from "react";
import type { UploadFile } from "antd/es/upload";

const ImageUploader = ({
  onFileUpload,
}: {
  onFileUpload: (id: number) => void;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps["onChange"] = ({ file, fileList }) => {
    if (file.status === "done") {
      message.success(`${file.name} uploaded successfully`);
      const fileId = file.response?.files?.[0]?.id;
      if (fileId) {
        onFileUpload(fileId); // Send fileId to parent
      } else {
        message.error("File ID not found in the response.");
      }
    } else if (file.status === "error") {
      message.error(`${file.name} upload failed.`);
    }
    setFileList(fileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  return (
    <Upload
      action="/api/files/imageUpload"
      listType="picture"
      beforeUpload={beforeUpload}
      onChange={handleChange}
      fileList={fileList}
    >
      <Button>
        <UploadOutlined className="mr-2" /> Upload Image
      </Button>
    </Upload>
  );
};

export default ImageUploader;
