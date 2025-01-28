const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3001", // Replace with the URL of your frontend
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.json()); // Parse JSON request bodies

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minitom4!!",
  database: "martial_arts_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error.");
    }

    if (results.length === 0) {
      return res.status(400).send("Invalid email or password.");
    }

    const user = results[0];

    // Compare hashed passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error.");
      }

      if (!isMatch) {
        return res.status(400).send("Invalid email or password.");
      }

      // Generate JWT token
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    });
  });
});

// Stats route (GET stats using token)
app.get("/api/stats", (req, res) => {
  console.log("trying to get STATS")
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Authorization" header
  console.log(token);
  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }
  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid or expired token.");
    }

    const user_id = decoded.user_id;
    // Query stats for the authenticated user
    db.query(
      "SELECT patterns, technique, strength, agility, flexibility, combat FROM stats WHERE user_id = ?",
      [user_id],
      (err, results) => {
        console.log(results);
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Database error.");
        }

        if (results.length === 0) {
          return res.status(404).send("No stats found for this user.");
        }

        res.json(results[0]); // Return the user's stats
      }
    );
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
