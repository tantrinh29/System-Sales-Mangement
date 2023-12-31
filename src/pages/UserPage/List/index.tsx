import React, { useEffect, useState } from "react";
import { Button, Form, Popconfirm, Select, Table, message } from "antd";
import Layout from "../../../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ModalForm from "../../../components/Modal";
import {
  RANDOM,
  SIZEFORM,
  formatTime,
  transformDataWithKey,
} from "../../../utils/custom.env";
import { userService } from "../../../services/user.service";
import { Link } from "react-router-dom";

type Props = {
  setLoadingBarProgress: any;
};

const UserPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataEdit, setDataEdit] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState<any>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEdit = (data: any) => {
    setDataEdit(data);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEditing(false);
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

  const deleteUserMutation = useMutation(
    (data) => userService.fetchDeleteUser(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["users"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const confirmDelete = (id: any) => {
    deleteUserMutation.mutate(id);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      sorter: true,
    },
    {
      title: "FULLNAME",
      dataIndex: "fullname",
      sorter: true,
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "PHONE",
      sorter: true,
      render: (record: any, index: any) => (
        <p key={index} className="font-medium uppercase">
          {record.phone ? record.phone : "Chưa Cập Nhật"}
        </p>
      ),
    },
    {
      title: "ADDRESS",
      sorter: true,
      render: (record: any, index: any) => (
        <p key={index} className="font-medium uppercase">
          {record.address ? record.address : "Chưa Cập Nhật"}
        </p>
      ),
    },
    {
      title: "STATUS",
      sorter: true,
      render: (record: any, index: any) => (
        <p key={index} className="font-medium uppercase">
          {record.verify === "1"
            ? "Đã Xác Thực"
            : record.verify === "2"
            ? "Đã Bị Band"
            : record.verify === "0"
            ? "Chưa Xác Thực"
            : "Giá trị không xác định"}
        </p>
      ),
    },
    {
      title: "ROLE",
      dataIndex: "role",
      sorter: true,
    },
    {
      title: "TIME",
      sorter: true,
      render: (record: any, index: any) => (
        <p key={index} className="font-medium uppercase">
          {formatTime(record.createdAt)}
        </p>
      ),
    },
    {
      title: "ACTION",
      render: (record: any, index: any) => (
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
            title="Delete the user"
            description="Are you sure to delete this user?"
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

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue({
        role: isDataEdit.role,
        verify: isDataEdit.verify,
      });
    } else {
      form.validateFields();
    }
  }, [isEditing, isDataEdit, form]);

  const { data: isUser, isLoading } = useQuery(
    ["users"],
    () => userService.fetchAllUsers(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );
  const filtered = searchText
    ? isUser.filter((huydev: any) =>
        huydev.fullname.toLowerCase().includes(searchText.toLowerCase())
      )
    : isUser;
  const transformedData = transformDataWithKey(filtered); // custom id to key

  const updateUserMutation = useMutation((data) =>
    userService.fetchUpdateUser(isDataEdit._id, data)
  );

  const onFinish = async (data: any) => {
    try {
      const response = await updateUserMutation.mutateAsync(data);
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }

      form.resetFields();
      setModalVisible(false);
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      console.error(error);
    }
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
        <div className="flex gap-2" style={{ marginBottom: 16 }}>
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-1.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              required
            />
          </div>
          <Link
            to={"/user/add"}
            className="bg-blue-500 px-4 p-1.5 text-white rounded-lg"
            type="primary"
          >
            ADD
          </Link>
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
        title={isEditing ? "Edit User" : "Add User"}
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
          <div className="grid gap-4">
            <Form.Item
              label="Role"
              name="role"
              style={{
                marginBottom: 0,
              }}
              rules={[{ required: true, message: "* Role is required" }]}
            >
              <Select size={SIZEFORM} placeholder="Role">
                <Select.Option value="ADMIN">ADMIN</Select.Option>
                <Select.Option value="EMPLOYEE">EMPLOYEE</Select.Option>
                <Select.Option value="MEMBER">MEMBER</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Status"
              name="verify"
              style={{
                marginBottom: 0,
              }}
              rules={[{ required: true, message: "* Status is required" }]}
            >
              <Select size={SIZEFORM} placeholder="Status">
                <Select.Option value={"2"}>Banned</Select.Option>
                <Select.Option value={"1"}>Verfied</Select.Option>
                <Select.Option value={"0"}>Unverified</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </ModalForm>
    </Layout>
  );
};
export default UserPage;
