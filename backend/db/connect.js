import { MongoClient } from "mongodb";
import dotenv from "dotenv";

//to load environment variables
dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

export async function connectToDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("TaskPlanetDatabase");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
  return db;
}
