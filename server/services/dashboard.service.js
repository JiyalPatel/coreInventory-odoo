const Operation = require("../models/Operation.model");

const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await Operation.aggregate([
    {
      $facet: {
        // IN operations (receipts)
        receipts_total: [
          { $match: { type: "IN" } },
          { $count: "count" },
        ],
        receipts_late: [
          {
            $match: {
              type: "IN",
              status: { $nin: ["done", "cancelled"] },
              scheduleDate: { $lt: today },
            },
          },
          { $count: "count" },
        ],
        receipts_operations: [
          {
            $match: {
              type: "IN",
              status: "ready",
              scheduleDate: { $gte: today },
            },
          },
          { $count: "count" },
        ],

        // OUT operations (deliveries)
        deliveries_total: [
          { $match: { type: "OUT" } },
          { $count: "count" },
        ],
        deliveries_late: [
          {
            $match: {
              type: "OUT",
              status: { $nin: ["done", "cancelled"] },
              scheduleDate: { $lt: today },
            },
          },
          { $count: "count" },
        ],
        deliveries_waiting: [
          {
            $match: { type: "OUT", status: "waiting" },
          },
          { $count: "count" },
        ],
        deliveries_operations: [
          {
            $match: {
              type: "OUT",
              status: "ready",
              scheduleDate: { $gte: today },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const s = stats[0];
  const extract = (arr) => (arr[0]?.count ?? 0);

  return {
    receipts: {
      total: extract(s.receipts_total),
      late: extract(s.receipts_late),
      operations: extract(s.receipts_operations),
    },
    deliveries: {
      total: extract(s.deliveries_total),
      late: extract(s.deliveries_late),
      waiting: extract(s.deliveries_waiting),
      operations: extract(s.deliveries_operations),
    },
  };
};

module.exports = { getDashboardStats };
