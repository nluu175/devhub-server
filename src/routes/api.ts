import { Router } from "express";
import { books } from "../data/books";

const router = Router();

router.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

router.get("/books", (_, res) => {
  res.json(books);
});

export const apiRoutes = router;
