import React from "react";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { useTransactionContext } from "pages/transactions/context/TransactionProvider";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

// Dark theme color palette
const darkThemeColors = ["#007bff", "#6c757d", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#f8f9fa", "#343a40"];

const MonthlyPieChart = () => {
  const { data } = useTransactionContext();
  const list = data?.sortByCategory || [];
  const chartData = {
    labels: list.map((item) => item._id),
    datasets: [
      {
        data: list.map((category) => category.total),
        backgroundColor: darkThemeColors,
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        display: true,

        labels: {
          color: "rgba(255, 255, 255, 0.8)",

          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          backdropColor: "transparent",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        pointLabels: {
          // color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: "3rem",
          },
        },
      },
    },
  };

  return <PolarArea data={chartData} options={chartOptions} style={{ padding: "2rem", width: "100%" }} />;
};

export default MonthlyPieChart;
