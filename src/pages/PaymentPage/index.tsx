import React, { useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Select, Table, message } from "antd";
import Layout from "../../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import ModalForm from "../../components/Modal";
import {
  RANDOM,
  SIZEFORM,
  formatTime,
  transformDataWithKey,
} from "../../utils/custom.env";
import { paymentService } from "../../services/payment.service";

interface DataType {
  key: React.Key;
  _id: any;
  namePayment: any;
  descriptionPayment: any;
  shouldusePayment: any;
  createdAt: Date;
  formatTime: () => void;
}

type Props = {
  setLoadingBarProgress: any;
};

const PaymentPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
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
  const [searchText, setSearchText] = useState<any>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleAdd = () => {
    setModalVisible(true);
    setIsEditing(false);
  };

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

  const deletePaymentMutation = useMutation(
    (data) => paymentService.fetchDeletePayment(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["payments"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const confirmDelete = (id: any) => {
    deletePaymentMutation.mutate(id);
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
      dataIndex: "_id",
    },
    {
      title: "NAME",
      dataIndex: "namePayment",
      sorter: true,
    },
    {
      title: "DESCRIPTION",
      sorter: true,
      render: (record: DataType, index: any) => (
        <p key={index} className="font-medium uppercase">
          {record.descriptionPayment}
        </p>
      ),
    },
    {
      title: "SHOULDUSE",
      sorter: true,
      render: (record: DataType) => (
        <div
          className={`${
            record.shouldusePayment === "true"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {record.shouldusePayment === "true" ? "Nên Dùng" : "Không Nên Dùng"}
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
            title="Delete the payment"
            description="Are you sure to delete this payment?"
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
        namePayment: isDataEdit.namePayment,
        descriptionPayment: isDataEdit.descriptionPayment,
        shouldusePayment: isDataEdit.shouldusePayment,
      });
    } else {
      form.validateFields();
    }
  }, [isEditing, isDataEdit, form]);

  const { data: isPayment, isLoading } = useQuery(
    ["payments"],
    () => paymentService.fetchAllPayments(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );
  const filtered = searchText
    ? isPayment.filter((huydev: any) =>
        huydev.namePayment.toLowerCase().includes(searchText.toLowerCase())
      )
    : isPayment;
  const transformedData = transformDataWithKey(filtered); // custom id to key

  const updatePaymentMutation = useMutation((data) =>
    paymentService.fetchUpdatePayment(isDataEdit._id, data)
  );
  const postPaymentMutation = useMutation((data) =>
    paymentService.fetchPostPayment(data)
  );

  const onFinish = async (data: any) => {
    try {
      if (isEditing) {
        const response = await updatePaymentMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      } else {
        const response = await postPaymentMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      }
      form.resetFields();
      setModalVisible(false);
      queryClient.invalidateQueries(["payments"]);
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
        title={isEditing ? "Edit Payment" : "Add Payment"}
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
                name="namePayment"
                style={{
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "* Name is required" }]}
              >
                <Input
                  size={SIZEFORM}
                  placeholder="Thanh Toán QR Qua ZaloPay"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Description"
                name="descriptionPayment"
                style={{
                  marginBottom: 0,
                }}
                rules={[
                  { required: true, message: "* Description is required" },
                ]}
              >
                <Input size={SIZEFORM} placeholder="Nhập Mô Tả" />
              </Form.Item>
            </div>
          </div>
          <div className="mt-2">
            <Form.Item
              label="Shoulduse"
              name="shouldusePayment"
              style={{
                marginBottom: 0,
              }}
              rules={[{ required: true, message: "* Shoulduse is required" }]}
            >
              <Select
                size={SIZEFORM}
                placeholder="Phương Thức Có Nên Dùng Hay Không"
              >
                <Select.Option value="">
                  Vui Lòng Chọn Phương Thức Có Nên Dùng Hay Không
                </Select.Option>
                <Select.Option value={"true"}>Nên Dùng</Select.Option>
                <Select.Option value={"false"}>Không Nên Dùng</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </ModalForm>
    </Layout>
  );
};
export default PaymentPage;
