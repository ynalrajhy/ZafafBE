import { Document, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  category:
    | "Sports"
    | "Music"
    | "Art"
    | "Food"
    | "Technology"
    | "Business"
    | "Social"
    | "Other";
  date: Date;
  time: string;
  location: string;
  area: string;
  familyName?: string;
  image?: string;
  createdBy: Types.ObjectId;
  likes: Types.ObjectId[];
  attendees: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
