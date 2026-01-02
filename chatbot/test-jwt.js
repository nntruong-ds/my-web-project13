require("dotenv").config();
const jwt = require("jsonwebtoken");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJuZ29jIiwicm9sZSI6IkVNUExPWUVFIiwiaWF0IjoxNzY1NjUyNzIxLCJleHAiOjE3NjU2NTI3ODF9.cW2FZ9ayXOfhy0hJvs9p8zI9-irZ42gWhbQHA12kTf8";

const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded);
