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
    data: orders,
    isLoading,
    isError,
  } = useQuery(["orders"], () => orderService.fetchAllOrders(), {
    retry: 3,
    retryDelay: 1000,
  });

  // Calculate total sales only if data is available
  const totalSales = orders?.reduce(
    (total: number, order: any) => total + parseFloat(order.totalPrice),
    0
  );

  const orderOption = {
    labels: ["Total Sales"],
    datasets: [
      {
        label: "Total Sales",
        data: [totalSales || 0], // Default to 0 if totalSales is undefined
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Bar border color
        borderWidth: 1, // Bar border width
      },
    ],
  };

  const options: any = {
    scales: {
      x: {
        type: "category", // Use the category scale for x-axis
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Layout>
      <div>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <div>Error loading data</div>
        ) : (
          <Chart type="bar" data={orderOption} options={options} />
        )}
      </div>
    </Layout>
  );
};

export default ChartPage;
