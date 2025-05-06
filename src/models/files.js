import mongoose from "mongoose";
import "./datalog";

const Schema = mongoose.Schema;

const filesSchema = new Schema(
  {
    datalog_id: {
      type: mongoose.Types.ObjectId,
      ref: "datalog",
    },
    name: {
      type: String,
    },
    cid: {
      type: String,
      index: true,
    },
    timestamp: {
      type: Number,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Files = mongoose.model("files", filesSchema);

export default Files;

// export async function getHistoryByDate(from, to, city, bound) {
//   const filter = {
//     timestamp: {
//       $gt: from,
//       $lt: to,
//     },
//   };
//   if (bound) {
//     filter["geo.lat"] = {
//       $lte: bound.northEast.lat,
//       $gte: bound.southWest.lat,
//     };
//     filter["geo.lng"] = {
//       $lte: bound.northEast.lng,
//       $gte: bound.southWest.lng,
//     };
//   }
//   if (city) {
//     const sensors = await City.find({ city: city });
//     filter.sensor_id = sensors.map((item) => item.sensor_id);
//   }
//   const rows = await Files.find(filter)
//     .populate("datalog_id", "sender")
//     .sort({ timestamp: 1 })
//     .lean();
//   const result = {};
//   rows.forEach((row) => {
//     if (!Object.prototype.hasOwnProperty.call(result, row.sensor_id)) {
//       result[row.sensor_id] = [];
//     }
//     result[row.sensor_id].push({
//       sender: row.datalog_id ? row.datalog_id.sender : "",
//       data: row.files,
//       geo: row.geo,
//       timestamp: Number(row.timestamp),
//     });
//   });
//   return result;
// }
// export async function getLastValuesByDate(from, to) {
//   const result = {};

//   const rowsStatic = await Files.aggregate([
//     {
//       $match: {
//         timestamp: {
//           $gt: Number(from),
//           $lt: Number(to),
//         },
//         model: {
//           $nin: [3, 4],
//         },
//       },
//     },
//     {
//       $group: {
//         _id: "$sensor_id",
//         sensor_id: { $first: "$sensor_id" },
//         model: { $first: "$model" },
//         files: { $last: "$files" },
//         geo: { $first: "$geo" },
//         timestamp: { $first: "$timestamp" },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         sensor_id: 1,
//         model: 1,
//         files: 1,
//         geo: 1,
//         donated_by: 1,
//         timestamp: 1,
//       },
//     },
//   ]);

//   const rowsMobile = await Files.aggregate([
//     {
//       $match: {
//         timestamp: {
//           $gt: Number(from),
//           $lt: Number(to),
//         },
//         model: 3,
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         sensor_id: 1,
//         model: 1,
//         files: 1,
//         geo: 1,
//         donated_by: 1,
//         timestamp: 1,
//       },
//     },
//     {
//       $sort: {
//         timestamp: 1,
//       },
//     },
//   ]);

//   const iterator = (row) => {
//     if (!result[row.sensor_id]) {
//       result[row.sensor_id] = [];
//     }
//     try {
//       result[row.sensor_id].push({
//         sensor_id: row.sensor_id,
//         model: row.model,
//         data: row.files,
//         geo: row.geo,
//         donated_by: row.donated_by,
//         timestamp: row.timestamp,
//       });
//       // eslint-disable-next-line no-empty
//     } catch (_) {}
//   };

//   rowsStatic.forEach(iterator);
//   rowsMobile.forEach(iterator);

//   return result;
// }
// export async function getLastValueTypeByDate(from, to, type) {
//   const result = {};

//   const rows = await Files.aggregate([
//     {
//       $match: {
//         timestamp: {
//           $gt: Number(from),
//           $lt: Number(to),
//         },
//         [`files.${type}`]: { $exists: true },
//       },
//     },
//     {
//       $group: {
//         _id: "$sensor_id",
//         value: { $last: `$files.${type}` },
//       },
//     },
//   ]);
//   const rowsAll = await Files.aggregate([
//     {
//       $match: {
//         timestamp: {
//           $gt: Number(from),
//           $lt: Number(to),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: "$sensor_id",
//         model: { $first: "$model" },
//         geo: { $first: "$geo" },
//       },
//     },
//   ]);

//   for (const item of rowsAll) {
//     const value = rows.find((row) => row._id === item._id);
//     result[item._id] = [
//       {
//         ...item,
//         sensor_id: item._id,
//         data: value ? { [type]: value.value } : {},
//       },
//     ];
//   }

//   return result;
// }
// export async function getMaxValuesByDate(from, to, type) {
//   const result = {};

//   const rowsStatic = await Files.aggregate([
//     {
//       $match: {
//         timestamp: {
//           $gt: Number(from),
//           $lt: Number(to),
//         },
//         model: {
//           $nin: [3, 4],
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         sensor_id: 1,
//         model: 1,
//         files: 1,
//         geo: 1,
//         donated_by: 1,
//         timestamp: 1,
//       },
//     },
//   ]);

//   const rowsMobile = await Files.aggregate([
//     {
//       $match: {
//         timestamp: {
//           $gt: Number(from),
//           $lt: Number(to),
//         },
//         model: 3,
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         sensor_id: 1,
//         model: 1,
//         files: 1,
//         geo: 1,
//         donated_by: 1,
//         timestamp: 1,
//       },
//     },
//     {
//       $sort: {
//         timestamp: 1,
//       },
//     },
//   ]);

//   const iterator = (row) => {
//     if (!result[row.sensor_id]) {
//       result[row.sensor_id] = [];
//     }
//     try {
//       const files = row.files;
//       if (row.model === 3) {
//         result[row.sensor_id].push({
//           sensor_id: row.sensor_id,
//           model: row.model,
//           data: files,
//           geo: row.geo,
//           donated_by: row.donated_by,
//           timestamp: row.timestamp,
//         });
//       } else {
//         if (result[row.sensor_id].length > 0) {
//           if (files[type] && result[row.sensor_id][0].data[type]) {
//             if (
//               Number(files[type]) <=
//               Number(result[row.sensor_id][0].data[type])
//             ) {
//               return;
//             }
//           } else if (result[row.sensor_id][0].data[type]) {
//             return;
//           }
//         }
//         result[row.sensor_id][0] = {
//           sensor_id: row.sensor_id,
//           model: row.model,
//           data: files,
//           geo: row.geo,
//           donated_by: row.donated_by,
//           timestamp: row.timestamp,
//         };
//       }
//       // eslint-disable-next-line no-empty
//     } catch (_) {}
//   };

//   rowsStatic.forEach(iterator);
//   rowsMobile.forEach(iterator);

//   return result;
// }
// export async function getMessagesByDate(from, to) {
//   const rows = await Files.aggregate([
//     {
//       $match: {
//         timestamp: {
//           $gt: Number(from),
//           $lt: Number(to),
//         },
//         model: 4,
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         sensor_id: 1,
//         model: 1,
//         files: 1,
//         geo: 1,
//       },
//     },
//   ]);
//   const result = [];
//   rows.forEach((row) => {
//     try {
//       result.push({
//         sensor_id: row.sensor_id,
//         model: row.model,
//         files: row.files,
//         geo: row.geo,
//       });
//       // eslint-disable-next-line no-empty
//     } catch (_) {}
//   });
//   return result;
// }

// export async function getBySensor(sensor_id, start, end) {
//   const rows = await Files.find({
//     sensor_id: sensor_id,
//     timestamp: {
//       $gt: start,
//       $lt: end,
//     },
//   })
//     .sort({ timestamp: 1 })
//     .lean();
//   return rows.map((row) => {
//     return {
//       data: row.files,
//       timestamp: row.timestamp,
//       geo: row.geo,
//     };
//   });
// }

// export async function getFiless(start, end) {
//   const rows = await Files.find(
//     {
//       timestamp: {
//         $gt: start,
//         $lt: end,
//       },
//     },
//     { files: 1 }
//   ).lean();
//   let res = [];
//   for (const item of rows) {
//     if (item.files) {
//       res = [...new Set([...res, ...Object.keys(item.files)])];
//     }
//   }
//   return res;
// }
