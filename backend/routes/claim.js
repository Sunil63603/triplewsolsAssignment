import { connectToDB } from "../db/connect.js";

//to convert string _id to ObjectId for comparison
import { ObjectId } from "mongodb";

//1.generate random number
//2.Add that to claimedPoints in DB
//3.create a new entry into "claimHistory" collection
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

      //random number between 1-10
      const randomPoints = Math.floor(Math.random() * 10) + 1;
      //Math.random() will generate 0 to 0.9999999...

      const updatedUser = await usersCollection.findOneAndUpdate(
        { _id: ObjectId.createFromHexString(_id) }, //string _id is converted to ObjectId() for comparison
        {
          $inc: {
            claimedPoints: randomPoints,
            totalPoints: randomPoints,
          },
        },
        { returnDocument: "after" }
      );

      //add new entry into "claimHistory" collection
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
          claimedPoints: randomPoints, //used while displaying popUp toast notification on UsersPage
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
