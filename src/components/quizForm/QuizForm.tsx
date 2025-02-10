"use client";
import { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, Space, message } from "antd";
import type { FormInstance } from "antd";
import { Quiz } from "@/lib/definitions";

interface Subject {
  id: number;
  name: string;
}

export interface Question {
  questionText: string;
  type: "Multiple Choice" | "True/False";
  options?: string[];
  correctAnswer: string;
}

interface QuizFormProps {
  form: FormInstance;
  onFinish: (values: Quiz) => void;
  onCancel: () => void;
  initialValues?: Quiz;
  quizId?: number;
}

const QuizForm = ({
  form,
  onFinish,
  onCancel,
  initialValues,
  quizId,
}: QuizFormProps) => {
  const [subjectName, setSubjectName] = useState<Subject[]>([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const response = await fetch("/api/questions/getQuestionsTypes");
        const data = await response.json();
        if (data?.data) {
          setQuestionTypes(
            data.data.map((type: string) => ({ value: type, label: type }))
          );
        }
      } catch (error) {
        console.error("Error fetching question types:", error);
      }
    };

    fetchQuestionTypes();
    form.setFieldsValue({
      questions: [{ question: "", type: "" }],
    });
  }, []);

  const deleteQuestion = async (
    id: string,
    remove: (index: number) => void,
    index: number
  ) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/questions/deleteQuestion?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        message.success("Question deleted successfully!");
        remove(index); // Remove from UI after successful deletion
      } else {
        const data = await response.json();
        message.error(data.message || "Failed to delete question.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      message.error("An error occurred while deleting the question.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/subject/getSubjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubjectName(data.data || []);
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, []);

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        category: initialValues.subjectId,
        publishDate: initialValues.publishDate,
        expiryDate: initialValues.expiryDate,
      });
    }
  }, [initialValues, form]);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      {/* Title */}
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input />
      </Form.Item>

      {/* Description */}
      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} />
      </Form.Item>

      {/* Category */}
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select
          showSearch
          placeholder="Select a subject"
          loading={loading}
          options={
            subjectName?.map((subject) => ({
              value: subject.id,
              label: subject.name,
            })) || []
          }
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>

      {/* Maximum Score */}
      <Form.Item
        label="Maximum Score"
        name="maxScore"
        rules={[{ required: true, message: "Please input the maximum score!" }]}
      >
        <Input type="number" />
      </Form.Item>

      {/* Duration */}
      <Form.Item
        label="Duration (minutes)"
        name="duration"
        rules={[{ required: true, message: "Please input the duration!" }]}
      >
        <Input type="number" />
      </Form.Item>

      {/* Publish Date */}
      <Form.Item
        label="Publish Date"
        name="publishDate"
        rules={[{ required: true, message: "Please select a publish date!" }]}
      >
        <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" />
      </Form.Item>

      {/* Expiry Date */}
      <Form.Item
        label="Expiry Date"
        name="expiryDate"
        rules={[{ required: true, message: "Please select an expiry date!" }]}
      >
        <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" />
      </Form.Item>

      {/* Questions Section */}
      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  marginBottom: 16,
                  border: "1px solid #ddd",
                  padding: 16,
                  borderRadius: 8,
                }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Form.Item name={[name, "id"]} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Question"
                    name={[name, "question"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input the question text!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Correct Answer"
                    name={[name, "answer"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input the correct answer!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    label="Type"
                    name={[name, "type"]}
                    rules={[
                      { required: true, message: "Please select a type!" },
                    ]}
                  >
                    <Select options={questionTypes} />
                  </Form.Item>

                  <Form.Item shouldUpdate>
                    {() => {
                      const isMultipleChoice =
                        form.getFieldValue(["questions", name, "type"]) ===
                        "MULTIPLE_CHOICE";
                      return (
                        <div
                          style={{
                            display: isMultipleChoice ? "block" : "none",
                          }}
                        >
                          <Form.List name={[name, "options"]}>
                            {(
                              optionFields,
                              { add: addOption, remove: removeOption }
                            ) => (
                              <>
                                {optionFields.map((optionField, index) => (
                                  <Form.Item
                                    key={optionField.key}
                                    label={`Option ${index + 1}`}
                                    name={[optionField.name]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input the option!",
                                      },
                                    ]}
                                  >
                                    <Input
                                      addonAfter={
                                        <Button
                                          danger
                                          onClick={() =>
                                            removeOption(optionField.name)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      }
                                    />
                                  </Form.Item>
                                ))}
                                <Button
                                  type="dashed"
                                  onClick={() => addOption()}
                                  block
                                >
                                  Add Option
                                </Button>
                              </>
                            )}
                          </Form.List>
                        </div>
                      );
                    }}
                  </Form.Item>

                  <Button
                    onClick={() => {
                      const questionId = form.getFieldValue([
                        "questions",
                        name,
                        "id",
                      ]);
                      if (questionId) {
                        deleteQuestion(questionId, remove, name);
                      } else {
                        remove(name); // Remove unsaved question directly
                      }
                    }}
                    danger
                    block
                  >
                    Remove Question
                  </Button>
                </Space>
              </div>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              Add Question
            </Button>
          </>
        )}
      </Form.List>
      {/* Form Actions */}
      <Form.Item>
        <div className="pt-4">
          <Button type="primary" htmlType="submit">
            {initialValues?.id ? "Update Quiz" : "Create Quiz"}
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default QuizForm;
