import { Router } from "express";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  likeEvent,
} from "./event.Controller";
import { protect } from "../../middleware/auth";

const router = Router();

router.route("/").get(getEvents).post(protect, createEvent);
router
  .route("/:id")
  .get(getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);
router.post("/:id/like", protect, likeEvent);

export default router;
