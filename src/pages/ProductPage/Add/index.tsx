import React, { useState, useEffect } from "react";
import CKEditor from "../../../components/CKEditor";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CUSTOM_ENV,
  RANDOM,
  SIZEFORM,
  dataColors,
  getBase64,
} from "../../../utils/custom.env";
import { brandService } from "../../../services/brand.service";
import { productService } from "../../../services/product.service";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import ListImage from "../../../components/ListImage";
import { AppState } from "../../../store";
import { useSelector } from "react-redux";

type Props = {
  setLoadingBarProgress: any;
};

const AddProduct: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const navigate = useNavigate();
  const user = useSelector((state: AppState) => state.auth.accessToken);
  const [isImageRequired, setIsImageRequired] = useState<any>();
  const [editorContent, setEditorContent] = useState<any>("");
  const [editorDescription, setEditorDescription] = useState<any>("");
  const [editorSpecifications, setEditorSpecifications] = useState<any>("");
  const [editorPresent, setEditorPresent] = useState<any>("");
  const [fileList, setFileList] = useState<any>([]);
  const [form] = Form.useForm();
  const options =
    dataColors?.map((color: any) => ({
      value: color.name,
      label: color.name,
    })) || [];

  const { data: dataBrands } = useQuery(
    ["brands"],
    () => brandService.fetchAllBrands(),
    {
      staleTime: 1000,
      refetchOnMount: false,
    }
  );

  const handleEditorContentChange = (event: any) => {
    const data = event.editor.getData();
    setEditorContent(data);
  };
  const handleEditorPresentChange = (event: any) => {
    const data = event.editor.getData();
    setEditorPresent(data);
  };
  const handleEditorDescriptionChange = (event: any) => {
    const data = event.editor.getData();
    setEditorDescription(data);
  };
  const handleEditorSpecifications = (event: any) => {
    const data = event.editor.getData();
    setEditorSpecifications(data);
  };

  const handleImageChange = async (info: any) => {
    let fileList = [...info.fileList];

    fileList = await Promise.all(
      fileList.map(async (file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file;
      })
    );
    setFileList(fileList);
    setIsImageRequired(!(fileList.length > 0));
  };

  const handleRemove = (file: any) => {
    const newFileList = fileList.filter((item: any) => item.uid !== file.uid);
    setFileList(newFileList);

    if (newFileList.length === 0) {
      setIsImageRequired(true);
    }
  };
  const validateFileList = () => {
    if (!fileList || fileList.length === 0) {
      return setIsImageRequired(true);
    }
    return Promise.resolve();
  };

  const postProductMutation = useMutation((data) =>
    productService.fetchPostProduct(data)
  );

  const onFinish = async (values: any) => {
    values.descriptionProduct = editorDescription;
    values.contentProduct = editorContent;
    values.presentProduct = editorPresent;
    values.specificationsProduct = editorSpecifications;
    values.imagesProduct = fileList;

    try {
      const formData = new FormData();
      const imageFiles = values.imagesProduct;

      imageFiles.forEach((file: any) => {
        formData.append(`files`, file.originFileObj);
      });

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
      const imageUrls = uploadResponse.data.fileUrls.map((file: any) => file);
      values.imagesProduct = imageUrls;

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
            label="Name"
            name="nameProduct"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Name is required" }]}
          >
            <Input size={SIZEFORM} placeholder="Asus GB5 ..." />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantityProduct"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Quantity is required" }]}
          >
            <Input size={SIZEFORM} placeholder="10 " />
          </Form.Item>

          <Form.Item
            label="Price Has Dropped"
            name="price_has_dropped"
            style={{
              marginBottom: 0,
            }}
            rules={[
              {
                required: true,
                message: "* Price Has Dropped is required",
              },
            ]}
          >
            <Input size={SIZEFORM} placeholder="10000" />
          </Form.Item>

          <Form.Item
            label="Initial Price"
            name="initial_price"
            style={{
              marginBottom: 0,
            }}
            rules={[
              {
                required: true,
                message: "* Initial Price is required",
              },
            ]}
          >
            <Input size={SIZEFORM} placeholder="10000" />
          </Form.Item>

          <Form.Item
            label="Brands"
            name="brandID"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Brands is required" }]}
          >
            <Select size={SIZEFORM} placeholder="Macbook">
              <Select.Option value="">Vui Lòng Chọn Thương Hiệu</Select.Option>
              {dataBrands?.map((item: any, index: number) => (
                <Select.Option key={index} value={item._id}>
                  {item.nameBrand}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Colors"
            name="colorsProduct"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Colors is required" }]}
          >
            <Select
              mode="tags"
              size={SIZEFORM}
              placeholder="Tags Color"
              options={options}
            />
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
              <Select.Option value="">Vui Lòng Chọn Trạng Thái</Select.Option>
              <Select.Option value="stocking">Còn Hàng</Select.Option>
              <Select.Option value="out-of-stock">Hết Hàng</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="mb-4">
          <Form.Item
            label={`Images`}
            name="imagesProduct"
            style={{
              marginBottom: 0,
            }}
            rules={[
              {
                validator: validateFileList,
              },
            ]}
          >
            <Upload onChange={handleImageChange} accept=".jpg,.png" multiple>
              {fileList.length >= 8 ? null : (
                <Button size={SIZEFORM}>Upload</Button>
              )}
            </Upload>
            <ListImage onRemove={handleRemove} data={fileList} />
            {isImageRequired && (
              <div className="text-red-500">* Images is required</div>
            )}
          </Form.Item>
        </div>

        <div className="mb-4">
          <Form.Item
            label="Content"
            name="contentProduct"
            rules={[
              () => ({
                validator(_) {
                  if (!editorContent) {
                    return Promise.reject(new Error("* Content is required"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CKEditor
              initialData={editorContent}
              value={editorContent}
              onChange={handleEditorContentChange}
            />
          </Form.Item>
        </div>

        <div className="mb-4">
          <Form.Item
            label="Present"
            name="presentProduct"
            rules={[
              () => ({
                validator(_) {
                  if (!editorPresent) {
                    return Promise.reject(new Error("* Present is required"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CKEditor
              initialData={editorPresent}
              value={editorPresent}
              onChange={handleEditorPresentChange}
            />
          </Form.Item>
        </div>

        <div className="mb-4">
          <Form.Item
            label="Specifications"
            name="specificationsProduct"
            rules={[
              () => ({
                validator(_) {
                  if (!editorSpecifications) {
                    return Promise.reject(
                      new Error("* Specifications is required")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CKEditor
              initialData={editorSpecifications}
              value={editorSpecifications}
              onChange={handleEditorSpecifications}
            />
          </Form.Item>
        </div>

        <div className="mb-4">
          <Form.Item
            label="Description"
            name="descriptionProduct"
            rules={[
              () => ({
                validator(_) {
                  if (!editorDescription) {
                    return Promise.reject(
                      new Error("* Description is required")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <CKEditor
              initialData={editorDescription}
              value={editorDescription}
              onChange={handleEditorDescriptionChange}
            />
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
export default AddProduct;
