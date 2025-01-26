const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("THIS IS WORKING");

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

// API Endpoint: Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    // Query the database for the user by email
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Internal server error.");
        }

        if (results.length === 0) {
            // No user found with the given email
            return res.status(400).send("Invalid email or password.");
        }

        const user = results[0];
        console.log(user);

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).send("Internal server error.");
            }

            if (!isMatch) {
                // Password does not match
                return res.status(400).send("Invalid email or password.");
            }

            // If email and password are correct, generate a JWT
            const token = jwt.sign(
                { userId: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Send the token as a response
            res.json({ token });
        });
    });
});

// API Endpoint: Fetch user stats (Authenticated)
app.get("/api/stats/:userId", (req, res) => {
    const { userId } = req.params;

    // Verify JWT from the Authorization header
    const token = req.headers["authorization"]?.split(" ")[1]; // Expecting "Bearer token"
    if (!token) {
        return res.status(403).send("Access denied.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid token.");
        }

        // Ensure that the token's userId matches the requested userId
        if (decoded.userId !== parseInt(userId)) {
            return res.status(403).send("Access denied.");
        }

        // Proceed to get the user stats
        db.query(
            "SELECT * FROM Stats WHERE user_id = ?",
            [userId],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json(results[0]);
            }
        );
    });
});

// API Endpoint: Update stats after attending class (Authenticated)
app.post("/api/attend-class", (req, res) => {
    const { userId } = req.body;

    // Verify JWT from the Authorization header
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(403).send("Access denied.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid token.");
        }

        // Ensure that the token's userId matches the requested userId
        if (decoded.userId !== parseInt(userId)) {
            return res.status(403).send("Access denied.");
        }

        // Update stats
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
                    res.status(500).send(err);
                    return;
                }
                res.send("Stats updated successfully!");
            }
        );
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

console.log("YEAH YEAH")

module.exports = app;
