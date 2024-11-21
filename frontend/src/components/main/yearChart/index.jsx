import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { ALL_MONTHS } from "constants/AllMonts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatAmount = (amount) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${amount.toFixed(1)}`;
};

const YearChart = React.memo(({ monthlyData }) => {
  const chartData = useMemo(() => {
    return {
      labels: ALL_MONTHS.map((month) => month.short),
      datasets: [
        {
          label: "Monthly Incomes",
          data: ALL_MONTHS.map((_, index) => monthlyData[index]?.incomes || 0),
          backgroundColor: "rgba(40, 167, 69, 0.6)",
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 1,
        },
        {
          label: "Monthly Expenses",
          data: ALL_MONTHS.map((_, index) => monthlyData[index]?.expenses || 0),
          backgroundColor: "rgba(220, 53, 69, 0.6)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [monthlyData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          padding: 20,
          font: {
            size: 14,
            family: "Monospace",
          },
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return ALL_MONTHS[context[0].dataIndex].long;
          },
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${formatAmount(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          callback: function (value) {
            return formatAmount(value);
          },
        },
      },
    },
  };

  return (
    <div className="text-light border-light shadow-lg p-3 rounded bg-dark" style={{ height: "70vh" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
});

export default YearChart;