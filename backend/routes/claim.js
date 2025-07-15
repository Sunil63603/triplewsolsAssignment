import { connectToDB } from "../db/connect.js";

import { ObjectId } from "mongodb";

export async function claimPoints(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const { _id } = JSON.parse(body);

      const db = await connectToDB();
      const usersCollection = db.collection("users");
      const historyCollection = db.collection("claimHistory");

      const randomPoints = Math.floor(Math.random() * 10) + 1;

      const updatedUser = await usersCollection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(_id) },
        {
          $inc: {
            claimedPoints: randomPoints,
            totalPoints: randomPoints,
          },
        },
        { returnDocument: "after" }
      );

      await historyCollection.insertOne({
        userId: updatedUser._id,
        name: updatedUser.name,
        pointsClaimed: randomPoints,
        totalPoints: updatedUser.totalPoints,
        timeStamp: new Date(),
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Points claimed successfully",
          claimedPoints: randomPoints,
          userId: updatedUser._id,
        })
      );
    });
  } catch (error) {
    console.error("Error claiming points:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Failed to claim points" }));
  }
}
