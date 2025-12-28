import { Schema, model } from "mongoose";
import { ICalendar } from "../types/calendar.types";

const calendarSchema = new Schema<ICalendar>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique combination of user and event
calendarSchema.index({ user: 1, event: 1 }, { unique: true });

export default model<ICalendar>("Calendar", calendarSchema);
