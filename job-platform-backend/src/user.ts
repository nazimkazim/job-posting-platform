import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "recruiter",
      },
    });
    // Generate a token and respond with user data
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.json({ token, name: newUser.name, email: newUser.email });
  } catch (error) {
    res?.status(400).json({ error: "Email already exists" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  res.json({ token, name: user.name, email: user.email, role: user.role });
});

// Fetch all users
app.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany(); // Fetch all users
    res.json(users); // Return the users as JSON
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default app;
