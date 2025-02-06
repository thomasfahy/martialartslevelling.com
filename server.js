const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Minitom4!!",
  database: "martial_arts_db",
  connectionLimit: 10
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


    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error.");
      }

      if (!isMatch) {
        return res.status(400).send("Invalid email or password.");
      }
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    });
  });
});



app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, username, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
    return res.status(400).send("All fields are required.");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  db.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [email, username],
    async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Internal server error.");
      }

      if (results.length > 0) {
        const existingUser = results.find((user) => user.email === email);
        if (existingUser) {
          return res.status(400).send("Email already exists.");
        } else {
          return res.status(400).send("Username already exists.");
        }
      }
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("JWT Secret:", process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
          throw new Error("JWT secret is not defined.");
        }

        db.query(
          "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
          [firstName, lastName, username, email, hashedPassword],
          (err, results) => {
            if (err) {
              console.error("Database error:", err);
              return res.status(500).send("Internal server error.");
            }
            console.log("Database results:", results);
            const user_id = results.insertId;
            console.log("User id:", user_id);

            const token = jwt.sign(
              { user_id, email },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            );
            console.log("Generated token:", token);
            res.json({ token });
          }
        );
      } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal server error.");
      }
    }
  );
});


app.post("/api/signup-stats", async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      const user_id = decoded.user_id;
      const { strength, agility, flexibility, combat, technique, patterns } = req.body;

      if (
        [strength, agility, flexibility, combat, technique, patterns].some(val => typeof val !== "number")
      ) {
        return res.status(400).json({ message: "Invalid stats data. All fields must be numbers." });
      }

      console.log("Querying database...");
      db.query("SELECT * FROM stats WHERE user_id = ?", [user_id], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Internal server error." });
        }

        if (results.length > 0) {
          console.log("Updating existing stats...");
          db.query(
            "UPDATE stats SET strength = ?, agility = ?, flexibility = ?, combat = ?, technique = ?, patterns = ? WHERE user_id = ?",
            [strength, agility, flexibility, combat, technique, patterns, user_id],
            (err) => {
              if (err) {
                console.error("Database update error:", err);
                return res.status(500).json({ message: "Failed to update stats." });
              }
              console.log("Stats updated successfully.");
              return res.status(200).json({ message: "Stats updated successfully." });
            }
          );
        } else {
          console.log("Creating new stats entry...");
          db.query(
            "INSERT INTO stats (user_id, strength, agility, flexibility, combat, technique, patterns) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, strength, agility, flexibility, combat, technique, patterns],
            (err) => {
              if (err) {
                console.error("Database insert error:", err);
                return res.status(500).json({ message: "Failed to create stats." });
              }
              console.log("New stats entry created successfully.");
              return res.status(201).json({ message: "Stats created successfully." });
            }
          );
        }
      });
    });
  } catch (error) {
    console.error("Unhandled server error:", error);
    res.status(500).json({ message: "Unexpected server error." });
  }
});

app.get("/api/getStats", (req, res) => {
  console.log("trying to get STATS")
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid or expired token.");
    }

    const user_id = decoded.user_id;

    db.query(
      "SELECT patterns, technique, strength, agility, flexibility, combat, level, current_xp, xp_to_next_level FROM stats WHERE user_id = ?",
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

        res.json(results[0]);
      }
    );
  });
});


app.post('/api/attendClass', (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid or expired token.");
    }

    const updateStatsQuery = `
      UPDATE stats
      SET patterns = patterns + 1,
          technique = technique + 1,
          strength = strength + 1,
          agility = agility + 1,
          flexibility = flexibility + 1,
          combat = combat + 1
      WHERE user_id = ?`;

    const user_id = decoded.user_id;  

    db.query(updateStatsQuery, [user_id], (err, results) => {
      if (err) {
        console.error('Error updating stats:', err);
        return res.status(500).send('Failed to update stats.');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send("No stats found for this user.");
      }
      res.json({ message: 'Stats incremented by +1 for your profile' });
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
