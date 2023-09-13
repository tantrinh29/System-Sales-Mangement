import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Upload,
  Empty,
  message,
} from "antd";
import Layout from "../../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import ModalForm from "../../components/Modal";
import { CKEditor } from "ckeditor4-react";
import { DeleteOutlined } from "@ant-design/icons";
import {
  CUSTOM_ENV,
  RANDOM,
  SIZEFORM,
  formatTime,
  getBase64,
  transformDataWithKey,
} from "../../utils/custom.env";

import { blogService } from "../../services/blog.service";
import axios from "axios";
import { AppState } from "../../store";
import { useSelector } from "react-redux";

interface DataType {
  key: React.Key;
  _id: any;
  slugBlog: any;
  titleBlog: any;
  userBlog: any;
  imageBlog: any;
  contentBlog: any;
  descriptionBlog: any;
  outstandingBlog: any;
  createdAt: Date;
  formatTime: () => void;
}

type Props = {
  setLoadingBarProgress: any;
};

const BlogPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const [form] = Form.useForm();
  const user = useSelector((state: AppState) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataEdit, setDataEdit] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editorContent, setEditorContent] = useState<any>();
  const [editorDescription, setEditorDescription] = useState<any>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isImageRequired, setIsImageRequired] = useState<any>();
  const [fileList, setFileList] = useState<any>();
  const [isImageUpdateAllowed, setIsImageUpdateAllowed] = useState<any>();

  const { data: isBlog, isLoading } = useQuery(
    ["blogs"],
    () => blogService.fetchAllBlogs(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const handleAdd = () => {
    setEditorContent(""); // Reset CKEditor content
    setEditorDescription("");
    setModalVisible(true);
    setIsEditing(false);
  };

  const handleEdit = (data: any) => {
    setDataEdit(data);
    setEditorContent(data?.contentBlog);
    setEditorDescription(data?.descriptionBlog);
    setModalVisible(true);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEditing(false);
    setEditorContent(""); // Reset CKEditor content
    setEditorDescription("");
    form.resetFields();
  };

  const handleOke = () => {
    form.submit();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
    }, 1000);
  };

  const deleteBlogMutation = useMutation(
    (data) => blogService.fetchDeleteBlog(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["blogs"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const confirmDelete = (id: any) => {
    deleteBlogMutation.mutate(id);
  };

  const handleImageChange = async (info: any) => {
    let fileList = info.file;
    if (fileList.response) {
      fileList.url = fileList.response.url;
    }
    if (!fileList.url && !fileList.preview) {
      fileList.preview = await getBase64(fileList.originFileObj);
    }
    setIsImageUpdateAllowed(true);
    setFileList(fileList);
    setIsImageRequired(!fileList);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      render: (text, record, index) => index + 1,
    },
    {
      title: "AUTHOR",
      dataIndex: "userBlog",
      sorter: true,
      onFilter: (value: any, record: DataType) =>
        record.userBlog.indexOf(value) === 0,
    },
    {
      title: "IMAGE",
      render: (record: DataType, index: any) => {
        return (
          <img
            className="text-center"
            src={record.imageBlog}
            alt={`Product ${index}`}
            style={{ width: "100px", textAlign: "center", cursor: "pointer" }}
          />
        );
      },
    },
    {
      title: "TITLE",
      dataIndex: "titleBlog",
      sorter: true,
      onFilter: (value: any, record: DataType) =>
        record.titleBlog.indexOf(value) === 0,
    },
    {
      title: "OUTSTANDING",
      sorter: true,
      render: (record: DataType) => (
        <div
          className={`${
            record.outstandingBlog === "outstanding"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {record.outstandingBlog === "outstanding"
            ? "Nổi Bật"
            : "Không Nổi Bật"}
        </div>
      ),
    },
    {
      title: "TIME",
      sorter: true,
      render: (record: DataType) => (
        <p className="font-medium uppercase">{formatTime(record.createdAt)}</p>
      ),
    },

    {
      title: "ACTION",
      render: (record: DataType, index: any) => (
        <div>
          <button
            key={`edit-${index}`}
            onClick={() => handleEdit(record)}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </button>{" "}
          /{" "}
          <Popconfirm
            key={`delete-${index}`}
            title="Delete the blog"
            description="Are you sure to delete this blog?"
            placement="topLeft"
            onConfirm={() => confirmDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button
              key={`delete-btn-${index}`}
              className="font-medium text-red-600 dark:text-blue-500 hover:underline"
            >
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // const onChange: TableProps<DataType>["onChange"] = (
  //   pagination,
  //   filters,
  //   sorter,
  //   extra
  // ) => {
  //   // console.log("params", pagination, filters, sorter, extra);
  // };

  const handleEditorContentChange = (event: any) => {
    const data = event.editor.getData();
    setEditorContent(data);
  };

  const handleEditorDescriptionChange = (event: any) => {
    const data = event.editor.getData();
    setEditorDescription(data);
  };

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue({
        titleBlog: isDataEdit.titleBlog,
        contentBlog: isDataEdit.contentBlog,
        imageBlog: isDataEdit.imageBlog,
        outstandingBlog: isDataEdit.outstandingBlog,
        descriptionBlog: isDataEdit.descriptionBlog,
        userBlog: isDataEdit.userBlog,
      });
    } else {
      form.resetFields();
    }
  }, [isEditing, isDataEdit, form]);

  useEffect(() => {
    if (isDataEdit?.imageBlog) {
      setFileList(isDataEdit.imageBlog);
      setIsImageRequired(false);
    }
    setIsImageUpdateAllowed(true);
  }, [isDataEdit]);

  const transformedData = transformDataWithKey(isBlog); // custom id to key

  const updateBlogMutation = useMutation((data) =>
    blogService.fetchUpdateBlog(isDataEdit.slugBlog, data)
  );
  const postBlogMutation = useMutation((data) =>
    blogService.fetchPostBlog(data)
  );

  const onFinish = async (data: any) => {
    data.contentBlog = editorContent;
    data.descriptionBlog = editorDescription;
    data.imageBlog = fileList;
    try {
      if (isEditing) {
        if (isImageUpdateAllowed) {
          const formData = new FormData();
          formData.append("files", data.imageBlog.originFileObj);
          const uploadResponse = await axios.post(
            `${CUSTOM_ENV.API_URL}/media/upload-image`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${user}`,
              },
            }
          );

          const imageUrl = uploadResponse.data.fileUrls[0];
          data.imageBlog = imageUrl;
          const response = await updateBlogMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        } else {
          const response = await updateBlogMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        }
      } else {
        const formData = new FormData();
        formData.append("files", data.imageBlog.originFileObj);
        const uploadResponse = await axios.post(
          `${CUSTOM_ENV.API_URL}/media/upload-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user}`,
            },
          }
        );
        const imageUrl = uploadResponse.data.fileUrls[0];
        data.imageBlog = imageUrl;
        const response = await postBlogMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      }
      form.resetFields();
      setModalVisible(false);
      queryClient.invalidateQueries(["blogs"]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = () => {
    setFileList(null);
    setIsImageRequired(true);
  };

  const validateFileList = () => {
    if (!fileList) {
      return setIsImageRequired(true);
    }
    return Promise.resolve();
  };

  return (
    <Layout>
      <div className="flex justify-between">
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            className="bg-blue-500"
            disabled={!hasSelected}
            loading={loading}
          >
            Delete
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected
              ? `Selected delete ${selectedRowKeys.length} items`
              : ""}
          </span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Button className="bg-blue-500" type="primary" onClick={handleAdd}>
            ADD
          </Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        bordered={true}
        columns={columns}
        loading={isLoading}
        dataSource={transformedData}
        size={"small"}
      />
      <ModalForm
        title={isEditing ? "Edit Blog" : "Add Blog"}
        loading={loading}
        open={modalVisible}
        onClose={handleCloseModal}
        onOke={handleOke}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            style={{ background: "#1677ff" }}
            onClick={() => form.submit()}
            loading={loading}
          >
            {isEditing ? "Update" : "Add"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Form.Item
                label="Title"
                name="titleBlog"
                style={{
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "* Title is required" }]}
              >
                <Input size={SIZEFORM} placeholder="Title ..." />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Outstanding"
                name="outstandingBlog"
                style={{
                  marginBottom: 0,
                }}
                rules={[
                  { required: true, message: "* Outstanding is required" },
                ]}
              >
                <Select size={SIZEFORM} placeholder="Tin Tức Nổi Bật">
                  <Select.Option value="">
                    Vui Lòng Chọn Tin Tức Nổi Bật
                  </Select.Option>
                  <Select.Option value="outstanding">Nổi Bật</Select.Option>
                  <Select.Option value="notstandout">
                    Không Nổi Bật
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="* Image"
                name="imageBlog"
                style={{
                  marginBottom: 0,
                }}
                rules={[
                  {
                    validator: validateFileList,
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  onChange={handleImageChange}
                  onRemove={handleRemove}
                  accept=".jpg,.png"
                  multiple={false} // Chỉ cho phép tải lên 1 ảnh
                  showUploadList={false}
                >
                  {fileList ? null : <Button size={SIZEFORM}>Upload</Button>}
                </Upload>
                {fileList ? (
                  <>
                    <img
                      className="mt-4"
                      width={100}
                      src={fileList.length ? fileList : fileList.preview}
                      alt=""
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleRemove()}
                    />
                  </>
                ) : (
                  <Empty
                    className="text-center"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
                {isImageRequired && (
                  <div className="text-red-500">* Images is required</div>
                )}
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Author"
                name="userBlog"
                style={{
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "* Author is required" }]}
              >
                <Input size={SIZEFORM} placeholder="Author ..." />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Content"
                name="contentBlog"
                rules={[
                  () => ({
                    validator(_) {
                      if (!editorContent) {
                        return Promise.reject(
                          new Error("* Content is required")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <CKEditor
                  initData={editorContent}
                  data={editorContent}
                  onChange={handleEditorContentChange}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Description"
                name="descriptionBlog"
                rules={[
                  () => ({
                    validator(_) {
                      if (!editorDescription) {
                        return Promise.reject(
                          new Error("* Description is required")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <CKEditor
                  initData={editorDescription}
                  data={editorDescription}
                  onChange={handleEditorDescriptionChange}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </ModalForm>
    </Layout>
  );
};
export default BlogPage;
