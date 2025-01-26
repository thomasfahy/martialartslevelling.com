const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Use your MySQL username
    password: "Minitom4!!", // Use your MySQL password
    database: "martial_arts_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
});

// JWT secret key (should be stored securely, not hardcoded in production)
const JWT_SECRET = "your_jwt_secret_key";

// API Endpoint: User Registration
app.post("/api/register", (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send("Error hashing password");
            return;
        }

        // Store user in database
        const query = "INSERT INTO Users (username, password) VALUES (?, ?)";
        db.query(query, [username, hashedPassword], (err, results) => {
            if (err) {
                res.status(500).send("Error registering user");
                return;
            }
            res.status(200).send("User registered successfully");
        });
    });
});

// API Endpoint: User Login
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const query = "SELECT * FROM Users WHERE username = ?";
    db.query(query, [username], (err, results) => {
        if (err) {
            res.status(500).send("Error checking user");
            return;
        }

        if (results.length === 0) {
            return res.status(401).send("User not found");
        }

        // Compare provided password with hashed password in database
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                res.status(500).send("Error comparing passwords");
                return;
            }

            if (!isMatch) {
                return res.status(401).send("Invalid credentials");
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ token });
        });
    });
});

// Middleware to check if user is authenticated using JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from Authorization header
    if (!token) {
        return res.status(403).send("Access denied. No token provided.");
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Invalid or expired token");
        }
        req.user = user; // Add user info to request object
        next();
    });
};

// API Endpoint: Fetch user stats (requires authentication)
app.get("/api/stats", authenticateJWT, (req, res) => {
    const { userId } = req.user;

    db.query("SELECT * FROM Stats WHERE user_id = ?", [userId], (err, results) => {
        if (err) {
            return res.status(500).send("Error fetching stats");
        }
        res.json(results[0]);
    });
});

// API Endpoint: Update stats after attending class (requires authentication)
app.post("/api/attend-class", authenticateJWT, (req, res) => {
    const { userId } = req.user; // Get userId from the JWT payload

    db.query(
        `UPDATE Stats
         SET patterns = patterns + 1,
             technique = technique + 1,
             strength = strength + 1,
             agility = agility + 1,
             flexibility = flexibility + 1,
             combat = combat + 1
         WHERE user_id = ?`,
        [userId],
        (err, results) => {
            if (err) {
                return res.status(500).send("Error updating stats");
            }
            res.send("Stats updated successfully!");
        }
    );
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

module.exports = app;
