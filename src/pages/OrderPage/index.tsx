import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import {
  RANDOM,
  formatTime,
  transformDataWithKey,
} from "../../utils/custom.env";
import { orderService } from "../../services/order.service";
import Layout from "../../components/Layout";
import ModalDetailOrder from "../../components/Modal";

interface DataType {
  _id: any;
  user: any;
  totalPrice: any;
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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDetailProduct, setIsDetailProduct] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleOpenModal = (data: DataType) => {
    setIsDetailProduct(data.products);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsDetailProduct([]);
  };

  const handleOke = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
    }, 1000);
  };

  const start = () => {
    setLoading(true);

    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
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
  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "CODE",
      dataIndex: "code",
    },
    {
      title: "USER",
      render: (record: DataType) => (
        <span className="uppercase font-bold">{record.user.fullname}</span>
      ),
    },
    {
      title: "TOTAL PRICE",
      sorter: (a: any, b: any) => a.totalPrice - b.totalPrice,
      render: (record: DataType) => (
        <span>{parseInt(record.totalPrice).toLocaleString()} VND</span>
      ),
    },
    {
      title: "PAYMENT METHOD",
      render: (record: DataType) => (
        <span className="uppercase font-bold">
          {record.payment[0].namePayment}
        </span>
      ),
    },
    {
      title: "STATUS",
      filters: [
        {
          text: "Chưa Thanh Toán",
          value: "Chưa Thanh Toán",
        },
        {
          text: "Đã Thanh Toán",
          value: "Đã Thanh Toán",
        },
      ],
      onFilter: (value: any, record: DataType) => record.status === value,
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
          onClick={() => handleOpenModal(record)}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Update
        </button>
        {" "} {" / "} {" "}
        <button
          onClick={() => handleOpenModal(record)}
          className="font-medium text-red-600 dark:text-blue-500 hover:underline"
        >
          Chi Tiết
        </button>
        </>
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

  const { data: isOrder, isLoading } = useQuery(
    ["orders"],
    () => orderService.fetchAllOrders(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const transformedData = transformDataWithKey(isOrder); // custom id to key

  const detailOrder = [
    {
      title: "IMAGE",
      render: (record: any) => (
        <img
          src={record.images[0].imagePath}
          alt="Product"
          style={{ width: "150px" }}
        />
      ),
    },
    {
      title: "COLOR",
      dataIndex: "color",
      filters: [
        {
          text: "Black",
          value: "black",
        },
        {
          text: "Red",
          value: "red",
        },
      ],
      onFilter: (value: any, record: any) => record.colors.indexOf(value) === 0,
      render: (record: any) => (
        <span
          className={`inline-block bg-blue-500 text-white text-xs py-1 px-2 rounded-full mr-1`}
          style={{
            textTransform: "uppercase",
            fontWeight: "600",
          }}
        >
          {record}
        </span>
      ),
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: "PRICE",
      sorter: (a: any, b: any) => a.price - b.price,
      render: (record: any) => (
        <span>
          {(record.huydev.price_has_dropped * record.quantity).toLocaleString(
            "vi-VN"
          )}{" "}
          VND
        </span>
      ),
    },
  ];

  const getFirstImageURL = (images: any) => {
    return images.length > 0 ? images : null;
  };
  return (
    <Layout>
      <div className="flex justify-between">
        <div style={{ marginBottom: 16 }}>
          <Button
            className="bg-blue-500"
            type="primary"
            onClick={start}
            disabled={!hasSelected}
            loading={loading}
          >
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        loading={isLoading}
        dataSource={transformedData}
        size={"small"}
      />
      <ModalDetailOrder
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
      </ModalDetailOrder>
    </Layout>
  );
};
export default ListOrder;
