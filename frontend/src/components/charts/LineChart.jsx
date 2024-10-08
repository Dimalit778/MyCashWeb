import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { groupByMonth } from "utils/date";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LineChart = React.memo(({ allExpenses, allIncomes }) => {
  const chartData = useMemo(() => {
    const groupedIncomes = groupByMonth(allIncomes);
    const groupedExpenses = groupByMonth(allExpenses);

    return {
      labels: allMonths,
      datasets: [
        {
          label: "Monthly Incomes",
          data: allMonths.map((month) => groupedIncomes[month] || 0),
          backgroundColor: "rgba(40, 167, 69, 0.6)", // Bootstrap success color
          borderColor: "rgba(40, 167, 69, 1)",
          gap: 5,
          borderWidth: 1,
        },
        {
          label: "Monthly Expenses",
          data: allMonths.map((month) => groupedExpenses[month] || 0),
          backgroundColor: "rgba(220, 53, 69, 0.6)", // Bootstrap danger color
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [allExpenses, allIncomes]);

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
            size: 16,
            family: "Monospace",
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
            return "$" + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "60vh" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
});

export default LineChart;
