import React, { useMemo } from "react";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import { PolarArea } from "react-chartjs-2";
import styles from "./chart.module.css";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

// Dark theme color palette
const darkThemeColors = ["#007bff", "#6c757d", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#f8f9fa", "#343a40"];

const MonthlyChart = React.memo(({ data }) => {
  const { chartData, chartOptions } = useMemo(() => {
    return {
      chartData: {
        labels: data.map((item) => item.category),
        datasets: [
          {
            data: data.map((category) => category.total),
            backgroundColor: darkThemeColors,
            borderColor: "rgba(255, 255, 255, 0.3)",
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500, // Reduce animation duration
          easing: "linear", // Simpler easing function
        },
        plugins: {
          legend: {
            position: "bottom",
            display: true,
            labels: {
              color: "rgba(255, 255, 255, 0.8)",
              font: { size: 12 },
              usePointStyle: true, // Better performance for legend
            },
          },
          tooltip: {
            enabled: true, // Keep tooltips but with simpler animation
            animation: {
              duration: 200,
            },
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
              maxTicksLimit: 5, // Limit number of ticks for better performance
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
              circular: true,
            },
            angleLines: {
              color: "rgba(255, 255, 255, 0.2)",
            },
            pointLabels: {
              font: { size: 12 }, // Reduced font size
              centerPointLabels: true,
            },
          },
        },
        // Disable hover animations for better performance
        hover: {
          animationDuration: 0,
        },
        // Reduce overall animations
        transitions: {
          active: {
            animation: {
              duration: 200,
            },
          },
        },
      },
    };
  }, [data]);

  return (
    <div className={styles.chartContainer}>
      <PolarArea
        data={chartData}
        options={chartOptions}
        style={{
          padding: "1rem",
          width: "100%",
          height: "300px", // Fixed height
        }}
      />
    </div>
  );
});

export default MonthlyChart;
