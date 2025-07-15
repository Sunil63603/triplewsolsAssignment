import http from "http";
import dotenv from "dotenv";
import { setCorsHeaders } from "./utils/cors.js";

import { getUsers } from "./routes/users.js";
import { addUser } from "./routes/users.js";
import { claimPoints } from "./routes/claim.js";

const PORT = process.env.BACKEND_PORT;

const server = http.createServer(async (req, res) => {
  dotenv.config();

  //set CORS headers on every request
  if (setCorsHeaders(req, res)) return;

  if (req.url === "/api/users" && req.method === "GET") {
    await getUsers(req, res);
  } else if (req.url === "/api/users" && req.method === "POST") {
    await addUser(req, res);
  } else if (req.url === "/api/claimPoints" && req.method === "POST") {
    await claimPoints(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route Not Found" }));
  }
});

const BACKEND_URL = process.env.BACKEND_URL;
server.listen(PORT, () => {
  console.log(`Server running at ${BACKEND_URL}`);
});
