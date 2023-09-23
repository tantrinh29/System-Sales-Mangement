import React, { useEffect } from "react";
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
import { Chart } from "react-chartjs-2";
import Layout from "../../components/Layout";
import { RANDOM } from "../../utils/custom.env";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/order.service";
import Loading from "../../components/Loading";
import PdfExport from "../../components/PdfReport/PdfExport";

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

const ChartPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);

  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery(["orders"], () => orderService.fetchAllOrders(), {
    retry: 3,
    retryDelay: 1000,
  });

  const groupOrdersByDay = (orders: any) => {
    if (!orders) {
      return {}; // Return an empty object if orders is null or undefined
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
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div>Error loading data</div>
      ) : (
        <PdfExport title="thongke">
          <div className="actual-receipt">
            <Chart type="bar" data={orderOption} options={options} />
          </div>
        </PdfExport>
      )}
    </Layout>
  );
};

export default ChartPage;
