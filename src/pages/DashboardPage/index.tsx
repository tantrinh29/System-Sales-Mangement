import { useQueries, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { userService } from "../../services/user.service";
import { orderService } from "../../services/order.service";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import { RANDOM } from "../../utils/custom.env";
import PdfExport from "../../components/PdfExport";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
} from "chart.js";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { commentService } from "../../services/comment.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement
);

type Props = {
  setLoadingBarProgress: any;
};

const Home: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const user = useSelector((state: AppState) => state.auth.user);
  const results = useQueries({
    queries: [
      { queryKey: ["products", 1], queryFn: productService.fetchAllProducts },
      {
        queryKey: ["categories", 2],
        queryFn: categoryService.fetchAllCategories,
      },
      {
        queryKey: ["users", 3],
        queryFn:
          user?.role === "ADMIN" && user?.verify == 1
            ? userService.fetchAllUsers
            : commentService.fetchAllComments,
      },
    ],
  });

  const isLoading = results.some((result: any) => result.isLoading);

  const { data: orderData } = useQuery(
    ["orders"],
    () => {
      if (user?.role === "ADMIN" && user?.verify == 1) {
        return orderService.fetchAllOrders();
      } else {
        return orderService.fetchOrderByAssignedToID(user?._id);
      }
    },
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const groupOrdersByDay = (orders: any) => {
    if (!orders) {
      return {};
    }

    const groupedData = orders.reduce((result: any, order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString(); // Convert createdAt to a date string
      if (!result[date]) {
        result[date] = { totalSales: 0, orderCount: 0 };
      }
      result[date].totalSales += parseFloat(order.totalPrice);
      result[date].orderCount++;
      return result;
    }, {});
    return groupedData;
  };

  const groupedData = groupOrdersByDay(orderData || []);

  //  dữ liệu tổng doanh số và dữ liệu số lượng đơn hàng
  const labels = Object.keys(groupedData);
  //   console.log(groupedData)
  const totalSalesData = labels.map((date) => groupedData[date].totalSales);
  const orderCountData = labels.map((date) => groupedData[date].orderCount);

  const orderOption = {
    labels: labels,
    datasets: [
      {
        label: "Total Sales",
        data: totalSalesData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Order Count",
        data: orderCountData,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7 pb-5">
        <div className="bg-lightblue-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">Products</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : results[0].data?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">+11.01%</p>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-lightpurple-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">Orders</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : orderData?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">+9.15%</p>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-lightblue-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">Categories</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : results[1].data?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">-0.56%</p>
              <svg
                width={16}
                height={16}
                className="rotate-180"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-lightpurple-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">
            {user?.role === "ADMIN" && user?.verify == 1
              ? "Active Users"
              : "Comments"}
          </p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : results[2].data?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">-1.48%</p>
              <svg
                width={16}
                height={16}
                className="rotate-180"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7 pb-5">
        <div className="bg-lightblue-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">Total Revenue</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : results[0].data?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">+11.01%</p>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-lightpurple-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">
            Account Disabled
          </p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : results[3].data?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">+9.15%</p>
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-lightblue-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">Categories</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : results[1].data?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">-0.56%</p>
              <svg
                width={16}
                height={16}
                className="rotate-180"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-lightpurple-100 rounded-2xl p-6 border">
          <p className="text-sm font-semibold text-black mb-2">Active Users</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl leading-9 font-semibold text-black">
              {isLoading ? <Loading /> : results[2].data?.length}
            </h2>
            <div className="flex items-center gap-1">
              <p className="text-xs leading-[18px] text-black">-1.48%</p>
              <svg
                width={16}
                height={16}
                className="rotate-180"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.45488 5.60777L14 4L12.6198 9.6061L10.898 7.9532L8.12069 10.8463C8.02641 10.9445 7.89615 11 7.76 11C7.62385 11 7.49359 10.9445 7.39931 10.8463L5.36 8.72199L2.36069 11.8463C2.16946 12.0455 1.85294 12.0519 1.65373 11.8607C1.45453 11.6695 1.44807 11.3529 1.63931 11.1537L4.99931 7.65373C5.09359 7.55552 5.22385 7.5 5.36 7.5C5.49615 7.5 5.62641 7.55552 5.72069 7.65373L7.76 9.77801L10.1766 7.26067L8.45488 5.60777Z"
                  fill="#1C1C1C"
                />
              </svg>
            </div>
          </div>
        </div>
      </div> */}
      {user?.role === "ADMIN" && user?.verify == 1 ? (
        <PdfExport title="thongke">
          <div className="actual-receipt border p-2 rounded-2xl">
            <Chart type="bar" data={orderOption} options={options} />
          </div>
        </PdfExport>
      ) : null}
    </Layout>
  );
};
export default Home;
