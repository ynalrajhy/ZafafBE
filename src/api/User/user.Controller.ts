import { Request, Response } from "express";
import User from "../../models/User";
import { IUser } from "../../types/user.types";

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("savedEvents");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Check if user is updating their own profile
    if (req.params.id !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this profile",
      });
      return;
    }

    const { firstName, lastName, bio, phone, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        bio,
        phone,
        location,
        profileImage: req.file ? req.file.path : undefined,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
