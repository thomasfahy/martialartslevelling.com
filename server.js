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
        { user_id: user.user_id, email: user.email},
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
  console.log("trying to get STATS");
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

app.post("/api/updateStats", (req, res) => {
  console.log("Updating stats");
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid or expired token.");
    }

    const user_id = decoded.user_id;
    const newStats = req.body;
    console.log(newStats);

    db.query(
      "SELECT patterns, technique, strength, agility, flexibility, combat, level, current_xp, xp_to_next_level FROM stats WHERE user_id = ?",
      [user_id],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Database error.");
        }

        if (results.length === 0) {
          return res.status(404).send("No stats found for this user.");
        }

        let userStats = results[0];
        console.log(userStats);

        userStats.patterns = newStats.patterns ?? userStats.patterns;
        userStats.technique = newStats.technique ?? userStats.technique;
        userStats.strength = newStats.strength ?? userStats.strength;
        userStats.agility = newStats.agility ?? userStats.agility;
        userStats.flexibility = newStats.flexibility ?? userStats.flexibility;
        userStats.combat = newStats.combat ?? userStats.combat;
        userStats.level = newStats.level ?? userStats.level;
        userStats.current_xp = newStats.current_xp ?? userStats.current_xp;
        userStats.xp_to_next_level = newStats.xp_to_next_level ?? userStats.xp_to_next_level;
        console.log(userStats);

        const query = `
          UPDATE stats 
          SET 
            patterns = ?, 
            technique = ?, 
            strength = ?, 
            agility = ?, 
            flexibility = ?, 
            combat = ?, 
            level = ?, 
            current_xp = ?, 
            xp_to_next_level = ? 
          WHERE user_id = ?`;

        db.execute(query, [
          userStats.patterns,
          userStats.technique,
          userStats.strength,
          userStats.agility,
          userStats.flexibility,
          userStats.combat,
          userStats.level,
          userStats.current_xp,
          userStats.xp_to_next_level,
          user_id
        ], (err, results) => {
          if (err) {
            console.error("Error updating user stats:", err);
            return res.status(500).send("Error updating user stats.");
          }
          res.json({ message: "Stats updated successfully", userStats });
        });
      }
    );
  });
});



app.get("/api/random-quests", (req, res) => {
  console.log("Grabbing 3 random quests");
  const query = "SELECT * FROM quests ORDER BY RAND() LIMIT 3";
  
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ error: "Database query failed" });
      }
      res.json(results);
  });
});

app.post("/api/accept-quest", async (req, res) => {
  const { user_id, quest_id } = req.body;

  console.log("Received user_id:", user_id);
  console.log("Received quest_id:", quest_id);

  try {
      const query = `
      INSERT INTO active_quest (
          user_id, quest_id, quest_title, quest_description, quest_size, time_to_complete, 
          patterns_gain, technique_gain, strength_gain, agility_gain, flexibility_gain, combat_gain, quest_difficulty,
          quest_step_name1, quest_step_current1, quest_step_goal1, quest_step_unit1, quest_step_guide_link1, quest_step_guide_text1,
          quest_step_name2, quest_step_current2, quest_step_goal2, quest_step_unit2, quest_step_guide_link2, quest_step_guide_text2,
          quest_step_name3, quest_step_current3, quest_step_goal3, quest_step_unit3, quest_step_guide_link3, quest_step_guide_text3,
          quest_step_name4, quest_step_current4, quest_step_goal4, quest_step_unit4, quest_step_guide_link4, quest_step_guide_text4
      )
      SELECT 
          ?, quest_id, quest_title, quest_description, quest_size, time_to_complete, 
          patterns_gain, technique_gain, strength_gain, agility_gain, flexibility_gain, combat_gain, quest_difficulty,
          quest_step_name1, 0, quest_step_goal1, quest_step_unit1, quest_step_guide_link1, quest_step_guide_text1,  -- Set current progress to 0
          quest_step_name2, 0, quest_step_goal2, quest_step_unit2, quest_step_guide_link2, quest_step_guide_text2,
          quest_step_name3, 0, quest_step_goal3, quest_step_unit3, quest_step_guide_link3, quest_step_guide_text3,
          quest_step_name4, 0, quest_step_goal4, quest_step_unit4, quest_step_guide_link4, quest_step_guide_text4
      FROM quests
      WHERE quest_id = ?
      ON DUPLICATE KEY UPDATE 
          quest_id = VALUES(quest_id),
          quest_title = VALUES(quest_title),
          quest_description = VALUES(quest_description),
          quest_size = VALUES(quest_size),
          time_to_complete = VALUES(time_to_complete),
          patterns_gain = VALUES(patterns_gain),
          technique_gain = VALUES(technique_gain),
          strength_gain = VALUES(strength_gain),
          agility_gain = VALUES(agility_gain),
          flexibility_gain = VALUES(flexibility_gain),
          combat_gain = VALUES(combat_gain),
          quest_difficulty = VALUES(quest_difficulty),
          quest_step_name1 = VALUES(quest_step_name1),
          quest_step_current1 = VALUES(quest_step_current1),
          quest_step_goal1 = VALUES(quest_step_goal1),
          quest_step_unit1 = VALUES(quest_step_unit1),
          quest_step_guide_link1 = VALUES(quest_step_guide_link1),
          quest_step_guide_text1 = VALUES(quest_step_guide_text1),
          quest_step_name2 = VALUES(quest_step_name2),
          quest_step_current2 = VALUES(quest_step_current2),
          quest_step_goal2 = VALUES(quest_step_goal2),
          quest_step_unit2 = VALUES(quest_step_unit2),
          quest_step_guide_link2 = VALUES(quest_step_guide_link2),
          quest_step_guide_text2 = VALUES(quest_step_guide_text2),
          quest_step_name3 = VALUES(quest_step_name3),
          quest_step_current3 = VALUES(quest_step_current3),
          quest_step_goal3 = VALUES(quest_step_goal3),
          quest_step_unit3 = VALUES(quest_step_unit3),
          quest_step_guide_link3 = VALUES(quest_step_guide_link3),
          quest_step_guide_text3 = VALUES(quest_step_guide_text3),
          quest_step_name4 = VALUES(quest_step_name4),
          quest_step_current4 = VALUES(quest_step_current4),
          quest_step_goal4 = VALUES(quest_step_goal4),
          quest_step_unit4 = VALUES(quest_step_unit4),
          quest_step_guide_link4 = VALUES(quest_step_guide_link4),
          quest_step_guide_text4 = VALUES(quest_step_guide_text4);
      `;

      await db.execute(query, [user_id, quest_id]);

      res.json({ success: true, message: "Quest accepted!" });
  } catch (error) {
      console.error("Error accepting quest:", error);
      res.status(500).json({ success: false, message: "Database error." });
  }
});


app.get("/api/get-active-quest", (req, res) => {
  console.log("trying to get ACTIVE QUEST")
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
      "SELECT * FROM active_quest WHERE user_id = ?",
      [user_id],
      (err, results) => {
        console.log(results);
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Database error.");
        }

        if (results.length === 0) {
          return res.status(404).send("No active quest found for this user.");
        }

        res.json(results[0]);
      }
    );
  });
});

app.get("/api/get-user-name", (req, res) => {
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
      "SELECT username FROM users WHERE user_id = ?",
      [user_id],
      (err, results) => {
        console.log(results);
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Database error.");
        }

        if (results.length === 0) {
          return res.status(404).send("No active quest found for this user.");
        }

        res.json(results[0]);
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
