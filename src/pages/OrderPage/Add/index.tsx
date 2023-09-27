import React, { useEffect } from "react";
import { Form, Button, Input, Select, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RANDOM, SIZEFORM, dataColors } from "../../../utils/custom.env";
import { orderService } from "../../../services/order.service"; // Đảm bảo bạn đã import orderService hoặc module tương tự từ dự án của bạn
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import { AppState } from "../../../store";
import { useSelector } from "react-redux";
import { MinusCircleOutlined } from "@ant-design/icons";
import { productService } from "../../../services/product.service";
import { paymentService } from "../../../services/payment.service";

type Props = {
  setLoadingBarProgress: any;
};

const AddOrder: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);

  const navigate = useNavigate();
  const user = useSelector((state: AppState) => state.auth.accessToken);
  const [form] = Form.useForm();

  const { data: isProduct } = useQuery(
    ["products"],
    () => productService.fetchAllProducts(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );
  const { data: isPayment } = useQuery(
    ["payments"],
    () => paymentService.fetchAllPayments(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const postOrderMutation = useMutation(
    (data) => orderService.fetchPostOrder(data) // Sử dụng hàm tạo đơn hàng từ orderService hoặc module tương tự
  );

  const onFinish = async (values: any) => {
    try {
      const response = await postOrderMutation.mutateAsync(values);
      if (response.status === true) {
        message.success(`${response.message}`);
        navigate("/orders");
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
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Form.Item
                      {...restField}
                      label={`Product #${name}`}
                      name={[name, "productID"]}
                      fieldKey={`[${fieldKey}, "productID"]`}
                      style={{
                        marginBottom: 0,
                      }}
                      rules={[
                        { required: true, message: "* Product is required" },
                      ]}
                    >
                      <Select size={SIZEFORM} placeholder="Chọn Sản Phẩm">
                        <Select.Option value="">
                          Vui Lòng Chọn Sản Phẩm
                        </Select.Option>
                        {isProduct?.map((item: any) => (
                          <Select.Option key={item._id} value={item._id}>
                            {item.nameProduct}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label={`Color #${name}`}
                      name={[name, "color"]}
                      fieldKey={`[${fieldKey}, "color"]`}
                      style={{
                        marginBottom: 0,
                      }}
                      rules={[
                        { required: true, message: "* Color is required" },
                      ]}
                    >
                      <Select size={SIZEFORM} placeholder="Color">
                        <Select.Option value="">
                          Vui Lòng Chọn Màu
                        </Select.Option>
                        {dataColors?.map((item: any, index: number) => (
                          <Select.Option key={index} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label={`Quantity #${name}`}
                      name={[name, "quantity"]}
                      fieldKey={`[${fieldKey}, "quantity"]`}
                      style={{
                        marginBottom: 0,
                      }}
                      rules={[
                        { required: true, message: "* Quantity is required" },
                      ]}
                    >
                      <Input size={SIZEFORM} placeholder="Quantity" />
                    </Form.Item>

                    <MinusCircleOutlined
                      style={{
                        padding: "10px",
                      }}
                      onClick={() => {
                        remove(name);
                      }}
                    />
                  </div>
                ))}
              </div>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                >
                  Add Product
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="grid gap-6 mb-4 md:grid-cols-2">
          <Form.Item
            label="Customer Name"
            name="nameCustomer"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Customer Name is required" }]}
          >
            <Input size={SIZEFORM} placeholder="Customer Name" />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="paymentID"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Payments is required" }]}
          >
            <Select size={SIZEFORM} placeholder="Phương Thức Thanh Toán">
              <Select.Option value="">
                Vui Lòng Phương Thức Thanh Toán
              </Select.Option>
              {isPayment?.map((item: any, index: number) => (
                <Select.Option key={index} value={item._id}>
                  {item.namePayment}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="statusProduct"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Status is required" }]}
          >
            <Select size={SIZEFORM} placeholder="Chọn Trạng Thái">
              <Select.Option value="Chưa Thanh Toán">
                Chưa Thanh Toán
              </Select.Option>
              <Select.Option value="Đã Thanh Toán">Đã Thanh Toán</Select.Option>
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

export default AddOrder;
