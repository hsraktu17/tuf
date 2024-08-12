import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api", async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const banner = await prisma.banner.create({
      data: {
        BannerText: body.BannerText,
        Link: body.Link,
        Timer: body.Timer,
      },
    });

    res.status(201).json({
      BannerText: banner.BannerText,
      Link: banner.Link,
      Timer: banner.Timer,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the banner." });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
