// import Expense from "../models/expenseModel.js";
// import Income from "../models/incomeModel.js";
// export async function getMonthlyData(userId, date, type) {
//   const [year, month] = date.split("-");

//   // Create start and end date strings for the month
//   const startDate = `${year}-${month}-01`;
//   const lastDay = new Date(year, month, 0).getDate();
//   const endDate = `${year}-${month}-${lastDay}`;
//   const Model = type === "income" ? Income : Expense;
//   const result = await Model.aggregate([
//     {
//       $match: {
//         user: userId,
//         date: { $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $facet: {
//         totalAmount: [
//           {
//             $group: {
//               _id: null,
//               total: { $sum: "$amount" },
//             },
//           },
//         ],
//         sortByCategory: [
//           {
//             $group: {
//               _id: "$category",
//               total: { $sum: "$amount" },
//             },
//           },
//         ],
//         allData: [
//           {
//             $sort: { date: -1 },
//           },
//         ],
//       },
//     },
//     {
//       $project: {
//         totalAmount: { $arrayElemAt: ["$totalAmount.total", 0] },
//         sortByCategory: 1,
//         allData: 1,
//       },
//     },
//   ]);

//   return result[0];
// }
