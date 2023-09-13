import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Popconfirm,
  Empty,
  Select,
  Table,
  message,
} from "antd";
import Layout from "../../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import ModalForm from "../../components/Modal";
import { categoryService } from "../../services/category.service";
import { DeleteOutlined } from "@ant-design/icons";
import {
  CUSTOM_ENV,
  RANDOM,
  SIZEFORM,
  formatTime,
  getBase64,
  transformDataWithKey,
} from "../../utils/custom.env";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

interface DataType {
  key: React.Key;
  _id: any;
  slugCategory: any;
  nameCategory: any;
  imageCategory: any;
  outstandingCategory: any;
  statusCategory: any;
  createdAt: Date;
}

type Props = {
  setLoadingBarProgress: any;
};

const CategoryPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const user = useSelector((state: AppState) => state.auth.accessToken);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataEdit, setDataEdit] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isImageRequired, setIsImageRequired] = useState<any>();
  const [fileList, setFileList] = useState<any>();
  const [isImageUpdateAllowed, setIsImageUpdateAllowed] = useState<any>();

  const handleAdd = () => {
    setModalVisible(true);
    setIsEditing(false);
    setFileList(null);
  };

  const handleEdit = (data: any) => {
    setDataEdit(data);
    setIsEditing(true);
    setModalVisible(true);
    setIsImageRequired(false);
  };

  const handleCloseModal = () => {
    setIsImageRequired(true);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(false);
  };

  const handleOke = () => {
    form.submit();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
    }, 1000);
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

  const deleteBrandMutation = useMutation(
    (data) => categoryService.fetchDeleteCategory(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["categories"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const confirmDelete = (id: any) => {
    deleteBrandMutation.mutate(id);
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
      title: "NAME",
      dataIndex: "nameCategory",
      sorter: true,
      onFilter: (value: any, record: DataType) =>
        record.nameCategory.indexOf(value) === 0,
    },
    {
      title: "IMAGE",
      render: (record: DataType, index: any) => {
        return (
          <img
            className="text-center"
            src={record.imageCategory}
            alt={`Product ${index}`}
            style={{ width: "40px", cursor: "pointer" }}
          />
        );
      },
    },
    {
      title: "OUTSTANDING",
      sorter: true,
      render: (record: DataType) => (
        <div
          className={`${
            record.outstandingCategory === "outstanding"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {record.outstandingCategory === "outstanding"
            ? "Nổi Bật"
            : "Không Nổi Bật"}
        </div>
      ),
    },
    {
      title: "STATUS",
      sorter: true,
      render: (record: DataType) => (
        <div
          className={`${
            record.statusCategory === "stocking"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {record.statusCategory === "stocking" ? "Còn Hàng" : "Hết Hàng"}
        </div>
      ),
    },
    {
      title: "TIME",
      sorter: true,
      render: (record: DataType, index: any) => (
        <p key={index} className="font-medium uppercase">
          {formatTime(record.createdAt)}
        </p>
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
            title="Delete the category"
            description="Are you sure to delete this category?"
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

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue({
        nameCategory: isDataEdit.nameCategory,
        statusCategory: isDataEdit.statusCategory,
        outstandingCategory: isDataEdit.outstandingCategory,
        imageCategory: isDataEdit.imageCategory,
      });
    } else {
      form.validateFields();
    }
  }, [isEditing, isDataEdit, form]);

  const { data: isCategory, isLoading } = useQuery(
    ["categories"],
    () => categoryService.fetchAllCategories(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  useEffect(() => {
    if (isDataEdit?.imageCategory) {
      setFileList(isDataEdit.imageCategory);
      setIsImageRequired(false);
    }
    setIsImageUpdateAllowed(true);
  }, [isDataEdit]);

  const transformedData = transformDataWithKey(isCategory); // custom id to key

  const updateCategoryMutation = useMutation((data) =>
    categoryService.fetchUpdateCategory(isDataEdit.slugCategory, data)
  );
  const postCategoryMutation = useMutation((data) =>
    categoryService.fetchPostCategory(data)
  );

  const onFinish = async (data: any) => {
    data.imageCategory = fileList;
    try {
      if (isEditing) {
        if (isImageUpdateAllowed) {
          const formData = new FormData();
          formData.append("files", data.imageCategory.originFileObj);
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
          data.imageCategory = imageUrl;
          const response = await updateCategoryMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        } else {
          const response = await updateCategoryMutation.mutateAsync(data);
          if (response.status === true) {
            message.success(`${response.message}`);
          } else {
            message.error(`${response.message}`);
          }
        }
      } else {
        const formData = new FormData();
        formData.append("files", data.imageCategory.originFileObj);
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
        data.imageCategory = imageUrl;
        const response = await postCategoryMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      }

      form.resetFields();
      setModalVisible(false);
      queryClient.invalidateQueries(["categories"]);
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
        title={isEditing ? "Edit Category" : "Add Category"}
        loading={loading}
        open={modalVisible}
        onClose={handleCloseModal}
        onOke={handleOke}
        width={700}
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
                label="Name"
                name="nameCategory"
                style={{
                  marginBottom: 0,
                }}
                rules={[
                  { required: true, message: "* Name Category is required" },
                ]}
              >
                <Input size={SIZEFORM} placeholder="Laptop" />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Status"
                name="statusCategory"
                style={{
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "* Status is required" }]}
              >
                <Select size={SIZEFORM} placeholder="Trạng Thái">
                  <Select.Option value="">
                    Vui Lòng Chọn Trạng Thái
                  </Select.Option>
                  <Select.Option value="stocking">Còn Hàng</Select.Option>
                  <Select.Option value="out-of-stock">Hết Hàng</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="mt-2">
            <Form.Item
              label="Outstanding"
              name="outstandingCategory"
              style={{
                marginBottom: 0,
              }}
              rules={[{ required: true, message: "* Outstanding is required" }]}
            >
              <Select size={SIZEFORM} placeholder="Sản Phẩm Nổi Bật">
                <Select.Option value="">
                  Vui Lòng Chọn Sản Phẩm Nổi Bật
                </Select.Option>
                <Select.Option value="outstanding">Nổi Bật</Select.Option>
                <Select.Option value="notstandout">Không Nổi Bật</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="mt-2">
            <Form.Item
              label="* Image"
              name="imageCategory"
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
        </Form>
      </ModalForm>
    </Layout>
  );
};
export default CategoryPage;
