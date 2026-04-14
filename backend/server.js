require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/Item");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("Missing MONGO_URI in backend/.env");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Home route
app.get("/", (req, res) => {
  res.send("SRU LostLink Backend Running");
});

//  POST API (Add Item with owner)
app.post("/items", async (req, res) => {
  try {
    const item = new Item({
      ...req.body,
      userEmail: req.body.userEmail   //  store owner
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add item" });
  }
});

//  GET API (Fetch All Items)
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

//  DELETE API (Only owner can delete)
app.delete("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    //  Check ownership
    if (item.userEmail !== req.body.userEmail) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

//  Register User
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

//  Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const Message = require("./models/Message");

// SEND MESSAGE
app.post("/message", async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.json({ message: "Message sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET MESSAGES FOR USER
app.get("/messages/:email", async (req, res) => {
  try {
    const messages = await Message.find({
      receiverEmail: req.params.email
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.delete("/message/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
});