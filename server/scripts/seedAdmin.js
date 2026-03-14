/**
 * One-time admin seed script.
 * Usage: node scripts/seedAdmin.js
 *
 * Creates the first admin user. Never expose this as an API endpoint.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

const ADMIN = {
  loginId: "admin1",
  email: "admin@coreinventory.com",
  password: "Admin@1234",
  role: "admin",
  status: "approved",
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ loginId: ADMIN.loginId });
    if (existing) {
      console.log(`Admin "${ADMIN.loginId}" already exists. Skipping.`);
      return;
    }

    const passwordHash = await bcrypt.hash(ADMIN.password, 12);

    await User.create({
      loginId: ADMIN.loginId,
      email: ADMIN.email,
      passwordHash,
      role: ADMIN.role,
      status: ADMIN.status,
    });

    console.log("✅ Admin user created successfully");
    console.log(`   loginId : ${ADMIN.loginId}`);
    console.log(`   email   : ${ADMIN.email}`);
    console.log(`   password: ${ADMIN.password}`);
    console.log("   Change the password after first login!");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
