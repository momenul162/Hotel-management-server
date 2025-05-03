import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET || "your-default-secret";
import { User } from "../models/User";
import { UserSchema } from "../models/User";

// const generateToken = (id: string) => {
//   const secret = process.env.JWT_SECRET || "your-default-secret";
//   return jwt.sign({ id }, secret, { expiresIn: "30d" });
// };

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = UserSchema.parse(req.body);

    // Check if user already exists
    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const user = await User.create({
      ...validatedData,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.status(200).json({ user: payload, token });
  } catch (error) {
    res.status(400).json({ message: "Error logging in", error });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.params);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
