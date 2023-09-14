import { format } from "date-fns";

export const CUSTOM_ENV = {
  API_URL: "https://server-manager.onrender.com",
};
export const SIZEFORM = "large";
export const SECRET_KEY = "LeQuocHuy";
export const size = "large";
export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};


export const RANDOM = {
  generateRandomNumber: () => {
    return Math.floor(Math.random() * 91) + 10;
  },
  timeout: 1500,
};

export const formatTime = (time: any) => {
  const dateTime = new Date(time); // 2023-08-06T08:30:57.000Z
  return format(dateTime, "dd/MM/yyyy - hh:mm:ss a");
};

export const minute = (time: any) => {
  const dateTime = new Date(time);
  return format(dateTime, "hh:mm:ss");
};

export const transformDataWithKey = (data: any[]) => {
  return data?.map((item: any) => ({
    ...item,
    key: item._id,
  }));
};

export const dataColors = [
  {
    id: 1,
    name: "black",
  },
  {
    id: 2,
    name: "red",
  },
  {
    id: 3,
    name: "yellow",
  },
  {
    id: 4,
    name: "white",
  },
];
