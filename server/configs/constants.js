const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const USER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const OPERATION_TYPES = {
  IN: "IN",
  OUT: "OUT",
};

const OPERATION_STATUS = {
  DRAFT: "draft",
  READY: "ready",
  WAITING: "waiting",
  DONE: "done",
  CANCELLED: "cancelled",
};

const MOVE_TYPES = {
  IN: "IN",
  OUT: "OUT",
};

module.exports = {
  ROLES,
  USER_STATUS,
  OPERATION_TYPES,
  OPERATION_STATUS,
  MOVE_TYPES,
};
