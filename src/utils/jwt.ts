import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";

export const generateToken = (id: Types.ObjectId): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const expiresIn = process.env.JWT_EXPIRE || "30d";
  return jwt.sign({ id }, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string): string | jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    return null;
  }
};
