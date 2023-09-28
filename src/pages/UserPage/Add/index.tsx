import React, { useState, useEffect } from "react";
import { Form, Input, Select, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RANDOM, SIZEFORM } from "../../../utils/custom.env";
import { brandService } from "../../../services/brand.service";
import { productService } from "../../../services/product.service";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import { AppState } from "../../../store";
import { useSelector } from "react-redux";

type Props = {
  setLoadingBarProgress: any;
};

const AddUser: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const navigate = useNavigate();
  const user = useSelector((state: AppState) => state.auth.accessToken);
  const [form] = Form.useForm();

  const { data: dataBrands } = useQuery(
    ["brands"],
    () => brandService.fetchAllBrands(),
    {
      staleTime: 1000,
      refetchOnMount: false,
    }
  );

  const postProductMutation = useMutation((data) =>
    productService.fetchPostProduct(data)
  );

  const onFinish = async (values: any) => {
    try {
      // Add mode
      const response = await postProductMutation.mutateAsync(values);
      if (response.status === true) {
        message.success(`${response.message}`);
        navigate("/products");
      } else {
        message.error(`${response.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <div className="grid gap-6 mb-4 md:grid-cols-2">
          <Form.Item
            label="Fullname"
            name="fullname"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Fullname is required" }]}
          >
            <Input size={SIZEFORM} placeholder="Tran Nguyen Le ..." />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Username is required" }]}
          >
            <Input size={SIZEFORM} placeholder="huydev" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            style={{
              marginBottom: 0,
            }}
            rules={[
              {
                required: true,
                message: "* Email is required",
              },
            ]}
          >
            <Input size={SIZEFORM} placeholder="qhuy.dev@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            style={{
              marginBottom: 0,
            }}
            rules={[
              {
                required: true,
                message: "* Password is required",
              },
            ]}
          >
            <Input size={SIZEFORM} placeholder="**********" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Phone is required" }]}
          >
            <Input size={SIZEFORM} placeholder="09756287352" />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* City is required" }]}
          >
            <Input size={SIZEFORM} placeholder="city" />
          </Form.Item>

          <Form.Item
            label="District"
            name="district"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* District is required" }]}
          >
            <Input size={SIZEFORM} placeholder="district" />
          </Form.Item>

          <Form.Item
            label="Commune"
            name="commune"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Commune is required" }]}
          >
            <Input size={SIZEFORM} placeholder="commune" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Address is required" }]}
          >
            <Input size={SIZEFORM} placeholder="address" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Role is required" }]}
          >
            <Select size={SIZEFORM} placeholder="Chọn Role">
              <Select.Option value="">Vui Lòng Chọn Role</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="employee">Employee</Select.Option>
              <Select.Option value="member">Member</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="py-5">
          <button
            type="submit"
            className=" text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Save
          </button>
        </div>
      </Form>
    </Layout>
  );
};
export default AddUser;
