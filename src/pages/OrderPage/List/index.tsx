import React, { useState, useEffect } from "react";
import { Button, Empty, Form, Input, Select, Table, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import {
  RANDOM,
  SIZEFORM,
  formatTime,
  transformDataWithKey,
} from "../../../utils/custom.env";
import { orderService } from "../../../services/order.service";
import Layout from "../../../components/Layout";
import ModalForm from "../../../components/Modal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { userService } from "../../../services/user.service";

interface DataType {
  _id: any;
  code: any;
  user: any;
  totalPrice: any;
  assignedToID: any;
  assigned: any;
  payment: any;
  vnpay: any;
  momo: any;
  products: any;
  status: any;
  createdAt: Date;
  formatTime: () => void;
}

type Props = {
  setLoadingBarProgress: any;
};

const ListOrder: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const user = useSelector((state: AppState) => state.auth.user);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  // const [isDetailProduct, setIsDetailProduct] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDataEdit, setDataEdit] = useState<any>();

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  // const handleOpenModal = (data: DataType) => {
  //   setIsDetailProduct(data.products);
  //   setModalVisible(true);
  // };

  const { data: isUser } = useQuery(
    ["users"],
    () => {
      if (user?.role === "ADMIN" && user?.verify == 1) {
        return userService.fetchAllUsers();
      }
      return [];
    },
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const { data: isOrder, isLoading } = useQuery(
    ["orders"],
    () => {
      if (user && user?.role === "ADMIN" && user?.verify == 1) {
        return orderService.fetchAllOrders();
      } else if (user?.role === "EMPLOYEE" && user?.verify == 1) {
        return orderService.fetchOrderByAssignedToID(user?._id);
      } else {
        return null;
      }
    },
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

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

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "CODE",
      dataIndex: "code",
    },
    {
      title: "CUSTOMER",
      render: (record: DataType) => (
        <span className="uppercase font-bold">{record.user.fullname}</span>
      ),
    },
    {
      title: "TOTAL PRICE",
      sorter: (a: any, b: any) => a.totalPrice - b.totalPrice,
      render: (record: DataType) => (
        <span>{parseInt(record.totalPrice).toLocaleString()}</span>
      ),
    },
    {
      title: "PAYMENT METHOD",
      render: (record: DataType) => (
        <span className="uppercase font-bold text-xs">
          {record.payment[0].namePayment}
        </span>
      ),
    },
    {
      title: "STATUS",
      render: (record: DataType) => (
        <div
          className={`${
            record?.status === "Đã Thanh Toán"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {record?.status}
        </div>
      ),
    },
    {
      title: "ASSIGN",
      render: (record: DataType) => (
        <div>
          {user && user?.role === "ADMIN" && user?.verify == 1 ? (
            record?.assignedToID && record?.assigned ? (
              <span className="font-medium">{record?.assigned.fullname}</span>
            ) : (
              <button
                onClick={() => handleEdit(record)}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Assigned To
              </button>
            )
          ) : user && user?.role === "EMPLOYEE" && user?.verify == 1 ? (
            record?.assignedToID && record?.assigned ? (
              <span className="font-medium">{record?.assigned.fullname}</span>
            ) : (
              <button
                onClick={() => onUpdate(record._id)}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Assigned To
              </button>
            )
          ) : null}
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
      key: "action",
      render: (record: DataType) => (
        <>
          <button
            disabled={record.assignedToID === null}
            onClick={() => handleEdit(record)}
            className="font-medium text-blue-600 hover:underline"
          >
            Edit
          </button>{" "}
          {" / "}{" "}
          <Link
            to={`/orders/${record.code}`}
            className="font-medium text-red-600 hover:underline"
          >
            Chi Tiết
          </Link>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue({
        assignedToID: isDataEdit.assignedToID,
      });
    } else {
      form.validateFields();
    }
  }, [isEditing, isDataEdit, form]);

  const transformedData = transformDataWithKey(isOrder); // custom id to key
  const filteredOrders =
    activeTab === 0
      ? transformedData?.filter((order) => order.assignedToID !== null)
      : transformedData?.filter((order) => order.assignedToID === null);

  // const detailOrder = [
  //   {
  //     title: "IMAGE",
  //     render: (record: any) => (
  //       <img
  //         src={record.images[0].imagePath}
  //         alt="Product"
  //         style={{ width: "150px" }}
  //       />
  //     ),
  //   },
  //   {
  //     title: "COLOR",
  //     dataIndex: "color",
  //     filters: [
  //       {
  //         text: "Black",
  //         value: "black",
  //       },
  //       {
  //         text: "Red",
  //         value: "red",
  //       },
  //     ],
  //     onFilter: (value: any, record: any) => record.colors.indexOf(value) === 0,
  //     render: (record: any) => (
  //       <span
  //         className={`inline-block bg-blue-500 text-white text-xs py-1 px-2 rounded-full mr-1`}
  //         style={{
  //           textTransform: "uppercase",
  //           fontWeight: "600",
  //         }}
  //       >
  //         {record}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: "QUANTITY",
  //     dataIndex: "quantity",
  //     sorter: (a: any, b: any) => a.quantity - b.quantity,
  //   },
  //   {
  //     title: "PRICE",
  //     sorter: (a: any, b: any) => a.price - b.price,
  //     render: (record: any) => (
  //       <span>
  //         {(record.huydev.price_has_dropped * record.quantity).toLocaleString(
  //           "vi-VN"
  //         )}{" "}
  //         VND
  //       </span>
  //     ),
  //   },
  // ];

  // const getFirstImageURL = (images: any) => {
  //   return images.length > 0 ? images : null;
  // };

  const updateOrderMutation = useMutation((data: any) => {
    const { orderID, ...updateData } = data;
    return orderService.fetchUpdateOrder(orderID, updateData);
  });

  const updateOrder = async (data: any) => {
    try {
      const response = await updateOrderMutation.mutateAsync(data);
      if (response.status === true) {
        message.success(`${response.message}`);
      } else {
        message.error(`${response.message}`);
      }

      form.resetFields();
      setModalVisible(false);
      queryClient.invalidateQueries(["orders"]);
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdate = async (data: any) => {
    if (!user || user.verify != 1) return;

    const updateData =
      user.role === "ADMIN"
        ? {
            assignedToID: data.assignedToID,
            orderID: isDataEdit._id,
            assignedAt: Date.now(),
          }
        : user.role === "EMPLOYEE"
        ? { assignedToID: user._id, orderID: data, assignedAt: Date.now() }
        : null;

    if (updateData) {
      setModalVisible(false);
      updateOrder(updateData);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <div
          className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
          style={{ marginBottom: 16 }}
        >
          <ul className="flex flex-wrap -mb-px">
            <li onClick={() => handleTabClick(0)}>
              <Link
                to="#"
                className={
                  activeTab === 0
                    ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 mr-2"
                    : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }
              >
                Assigned (
                {
                  transformedData?.filter(
                    (order) => order.assignedToID !== null
                  ).length
                }
                )
              </Link>
            </li>
            <li onClick={() => handleTabClick(1)}>
              <Link
                to="#"
                className={
                  activeTab === 1
                    ? "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 mr-2"
                    : "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }
              >
                Unassigned (
                {
                  transformedData?.filter(
                    (order) => order.assignedToID === null
                  ).length
                }
                )
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-2" style={{ marginBottom: 16 }}>
          <div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-1.5
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              // value={searchText}
              // onChange={(e) => setSearchText(e.target.value)}
              required
            />
          </div>
          <Link
            to={"/order/add"}
            className="bg-blue-500 px-4 p-1.5 text-white rounded-lg"
            type="primary"
          >
            ADD
          </Link>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        loading={isLoading}
        dataSource={filteredOrders}
        size={"small"}
      />
      {/* <ModalDetailOrder
        title="Chi Tiết Sản Phẩm"
        loading={loading}
        open={modalVisible}
        onClose={handleCloseModal}
        onOke={handleOke}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
        ]}
      >
        <Table
          size={"small"}
          columns={detailOrder}
          dataSource={isDetailProduct?.map((order: any) => ({
            ...order,
            key: order._id,
            images: getFirstImageURL(order.huydev.images),
          }))}
          rowKey="id"
        />
      </ModalDetailOrder> */}

      <ModalForm
        title={isEditing ? "Assigned" : "Add Order"}
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
          onFinish={onUpdate}
        >
          <div className="grid gap-4">
            {user && user?.role === "ADMIN" && user?.verify == 1 ? (
              <Form.Item
                label="Nhân Viên"
                name="assignedToID"
                style={{
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "* Assigned is required" }]}
              >
                <Select
                  size={SIZEFORM}
                  placeholder="Nhân Viên Quản Lí Đơn Hàng"
                >
                  <Select.Option value="">
                    Vui Lòng Chọn Nhân Viên
                  </Select.Option>
                  {isUser
                    ?.filter(
                      (item: any) =>
                        item.role === "EMPLOYEE" || item.role === "ADMIN"
                    )
                    .map((item: any) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.fullname} -- ({item.role})
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            ) : user && user?.role === "EMPLOYEE" && user?.verify == 1 ? (
              <Form.Item
                label="Assigned To"
                name="assignedToID"
                style={{
                  marginBottom: 0,
                }}
                initialValue={user?._id}
              >
                <Input disabled />
              </Form.Item>
            ) : (
              <Empty />
            )}
          </div>
        </Form>
      </ModalForm>
    </Layout>
  );
};
export default ListOrder;
