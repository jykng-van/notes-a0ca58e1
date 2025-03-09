/**
 * Test db connection
 */
import mongoose from "mongoose";
import 'dotenv/config';

export async function connectDBForTesting() {
  try {
    const dbUri = "mongodb://localhost";
    const dbName = "test";
    await mongoose.connect(dbUri, {
      dbName,
      autoCreate: true,
    });
  } catch (error) {
    console.log("DB connect error");
  }
}

export async function disconnectDBForTesting() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log("DB disconnect error");
  }
}