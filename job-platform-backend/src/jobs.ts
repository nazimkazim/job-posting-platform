import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import multer from "multer";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const app = express();

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req?.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      req.user = decoded as { userId: number } & JwtPayload;
      next();
    } else {
      return res.status(403).json({ error: "Invalid token payload" });
    }
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

const allowDeleteAndUpdateForRecruiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req?.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      decoded.userId === req?.user?.userId &&
      decoded.role === "recruiter"
    ) {
      next();
    } else {
      return res.status(403).json({ error: "Invalid token payload" });
    }
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

app.get("/jobposts/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find the job post by its ID
    const jobPost = await prisma.jobPost.findUnique({
      where: { id: Number(id) },
    });

    // If job post is not found, return 404
    if (!jobPost) {
      return res.status(404).json({ error: "Job post not found" });
    }

    // Return the job post details
    res.json(jobPost);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job post" });
  }
});

app.post("/jobposts", authenticate, async (req, res) => {
  const { title, description, salaryRange, location } = req.body;

  // Check if recruiterId exists, if not, throw an error or handle it
  const recruiterId = req?.user?.userId;
  if (!recruiterId) {
    return res.status(400).json({ error: "Recruiter ID is missing" });
  }

  try {
    const jobPost = await prisma.jobPost.create({
      data: {
        title,
        description,
        salaryRange,
        location,
        recruiterId, // Now guaranteed to be a number
      },
    });

    res.json(jobPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating job post" });
  }
});

app.put(
  "/jobposts/:id",
  authenticate,
  allowDeleteAndUpdateForRecruiter,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, salaryRange, location } = req.body;

    const jobPost = await prisma?.jobPost?.findUnique({
      where: { id: Number(id) },
    });

    if (jobPost?.recruiterId !== req?.user?.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to update this post" });
    }

    const updatedJobPost = await prisma.jobPost.update({
      where: { id: Number(id) },
      data: { title, description, salaryRange, location },
    });

    res.json(updatedJobPost);
  }
);

app.delete("/jobposts/:id", authenticate, allowDeleteAndUpdateForRecruiter, async (req, res) => {
  const { id } = req.params;

  const jobPost = await prisma.jobPost.findUnique({
    where: { id: Number(id) },
  });

  if (jobPost?.recruiterId !== Number(req?.user?.userId)) {
    return res
      .status(403)
      .json({ error: "You do not have permission to delete this post" });
  }

  await prisma.jobPost.delete({ where: { id: Number(id) } });

  res.json({ message: "Job post deleted" });
});

app.get("/jobposts", async (req, res) => {
  const {
    title,
    location,
    page = 1,
    pageSize = 10,
  } = req.query as {
    title?: string;
    location?: string;
    page?: string | number;
    pageSize?: string | number;
  };

  const filters = {} as {
    title?: { contains: string };
    location?: { contains: string };
  };

  if (title) filters.title = { contains: title };
  if (location) filters.location = { contains: location };

  const pageNumber = Number(page);
  const pageSizeNumber = Number(pageSize);

  try {
    const jobPosts = await prisma.jobPost.findMany({
      where: filters,
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber,
      include: {
        _count: {
          select: { Application: true },
        },
      },
    });

    const formattedJobPosts = jobPosts.map((jobPost) => ({
      ...jobPost,
      applicationsCount: jobPost._count.Application,
    }));

    res.json(formattedJobPosts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job posts" });
  }
});

const upload = multer({ dest: "uploads/" });

app.post(
  "/jobposts/:id/applications",
  upload.single("resume"),
  async (req, res) => {
    const { id } = req.params;
    const { applicantName, applicantEmail, coverLetter } = req.body;

    const application = await prisma.application.create({
      data: {
        applicantName,
        applicantEmail,
        resumePath: req?.file?.path || "",
        coverLetter,
        jobPostId: Number(id),
      },
    });

    res.json(application);
  }
);

app.get("/jobposts/:id/applications", authenticate, async (req, res) => {
  const { id } = req.params;

  const jobPost = await prisma.jobPost.findUnique({
    where: { id: Number(id) },
  });

  if (jobPost?.recruiterId !== req?.user?.userId) {
    return res
      .status(403)
      .json({ error: "You do not have permission to view these applications" });
  }

  const applications = await prisma.application.findMany({
    where: { jobPostId: Number(id) },
  });

  res.json(applications);
});

app.post(
  "/jobposts/:id/applications",
  upload.single("resume"),
  async (req, res) => {
    const { id } = req.params;
    const { applicantName, applicantEmail, coverLetter } = req.body;

    try {
      const application = await prisma.application.create({
        data: {
          applicantName,
          applicantEmail,
          coverLetter,
          resumePath: req?.file?.path || "",
          jobPostId: Number(id),
        },
      });

      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Error submitting application" });
    }
  }
);

export default app;
