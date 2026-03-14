const MoveHistory = require("../models/MoveHistory.model");

const getAllMoveHistory = async ({ search, type }) => {
  const pipeline = [];

  // Lookup operation to filter by reference/contact
  pipeline.push({
    $lookup: {
      from: "operations",
      localField: "operation",
      foreignField: "_id",
      as: "operation",
    },
  });
  pipeline.push({ $unwind: "$operation" });

  // Filters
  const match = {};
  if (type) match.moveType = type;
  if (search) {
    match.$or = [
      { "operation.reference": { $regex: search, $options: "i" } },
      { "operation.contact": { $regex: search, $options: "i" } },
    ];
  }
  if (Object.keys(match).length > 0) pipeline.push({ $match: match });

  // Lookups for product and locations
  pipeline.push(
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "locations",
        localField: "fromLocation",
        foreignField: "_id",
        as: "fromLocation",
      },
    },
    { $unwind: { path: "$fromLocation", preserveNullAndEmpty: true } },
    {
      $lookup: {
        from: "locations",
        localField: "toLocation",
        foreignField: "_id",
        as: "toLocation",
      },
    },
    { $unwind: { path: "$toLocation", preserveNullAndEmpty: true } }
  );

  // Project only needed fields
  pipeline.push({
    $project: {
      _id: 1,
      quantity: 1,
      moveType: 1,
      movedAt: 1,
      "operation._id": 1,
      "operation.reference": 1,
      "operation.contact": 1,
      "product._id": 1,
      "product.name": 1,
      "fromLocation._id": 1,
      "fromLocation.fullCode": 1,
      "toLocation._id": 1,
      "toLocation.fullCode": 1,
    },
  });

  pipeline.push({ $sort: { movedAt: -1 } });

  return MoveHistory.aggregate(pipeline);
};

module.exports = { getAllMoveHistory };
