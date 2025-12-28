import { Request, Response } from "express";
import Event from "../../models/Event";
import { IEvent } from "../../types/event.types";
import { IUser } from "../../types/user.types";

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      area,
      category,
      familyName,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (area) filter.area = area;
    if (category) filter.category = category;
    if (familyName) filter.familyName = familyName;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const events = await Event.find(filter)
      .populate("createdBy", "firstName lastName profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      events,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "firstName lastName profileImage email")
      .populate("likes", "firstName lastName profileImage")
      .populate("attendees", "firstName lastName profileImage");

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
export const createEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      area,
      familyName,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !time ||
      !location ||
      !area
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      area,
      familyName,
      image: req.file ? req.file.path : null,
      createdBy: req.user!._id,
    });

    const populatedEvent = await event.populate(
      "createdBy",
      "firstName lastName profileImage"
    );

    res.status(201).json({
      success: true,
      event: populatedEvent,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    // Check if user is event creator
    if (event.createdBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this event",
      });
      return;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "firstName lastName profileImage");

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    // Check if user is event creator
    if (event.createdBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this event",
      });
      return;
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like/Unlike event
// @route   POST /api/events/:id/like
// @access  Private
export const likeEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    const userLiked = event.likes.includes(req.user!._id);

    if (userLiked) {
      event.likes = event.likes.filter(
        (id: any) => id.toString() !== req.user!._id.toString()
      );
    } else {
      event.likes.push(req.user!._id);
    }

    event = await event.save();

    res.status(200).json({
      success: true,
      message: userLiked ? "Event unliked" : "Event liked",
      event,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
