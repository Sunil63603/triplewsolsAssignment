//use this setCorsHeaders() in server.js file to allow CORS permissions

const allowedOrigin = process.env.FRONTEND_URL;

const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];

export function setCorsHeaders(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); //use "allowedOrigin" variable here instead of "*"
  res.setHeader("Access-Control-Allow-Methods", allowedMethods.join(","));
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return true;
  }

  return false;
}
