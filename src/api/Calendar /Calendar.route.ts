import { Router } from "express";
import {
  getCalendarEvents,
  saveEventToCalendar,
  removeEventFromCalendar,
} from "./calendar.Controller";
import { protect } from "../../middleware/auth";

const router = Router();

router.route("/").get(protect, getCalendarEvents);
router
  .route("/:eventId")
  .post(protect, saveEventToCalendar)
  .delete(protect, removeEventFromCalendar);

export default router;
