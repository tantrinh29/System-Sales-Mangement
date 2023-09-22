import React, { useState, useEffect } from "react";
import {
  CUSTOM_ENV,
  RANDOM,
  SIZEFORM,
  dataColors,
  getBase64,
} from "../../../utils/custom.env";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, Upload, Button, Input, Form, message, Spin } from "antd";
import { productService } from "../../../services/product.service";
import { brandService } from "../../../services/brand.service";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import CKEditor from "../../../components/CKEditor";
import ListImage from "../../../components/ListImage";
import { AppState } from "../../../store";
import { useSelector } from "react-redux";
import { isURL } from "../../../constants/regex.constants";

type Props = {
  setLoadingBarProgress: any;
};

const EditProduct: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const user = useSelector((state: AppState) => state.auth.accessToken);
  const [isImageRequired, setIsImageRequired] = useState<any>();
  const [editorContent, setEditorContent] = useState<any>("");
  const [editorDescription, setEditorDescription] = useState<any>("");
  const [editorPresent, setEditorPresent] = useState<any>("");
  const [editorSpecifications, setEditorSpecifications] = useState<any>("");
  const [fileList, setFileList] = useState<any>([]);
  const [isSlug, setSlug] = useState<any>(null);
  const [isImageUpdateAllowed, setIsImageUpdateAllowed] = useState<any>();
  const [isEditing] = useState<boolean>(true);

  useEffect(() => {
    if (slug) {
      setSlug(slug);
    }
  }, [slug]);

  const { data: dataProduct, isLoading: loadingProduct } = useQuery({
    queryKey: ["edit-product", isSlug],
    queryFn: () => productService.fetchProductBySlug(isSlug),
    staleTime: 500,
    enabled: !!isSlug,
  });

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
    setIsImageUpdateAllowed(true);
    setFileList(fileList);
    setIsImageRequired(!(fileList.length > 0));
  };

  const nameColors = dataProduct?.colors;
  const options = dataColors.map((color: any) => ({
    value: color.name,
    label: color.name,
    checked: nameColors
      ?.map((huydev: any) => huydev.nameColor.toLowerCase())
      .includes(color.name),
  }));

  const selectedOptions = options
    .filter((option: any) => option.checked)
    .map((option) => option.value);

  useEffect(() => {
    if (dataProduct?.images) {
      const huydev = dataProduct.images;
      const fileListData = huydev.map((image: any) => {
        return {
          url: image.imagePath,
        };
      });
      setIsImageRequired(fileListData.length === 0);
      setFileList(fileListData);
    }
    setIsImageUpdateAllowed(false);
  }, [dataProduct]);

  useEffect(() => {
    if (dataProduct) {
      setEditorDescription(dataProduct.descriptionProduct);
      setEditorContent(dataProduct.contentProduct);
      setEditorPresent(dataProduct.presentProduct);
      setEditorSpecifications(dataProduct.specificationsProduct);
    }
  }, [dataProduct, isEditing]);

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue({
        nameProduct: dataProduct?.nameProduct,
        quantityProduct: dataProduct?.quantityProduct,
        price_has_dropped: dataProduct?.price_has_dropped,
        initial_price: dataProduct?.initial_price,
        colorsProduct: selectedOptions,
        statusProduct: dataProduct?.statusProduct,
        brandID: dataProduct?.brandID,
        contentProduct: editorContent,
        presentProduct: editorPresent,
        specificationsProduct: editorSpecifications,
        descriptionProduct: editorDescription,
        imagesProduct: fileList,
      });
    } else {
      form.validateFields();
    }
  }, [isEditing, dataProduct, form]);

  const updateProductMutation = useMutation((data) =>
    productService.fetchUpdateProduct(slug, isImageUpdateAllowed, data)
  );
  const onFinish = async (values: any) => {
    values.descriptionProduct = editorDescription;
    values.contentProduct = editorContent;
    values.presentProduct = editorPresent;
    values.specificationsProduct = editorSpecifications;
    values.imagesProduct = fileList;

    if (isImageUpdateAllowed) {
      try {
        const formData = new FormData();
        const imageFiles = values.imagesProduct;

        const uploadedFiles: any[] = [];

        imageFiles.forEach((file: any) => {
          if (file && typeof file === "object") {
            uploadedFiles.push(file.originFileObj);
          }
        });
        uploadedFiles.forEach((file) => {
          if (file !== undefined) {
            formData.append("files", file);
          }
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

        const uploadedImageUrls = uploadResponse.data.fileUrls.map(
          (file: any) => file
        );

        // Lấy các URL của ảnh cũ
        const oldImageUrls = values.imagesProduct
          .filter((item: any) => typeof item === "object" && item.url)
          .map((item: any) => item.url);
        // console.log("check đc những file url", oldImageUrls);

        // Kết hợp các URL của ảnh cũ và các URL mới
        const combinedImageUrls = [...oldImageUrls, ...uploadedImageUrls];
        console.log(combinedImageUrls);

        // Gán danh sách URL mới cho `values.imagesProduct`
        values.imagesProduct = combinedImageUrls;

        // Add mode
        const response = await updateProductMutation.mutateAsync(values);
        if (response.status === true) {
          message.success(`${response.message}`);
          navigate("/products");
        } else {
          message.error(`${response.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await updateProductMutation.mutateAsync(values);
        if (response.status === true) {
          message.success(`${response.message}`);
          navigate("/products");
        } else {
          message.error(`${response.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    }

    queryClient.invalidateQueries(["edit-product", isSlug]);
  };

  const handleRemove = (file: any) => {
    let newFileList;

    const isURLResult = isURL(file);

    if (isURLResult) {
      newFileList = fileList.filter((item: any) => item !== file);
    } else {
      // Nếu file không phải là URL, giữ lại nó trong newFileList
      newFileList = fileList.filter((item: any) => item.uid !== file.uid);
    }
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

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          List Products
        </Link>
      </div>
      <div className="pt-6">
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          {loadingProduct ? (
            <div className="flex justify-center pt-2">
              <Spin />
            </div>
          ) : (
            <>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
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
                  rules={[
                    { required: true, message: "* Quantity is required" },
                  ]}
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
                    <Select.Option value="">
                      Vui Lòng Chọn Thương Hiệu
                    </Select.Option>
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
                    <Select.Option value="">
                      Vui Lòng Chọn Trạng Thái
                    </Select.Option>
                    <Select.Option value="stocking">Còn Hàng</Select.Option>
                    <Select.Option value="out-of-stock">Hết Hàng</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="mb-6">
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
                  <Upload
                    className="mb-2"
                    fileList={fileList}
                    onChange={handleImageChange}
                    onRemove={handleRemove}
                    accept=".jpg,.png"
                    multiple
                  >
                    {fileList.length >= 8 ? null : (
                      <Button className="pb-2" size={SIZEFORM}>
                        Upload
                      </Button>
                    )}
                  </Upload>

                  <ListImage onRemove={handleRemove} data={fileList} />
                  {/* <img src={item.url || item.preview} alt="" /> */}
                  {isImageRequired && (
                    <div className="text-red-500">* Images is required</div>
                  )}
                </Form.Item>
              </div>

              <div className="mb-6">
                <Form.Item
                  label="Content"
                  name="contentProduct"
                  rules={[
                    () => ({
                      validator(_) {
                        if (!editorContent) {
                          return Promise.reject(
                            new Error("* Content is required")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <CKEditor
                    initialData={dataProduct?.contentProduct}
                    value={editorContent}
                    onChange={handleEditorContentChange}
                  />
                </Form.Item>
              </div>

              <div className="mb-6">
                <Form.Item
                  label="Present"
                  name="presentProduct"
                  rules={[
                    () => ({
                      validator(_) {
                        if (!editorPresent) {
                          return Promise.reject(
                            new Error("* Present is required")
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <CKEditor
                    initialData={dataProduct?.presentProduct}
                    value={editorPresent}
                    onChange={handleEditorPresentChange}
                  />
                </Form.Item>
              </div>

              <div className="mb-6">
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
                    initialData={dataProduct?.specificationsProduct}
                    value={editorSpecifications}
                    onChange={handleEditorSpecifications}
                  />
                </Form.Item>
              </div>

              <div className="mb-6">
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
                    initialData={dataProduct?.descriptionProduct}
                    value={editorDescription}
                    onChange={handleEditorDescriptionChange}
                  />
                </Form.Item>
              </div>

              <div className="my-16">
                <button
                  type="submit"
                  className=" text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </Layout>
  );
};
export default EditProduct;
