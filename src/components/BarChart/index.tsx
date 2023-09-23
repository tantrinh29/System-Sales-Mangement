import React from "react";
import { Bar } from "react-chartjs-2";

type Props = {
  data: any;
};

const BarChart: React.FC<Props> = ({ data }) => {
  return <Bar data={data} />;
};
export default BarChart;
