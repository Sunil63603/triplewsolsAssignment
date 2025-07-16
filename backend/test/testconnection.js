//just for testing purpose. Ignore this
import { connectToDB } from "../db/connect.js";

async function testDB() {
  try {
    const db = await connectToDB();
    console.log("Connected To DB:", db.databaseName);
    process.exit(0);
  } catch (err) {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  }
}

testDB();
