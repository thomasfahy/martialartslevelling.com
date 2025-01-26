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

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Minitom4!!",
    database: "martial_arts_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
});


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
        console.log(user);

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).send("Internal server error.");
            }

            if (!isMatch) {
                return res.status(400).send("Invalid email or password.");
            }

            const token = jwt.sign(
                { userId: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ token });
        });
    });
});

app.get("/api/stats/:userId", (req, res) => {
    const { userId } = req.params;

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(403).send("Access denied.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid token.");
        }

        if (decoded.userId !== parseInt(userId)) {
            return res.status(403).send("Access denied.");
        }


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

app.get("/api/stats", (req, res) => {
    // Get the token from the Authorization header
    const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"
    
    if (!token) {
        return res.status(403).send("Access denied. No token provided.");
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid or expired token.");
        }

        // Extract userId from decoded JWT token
        const userId = decoded.userId;

        // Query to fetch stats for the user, excluding the user_id column
        db.query(
            "SELECT patterns, technique, strength, agility, flexibility, combat FROM stats WHERE user_id = ?",
            [userId],
            (err, results) => {
                if (err) {
                    return res.status(500).send("Database error: " + err);
                }

                if (results.length === 0) {
                    return res.status(404).send("No stats found for this user.");
                }

                // Return the stats data excluding user_id
                const stats = results[0]; // Assuming we expect only one row for each user_id
                res.json(stats); // Send the stats data as JSON
            }
        );
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

console.log("YEAH YEAH")

module.exports = app;
