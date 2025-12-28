import { Schema, model } from "mongoose";
import { IEvent } from "../types/event.types";

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, "Please provide an event title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide an event description"],
  },
  category: {
    type: String,
    enum: [
      "Sports",
      "Music",
      "Art",
      "Food",
      "Technology",
      "Business",
      "Social",
      "Other",
    ],
    required: [true, "Please provide an event category"],
  },
  date: {
    type: Date,
    required: [true, "Please provide an event date"],
  },
  time: {
    type: String,
    required: [true, "Please provide an event time (HH:MM format)"],
  },
  location: {
    type: String,
    required: [true, "Please provide an event location"],
  },
  area: {
    type: String,
    required: [true, "Please provide an area/district"],
  },
  familyName: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: null,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for geospatial queries (optional for future enhancement)
eventSchema.index({ area: 1, category: 1 });

export default model<IEvent>("Event", eventSchema);
