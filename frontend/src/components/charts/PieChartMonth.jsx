import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { filterByMonthAndYear } from "hooks/filterByMonthYear";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomLegend = ({ data }) => (
  <div style={{ marginLeft: "20px" }}>
    {data.map((entry, index) => (
      <div key={`legend-${index}`} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: COLORS[index % COLORS.length],
            marginRight: "10px",
          }}
        />
        <span style={{ fontWeight: "bold", color: "wheat" }}>{entry.category}</span>
      </div>
    ))}
  </div>
);

const PieChartMonth = ({ list, date }) => {
  const filteredList = filterByMonthAndYear(list, date);

  const categoryTotals = filteredList.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = amount;
    } else {
      acc[category] += amount;
    }
    return acc;
  }, {});

  const monthData = Object.keys(categoryTotals).map((category) => ({
    category,
    totalAmount: categoryTotals[category],
  }));

  return (
    <div style={{ display: "flex", width: "100%", height: "400px" }}>
      <div style={{ width: "60%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={monthData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="totalAmount"
              nameKey="category"
              label={renderCustomizedLabel}
            >
              {monthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ width: "40%", display: "flex", alignItems: "center" }}>
        <CustomLegend data={monthData} />
      </div>
    </div>
  );
};

export default PieChartMonth;
