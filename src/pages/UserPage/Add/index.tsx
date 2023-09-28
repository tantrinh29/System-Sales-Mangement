import React, { useState, useEffect } from "react";
import { Form, Input, Select, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { RANDOM, SIZEFORM } from "../../../utils/custom.env";
import address from "../../../json/address.json";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
// import { AppState } from "../../../store";
// import { useSelector } from "react-redux";
import { userService } from "../../../services/user.service";

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
  //   const user = useSelector((state: AppState) => state.auth.user);
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [wards, setWards] = useState([]);

  useEffect(() => {
    setProvinces(address.provinces as any);
    setDistricts(address.districts as any);
    setWards(address.wards as any);
  }, []);

  const handleSelectProvince = (provinceId: any) => {
    setSelectedProvince(provinceId);
  };

  const handleSelectDistrict = (districtId: any) => {
    setSelectedDistrict(districtId);
  };

  const filteredDistricts = districts?.filter(
    (district: any) => district.province_id === Number(selectedProvince)
  );

  const filteredWards = wards?.filter(
    (ward: any) => ward.district_id === Number(selectedDistrict)
  );

  const postUserMutation = useMutation((data) =>
    userService.fetchPostUser(data)
  );

  const onFinish = async (values: any) => {
    console.log(values);
    try {
      const response = await postUserMutation.mutateAsync(values);
      if (response.status === true) {
        message.success(`${response.message}`);
        navigate("/users");
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
            label="Confirm Password"
            name="confirm_password"
            style={{
              marginBottom: 0,
            }}
            rules={[
              {
                required: true,
                message: "* Confirm Password is required",
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
            name="city"
            label="Tỉnh/Thành phố"
            rules={[
              {
                required: true,
                message: "City is required",
              },
            ]}
          >
            <Select
              size="large"
              value={selectedProvince}
              onChange={handleSelectProvince}
              placeholder="Select Province"
            >
              {provinces.map((province: any) => (
                <Select.Option key={province.id} value={province.id}>
                  {province.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[
              {
                required: true,
                message: "District is required",
              },
            ]}
          >
            <Select
              size="large"
              value={selectedDistrict}
              onChange={handleSelectDistrict}
              placeholder="Select District"
              disabled={!selectedProvince}
            >
              {filteredDistricts.map((district: any) => (
                <Select.Option key={district.id} value={district.id}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="commune"
            label="Phường/Xã"
            rules={[
              {
                required: true,
                message: "Commune is required",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select Ward"
              disabled={!selectedDistrict}
            >
              {filteredWards.map((ward: any) => (
                <Select.Option key={ward.id} value={ward.id}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Address is required" }]}
          >
            <Input size={SIZEFORM} placeholder="Địa Chỉ Cụ Thể" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            style={{
              marginBottom: 0,
            }}
            rules={[{ required: true, message: "* Role is required" }]}
          >
            <Select size={SIZEFORM} placeholder="Chọn Phân Quyền">
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
