const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

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

// API Endpoint: Fetch user stats
app.get("/api/stats/:userId", (req, res) => {
    const { userId } = req.params;
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

// API Endpoint: Update stats after attending class
app.post("/api/attend-class", (req, res) => {
    const { userId } = req.body;
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

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

module.exports = app;