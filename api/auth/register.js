import bcrypt from "bcrypt";
import { createHandler } from "../utils/createHandler";
import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema, "users");

export default createHandler({
  POST: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (await User.findOne({ email })) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await new User({
        email,
        password: hashedPassword,
      }).save();
      console.log("🆕 User created:", newUser._id);

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
});
