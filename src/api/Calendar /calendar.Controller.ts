import { Request, Response } from "express";
import Calendar from "../../models/Calendar";
import Event from "../../models/Event";
import { IUser } from "../../types/user.types";

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get user's calendar events
// @route   GET /api/calendar
// @access  Private
export const getCalendarEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const filter = { user: req.user!._id };

    const calendarEvents = await Calendar.find(filter)
      .populate({
        path: "event",
        populate: {
          path: "createdBy",
          select: "firstName lastName profileImage",
        },
      })
      .sort({ savedAt: -1 });

    res.status(200).json({
      success: true,
      count: calendarEvents.length,
      events: calendarEvents,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save event to calendar
// @route   POST /api/calendar/:eventId
// @access  Private
export const saveEventToCalendar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    // Check if already saved
    const existing = await Calendar.findOne({
      user: req.user!._id,
      event: req.params.eventId,
    });

    if (existing) {
      res
        .status(400)
        .json({ success: false, message: "Event already saved to calendar" });
      return;
    }

    const calendarEvent = await Calendar.create({
      user: req.user!._id,
      event: req.params.eventId,
    });

    const populatedCalendarEvent = await calendarEvent.populate({
      path: "event",
      populate: {
        path: "createdBy",
        select: "firstName lastName profileImage",
      },
    });

    res.status(201).json({
      success: true,
      message: "Event saved to calendar",
      calendarEvent: populatedCalendarEvent,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove event from calendar
// @route   DELETE /api/calendar/:eventId
// @access  Private
export const removeEventFromCalendar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const calendarEvent = await Calendar.findOneAndDelete({
      user: req.user!._id,
      event: req.params.eventId,
    });

    if (!calendarEvent) {
      res
        .status(404)
        .json({ success: false, message: "Event not found in calendar" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event removed from calendar",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
