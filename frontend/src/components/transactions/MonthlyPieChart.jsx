import React from "react";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { useTransactionContext } from "components/transactions/TransactionProvider";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

// Dark theme color palette
const darkThemeColors = [
  "rgba(255, 99, 132, 0.8)", // Pink
  "rgba(54, 162, 235, 0.8)", // Blue
  "rgba(255, 206, 86, 0.8)", // Yellow
  "rgba(75, 192, 192, 0.8)", // Teal
  "rgba(153, 102, 255, 0.8)", // Purple
  "rgba(255, 159, 64, 0.8)", // Orange
  "rgba(199, 199, 199, 0.8)", // Gray
  "rgba(83, 102, 255, 0.8)", // Indigo
];

export default function MonthlyPieChart() {
  const { data, isLoading } = useTransactionContext();
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

  return (
    <div style={{ minHeight: "200px", width: "100%" }}>
      <PolarArea data={chartData} options={chartOptions} />
    </div>
  );
}
