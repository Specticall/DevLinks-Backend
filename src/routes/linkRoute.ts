import { Router } from "express";
import { protect } from "../controller/authController";
import {
  addLink,
  deleteLink,
  getLink,
  updateLink,
} from "../controller/linkController";

const router = Router();

router
  .route("/:id")
  .post(protect, addLink)
  .delete(protect, deleteLink)
  .get(protect, getLink)
  .patch(protect, updateLink);

export default router;
