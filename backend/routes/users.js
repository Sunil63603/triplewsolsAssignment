import { connectToDB } from "../db/connect.js";

export async function getUsers(req, res) {
  try {
    const db = await connectToDB();

    const usersCollection = db.collection("users");

    const users = await usersCollection.find().toArray();

    //set the HTTP response header to indicate that the content is JSON.
    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching users:", error);

    //set the HTTP response header for a 500 Internal Server Error with JSON content
    res.writeHead(500, { "Content-Type": "application/json" });

    res.end(JSON.stringify({ message: "Failed to fetch users" }));
  }
}

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
      await usersCollection.insertOne(userData);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User added successfully" }));
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.send(JSON.stringify({ message: "Failed to add user" }));
  }
}
