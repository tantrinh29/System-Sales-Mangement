import React, { useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Table, message } from "antd";
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
import { couponService } from "../../services/coupon.service";

interface DataType {
  key: React.Key;
  _id: any;
  code: any;
  discount: any;
  price: any;
  createdAt: Date;
  formatTime: () => void;
}

type Props = {
  setLoadingBarProgress: any;
};

const CouponPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
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

  const deleteCouponMutation = useMutation(
    (data) => couponService.fetchDeleteCoupon(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["coupons"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const confirmDelete = (id: any) => {
    deleteCouponMutation.mutate(id);
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
      title: "CODE",
      dataIndex: "code",
      sorter: true,
    },
    {
      title: "DISCOUNT",
      sorter: true,
      render: (record: DataType, index: any) => (
        <p key={index} className="font-medium uppercase">
          {record.discount}
        </p>
      ),
    },
    {
      title: "PRICE",
      sorter: true,
      render: (record: DataType, index: any) => (
        <p key={index} className="font-medium uppercase">
          {parseInt(record.price).toLocaleString()} VND
        </p>
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
            title="Delete the coupon"
            description="Are you sure to delete this coupon?"
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
        code: isDataEdit.code,
        discount: isDataEdit.discount,
        price: isDataEdit.price,
      });
    } else {
      form.validateFields();
    }
  }, [isEditing, isDataEdit, form]);

  const { data: isCoupon, isLoading } = useQuery(
    ["coupons"],
    () => couponService.fetchAllCoupons(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const transformedData = transformDataWithKey(isCoupon); // custom id to key

  const updateCouponMutation = useMutation((data) =>
    couponService.fetchUpdateCoupon(isDataEdit._id, data)
  );
  const postCouponMutation = useMutation((data) =>
    couponService.fetchPostCoupon(data)
  );

  const onFinish = async (data: any) => {
    try {
      if (isEditing) {
        const response = await updateCouponMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      } else {
        const response = await postCouponMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      }
      form.resetFields();
      setModalVisible(false);
      queryClient.invalidateQueries(["coupons"]);
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
        title={isEditing ? "Edit Coupon" : "Add Coupon"}
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
                label="Code"
                name="code"
                style={{
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "* Code is required" }]}
              >
                <Input size={SIZEFORM} placeholder="HUYDEV" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Discount"
                name="discount"
                style={{
                  marginBottom: 0,
                }}
                rules={[{ required: true, message: "* Discount is required" }]}
              >
                <Input size={SIZEFORM} placeholder="Nhập Giám Giá Cái Gì" />
              </Form.Item>
            </div>
          </div>
          <div className="mt-2">
            <Form.Item
              label="Price"
              name="price"
              style={{
                marginBottom: 0,
              }}
              rules={[{ required: true, message: "* Price is required" }]}
            >
              <Input size={SIZEFORM} placeholder="1000000" />
            </Form.Item>
          </div>
        </Form>
      </ModalForm>
    </Layout>
  );
};
export default CouponPage;
