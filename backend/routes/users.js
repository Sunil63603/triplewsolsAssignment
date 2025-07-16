import { connectToDB } from "../db/connect.js";

//this function is used in both UsersPage and LeaderBoardPage
export async function getUsers(req, res) {
  try {
    const db = await connectToDB();

    const usersCollection = db.collection("users");

    //reuse this same function both for usersPage and LeadersBoardPage
    const users = await usersCollection
      .find()
      .sort({ totalPoints: -1 }) //descending sort based on totalPoints
      .toArray();

    res.writeHead(200, { "Content-Type": "application/json" });

    //return users[]
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching users:", error);

    //set the HTTP response header for a 500 Internal Server Error with JSON content
    res.writeHead(500, { "Content-Type": "application/json" });

    res.end(JSON.stringify({ message: "Failed to fetch users" }));
  }
}

//used to add user to database and return _id of newly created user
export async function addUser(req, res) {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const userData = JSON.parse(body);
      const db = await connectToDB();
      const usersCollection = db.collection("users");
      const result = await usersCollection.insertOne(userData); //new entry into DB
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "User added successfully",
          _id: result.insertedId.toString(), //used in frontend while claiming points
        })
      );
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.send(JSON.stringify({ message: "Failed to add user" }));
  }
}
