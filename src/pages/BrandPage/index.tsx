import React, { useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Select, Table, message } from "antd";
import Layout from "../../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import ModalForm from "../../components/Modal";
import { brandService } from "../../services/brand.service";
import { categoryService } from "../../services/category.service";
import {
  RANDOM,
  SIZEFORM,
  formatTime,
  transformDataWithKey,
} from "../../utils/custom.env";

interface DataType {
  key: React.Key;
  _id: any;
  slugBrand: any;
  nameBrand: any;
  categoryID: any;
  createdAt: Date;
  formatTime: () => void;
}

type Props = {
  setLoadingBarProgress: any;
};

const BrandPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
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

  const deleteBrandMutation = useMutation(
    (data) => brandService.fetchDeleteBrand(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["brands"]);
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
      dataIndex: "nameBrand",
      sorter: true,
      onFilter: (value: any, record: DataType) =>
        record.nameBrand.indexOf(value) === 0,
    },
    
    {
      title: "CATEGORY",
      sorter: true,
      render: (record: DataType, index: any) => (
        <p key={index} className="font-medium uppercase">
          {record.categoryID.nameCategory}
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
            title="Delete the product"
            description="Are you sure to delete this brand?"
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
        nameBrand: isDataEdit.nameBrand,
        categoryID: isDataEdit.categoryID._id,
      });
    } else {
      form.validateFields();
    }
  }, [isEditing, isDataEdit, form]);

  const { data: isBrand, isLoading } = useQuery(
    ["brands"],
    () => brandService.fetchAllBrands(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const transformedData = transformDataWithKey(isBrand); // custom id to key

  const { data: isCategory } = useQuery(
    ["categories"],
    () => categoryService.fetchAllCategories(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const updateBrandMutation = useMutation((data) =>
    brandService.fetchUpdateBrand(isDataEdit.slugBrand, data)
  );
  const postBrandMutation = useMutation((data) =>
    brandService.fetchPostBrand(data)
  );

  const onFinish = async (data: any) => {
    console.log(data)
    try {
      if (isEditing) {
        const response = await updateBrandMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      } else {
        const response = await postBrandMutation.mutateAsync(data);
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
      }
      form.resetFields();
      setModalVisible(false);
      queryClient.invalidateQueries(["brands"]);
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
        title={isEditing ? "Edit Brand" : "Add Brand"}
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
          <div>
            <Form.Item
              label="Name"
              name="nameBrand"
              style={{
                marginBottom: 0,
              }}
              rules={[{ required: true, message: "* Name is required" }]}
            >
              <Input size={SIZEFORM} placeholder="Macbook ..." />
            </Form.Item>
          </div>
          <div className="mt-2">
            <Form.Item
              label="Category"
              name="categoryID"
              style={{
                marginBottom: 0,
              }}
              rules={[{ required: true, message: "* Category is required" }]}
            >
              <Select size={SIZEFORM} placeholder="Vui Lòng Chọn Danh Mục">
                <Select.Option value="">Vui Lòng Chọn Trạng Thái</Select.Option>
                {isCategory?.map((item: any, index: number) => (
                  <Select.Option key={index} value={item._id}>
                    {item.nameCategory}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </ModalForm>
    </Layout>
  );
};
export default BrandPage;
