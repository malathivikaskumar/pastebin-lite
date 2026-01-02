import express from "express";
import {
  createPaste,
  fetchPaste,
  viewPasteHtml
} from "../controllers/paste.js";

const router = express.Router();

router.post("/pastes", createPaste);
router.get("/pastes/:id", fetchPaste);
router.get("/p/:id", viewPasteHtml);

export default router;
