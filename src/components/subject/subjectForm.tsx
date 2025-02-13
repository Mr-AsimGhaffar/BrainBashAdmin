import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import ImageUploader from "../upload/UploadImage";

interface SubjectFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

export default function SubjectForm({
  onSubmit,
  onCancel,
  initialValues,
}: SubjectFormProps) {
  const [form] = Form.useForm();
  const [fileId, setFileId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
      setFileId(initialValues?.fileId || null);
      // Fetch the image URL if fileId exists
      if (initialValues?.File?.id) {
        fetchFileById(initialValues?.File?.id);
      }
    } else {
      form.resetFields();
      setImageUrl(null); // Reset image URL when no initialValues
    }
  }, [initialValues, form]);

  const fetchFileById = async (id: number) => {
    try {
      const response = await fetch(`/api/files/getFileById?id=${id}`, {
        method: "GET",
      });

      if (response.ok) {
        // Handle the response as a blob (binary data)
        const blob = await response.blob();

        // Create a URL for the blob object
        const fileUrl = URL.createObjectURL(blob);

        // Set the image URL to display the file
        setImageUrl(fileUrl);
      } else {
        console.error("Failed to fetch file");
      }
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...values, fileId });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleFileUpload = (uploadedFileId: number) => {
    setFileId(uploadedFileId);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      preserve={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 text-center">
          <h1 className="font-medium text-base">
            {initialValues ? "Edit Subject" : "Add New Subject"}
          </h1>
        </div>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Please enter subject name" },
            {
              min: 2,
              message: "Subject name must be at least 2 characters long",
            },
            {
              max: 100,
              message: "Subject name must be at most 100 characters long",
            },
            {
              pattern: /^[a-zA-Z ]+$/,
              message: "Subject name must contain only letters",
            },
          ]}
        >
          <Input placeholder="Enter subject name" />
        </Form.Item>

        <Form.Item label="Image Upload">
          <ImageUploader onFileUpload={handleFileUpload} />
          {/* Display the image if imageUrl exists */}
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}
        </Form.Item>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          className="font-sansInter"
        >
          {initialValues ? "Update Subject" : "Create Subject"}
        </Button>
      </div>
    </Form>
  );
}
