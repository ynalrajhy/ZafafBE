import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "./user.Controller";
import { protect } from "../../middleware/auth";

const router = Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserProfile).put(protect, updateUserProfile);

export default router;
