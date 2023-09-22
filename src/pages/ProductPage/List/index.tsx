import React, { useState, useEffect } from "react";
import { Button, Carousel, Popconfirm, Table, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import { productService } from "../../../services/product.service";
import ColorCell from "../../../components/ColorCell";
import { Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import ModalImage from "../../../components/Modal";
import { RANDOM, transformDataWithKey } from "../../../utils/custom.env";

interface DataType {
  _id: string;
  slugProduct: string;
  nameProduct: string;
  quantityProduct: string;
  brandID: any;
  initial_price: any;
  price_has_dropped: any;
  contentProduct: any;
  presentProduct: any;
  specificationsProduct: any;
  descriptionProduct: any;
  statusProduct: any;
  createAt: Date;
}

type Props = {
  setLoadingBarProgress: any;
};

const ListProduct: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleOpenModal = (data: any) => {
    setSelectedImages(data.images);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOke = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
    }, 1000);
  };

  const deleteProductMutation = useMutation(
    (data) => productService.fetchDeleteProduct(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["products"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const confirmDelete = (id: any) => {
    deleteProductMutation.mutate(id);
  };

  const start = () => {
    setLoading(true);

    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
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
      title: "NAME",
      dataIndex: "nameProduct",
      key: "nameProduct",
      sorter: true,
      onFilter: (value: any, record: DataType) =>
        record.nameProduct.indexOf(value) === 0,
    },
    {
      title: "QUANTITY",
      dataIndex: "quantityProduct",
      key: "quantityProduct",
      sorter: true,
      onFilter: (value: any, record: DataType) =>
        record.quantityProduct.indexOf(value) === 0,
    },
    {
      title: "IMAGE",
      key: "images",
      render: (record: any, index: any) => {
        if (record) {
          return (
            <img
              src={
                record.images ? record.images[0].imagePath : null
              }
              alt={`Product ${index}`}
              style={{ width: "100px", cursor: "pointer" }}
              onClick={() => handleOpenModal(record)}
            />
          );
        } else {
          return <p className="font-medium">Chưa Cập Nhật</p>;
        }
      },
    },
    {
      title: "COLOR",
      key: "colors",
      render: (record: any) => (
        <ColorCell
          values={record.colors ? record.colors : null}
        />
      ),
    },
    {
      title: "BRAND",
      key: "brand",
      render: (record: any) => (
        <p className="font-medium uppercase">{record.brand[0].nameBrand}</p>
      ),
    },
    {
      title: "PRICE INITIAL",
      sorter: (a, b) => a.initial_price - b.initial_price,
      render: (record: DataType) => (
        <span
          className="font-medium"
          style={{ textDecoration: "line-through" }}
        >
          {parseInt(record.initial_price).toLocaleString()} VND
        </span>
      ),
    },
    {
      title: "PRICE DROPPED",
      sorter: (a, b) => a.price_has_dropped - b.price_has_dropped,
      render: (record:DataType) => (
        <span className="font-medium">
          {parseInt(record.price_has_dropped).toLocaleString()} VND
        </span>
      ),
    },

    {
      title: "STATUS",
      filters: [
        {
          text: "Hết Hàng",
          value: "out-of-stock",
        },
        {
          text: "Còn Hàng",
          value: "stocking",
        },
      ],
      onFilter: (value: any, record: DataType) => record.statusProduct === value,
      render: (record: DataType) => (
        <div
          className={`${
            record.statusProduct === "stocking"
              ? "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-green-500 text-white"
              : "px-2 py-1 inline-flex items-center rounded text-xs font-bold justify-center bg-red-500 text-white"
          }`}
        >
          {record.statusProduct === "stocking" ? "Còn Hàng" : "Hết Hàng"}
        </div>
      ),
    },

    {
      title: "ACTION",
      key: "action",
      render: (record: DataType) => (
        <div>
          <Link
            to={`/product/edit/${record.slugProduct}`}
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Edit
          </Link>{" "}
          /{" "}
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
            placement="topLeft"
            onConfirm={() => confirmDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button className="font-medium text-red-600 dark:text-blue-500 hover:underline">
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

  const { data: isProduct, isLoading } = useQuery(
    ["products"],
    () => productService.fetchAllProducts(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const transformedData = transformDataWithKey(isProduct); // custom id to key
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
        <div style={{ marginBottom: 16 }}>
          <Link
            to={"/product/add"}
            className="bg-blue-500 px-4 py-2 text-white rounded-lg"
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
        dataSource={transformedData}
        size={"small"}
      />
      <ModalImage
        title="Images"
        loading={loading}
        open={modalVisible}
        onClose={handleCloseModal}
        onOke={handleOke}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
        ]}
      >
        <Carousel autoplay className="custom-carousel">
          {selectedImages.map((image: any, index: number) => (
            <div key={index}>
              <img
                src={image.imagePath}
                alt={`Product ${index}`}
                style={{ maxWidth: "100%" }}
              />
            </div>
          ))}
        </Carousel>
      </ModalImage>
    </Layout>
  );
};
export default ListProduct;
