const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d"
  });
}

function safeUser(user, token) {
  return {
    user: {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token
  };
}

async function register(req, res, next) {
  try {
    const { username, password, firstName, lastName, dob, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      firstName,
      lastName,
      dob,
      role: role === "admin" ? "admin" : "user"
    });

    const token = signToken(user._id);
    res.status(201).json(safeUser(user, token));
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id);
    res.json(safeUser(user, token));
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("firstName");
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function editUser(req, res, next) {
  try {
    const { id } = req.params;

    const isOwner = req.user._id.toString() === id;
    if (!isOwner) return res.status(403).json({ message: "Forbidden" });

    const allowed = ["firstName", "lastName", "dob", "password"];
    const update = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const edited = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json({ message: "user was edited successfully", user: edited });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    const isOwner = req.user._id.toString() === id;
    if (!isOwner) return res.status(403).json({ message: "Forbidden" });

    await User.findByIdAndDelete(id);
    res.json({ message: "user deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, listUsers, editUser, deleteUser };
