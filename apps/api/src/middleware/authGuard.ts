import { RequestHandler } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";
import { tokenBlacklist } from "../utils/tokenBlacklist";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      token?: string;
      tokenExp?: number;
    }
  }
}

export const authGuard: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid Authorization header"));
  }
  const token = header.slice("Bearer ".length).trim();
  if (tokenBlacklist.isRevoked(token)) {
    return next(new AppError(401, "Token has been revoked"));
  }
  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.token = token;
    req.tokenExp = payload.exp;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
};
