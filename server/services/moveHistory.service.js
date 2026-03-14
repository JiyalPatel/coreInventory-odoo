const MoveHistory = require("../models/MoveHistory.model");

const getAllMoveHistory = async ({ search, type }) => {
  const pipeline = [];

  pipeline.push({
    $lookup: {
      from: "operations",
      localField: "operation",
      foreignField: "_id",
      as: "operation",
    },
  });
  pipeline.push({ $unwind: "$operation" });

  const match = {};
  if (type) match.moveType = type;
  if (search) {
    match.$or = [
      { "operation.reference": { $regex: search, $options: "i" } },
      { "operation.contact": { $regex: search, $options: "i" } },
    ];
  }
  if (Object.keys(match).length > 0) pipeline.push({ $match: match });

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
    { $unwind: { path: "$fromLocation", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "locations",
        localField: "toLocation",
        foreignField: "_id",
        as: "toLocation",
      },
    },
    { $unwind: { path: "$toLocation", preserveNullAndEmptyArrays: true } }
  );

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

/**
 * Stock ledger for a specific product.
 * Returns all move history for that product with a running balance.
 */
const getProductLedger = async (productId) => {
  const mongoose = require("mongoose");

  const pipeline = [
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $lookup: {
        from: "operations",
        localField: "operation",
        foreignField: "_id",
        as: "operation",
      },
    },
    { $unwind: "$operation" },
    {
      $lookup: {
        from: "locations",
        localField: "fromLocation",
        foreignField: "_id",
        as: "fromLocation",
      },
    },
    { $unwind: { path: "$fromLocation", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "locations",
        localField: "toLocation",
        foreignField: "_id",
        as: "toLocation",
      },
    },
    { $unwind: { path: "$toLocation", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        quantity: 1,
        moveType: 1,
        movedAt: 1,
        "operation._id": 1,
        "operation.reference": 1,
        "operation.contact": 1,
        "fromLocation._id": 1,
        "fromLocation.fullCode": 1,
        "toLocation._id": 1,
        "toLocation.fullCode": 1,
      },
    },
    { $sort: { movedAt: 1 } },
  ];

  const moves = await MoveHistory.aggregate(pipeline);

  // Compute running balance oldest → newest
  let balance = 0;
  const ledger = moves.map((m) => {
    if (m.moveType === "IN") {
      balance += m.quantity;
    } else {
      balance -= m.quantity;
    }
    return { ...m, balance };
  });

  // Return newest first for display
  return ledger.reverse();
};

// Single export — both functions together
module.exports = { getAllMoveHistory, getProductLedger };