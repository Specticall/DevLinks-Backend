import { Router } from "express";
import { login, protect, register } from "../controller/authController";
import { getAllUsers, getUser } from "../controller/userController";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.route("/").get(protect, getAllUsers);
router.route("/:id").get(protect, getUser);

export default router;
