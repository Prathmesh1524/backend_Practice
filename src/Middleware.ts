import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const AuthMiddlware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    console.log("decoded token:", decoded);

    const userId = (decoded as any).userid;

    if (!userId) {
      return res.status(403).json({ msg: "Invalid Token Payload" });
    }

    req.userId = userId;
    console.log("Middleware userId:", req.userId);

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
