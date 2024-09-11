import express from "express";
import dotenv from "dotenv";
import userRoutes from "./user";
import jobRoutes from "./jobs";
import cors from 'cors';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));  

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
