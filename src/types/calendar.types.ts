import { Document, Types } from "mongoose";

export interface ICalendar extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  savedAt: Date;
}
