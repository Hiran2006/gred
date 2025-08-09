import jwt from "jsonwebtoken";
import { User } from "@/app/generated/prisma";

// In production, use an environment variable with a strong secret key
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

if (!JWT_SECRET) {
  console.info("JWT_SECRET is not defined, continue with default value");
}

type TokenPayload = {
  userId: number;
  email: string;
  role: string;
};

/**
 * Creates a JWT token for the given user
 * @param user The user object containing id, email, and role
 * @returns A signed JWT token
 */
export function createToken(user: Pick<User, "id" | "email" | "role">): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verifies and decodes a JWT token
 * @param token The JWT token to verify
 * @returns The decoded token payload if valid, or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Middleware to check if a request has a valid JWT token
 * @param token The JWT token from the Authorization header
 * @returns An object with validation result and user data if valid
 */
export function validateToken(token: string | undefined): {
  isValid: boolean;
  user?: TokenPayload;
  error?: string;
} {
  if (!token) {
    return { isValid: false, error: "No token provided" };
  }

  // Remove 'Bearer ' prefix if present
  const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

  const decoded = verifyToken(tokenValue);
  if (!decoded) {
    return { isValid: false, error: "Invalid or expired token" };
  }

  return {
    isValid: true,
    user: decoded,
  };
}

/**
 * Extracts the user ID from a JWT token
 * @param token The JWT token
 * @returns The user ID or null if invalid
 */
export function getUserIdFromToken(token: string): number | null {
  const result = validateToken(token);
  return result.isValid && result.user ? result.user.userId : null;
}
