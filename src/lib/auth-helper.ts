import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth";
import { NextResponse } from "next/server";

export interface AuthenticatedUser {
  id: number;
  email: string;
  name?: string | null;
}

/**
 * Check if user is authenticated and return user data
 * @returns User data if authenticated, null if not
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email || "",
    name: session.user.name,
  };
}

/**
 * Require authentication - throws 401 response if not authenticated
 * @returns User data if authenticated
 * @throws NextResponse with 401 if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw NextResponse.json(
      { error: "You must be logged in to access this resource" },
      { status: 401 }
    );
  }

  return user;
}

/**
 * Check if user owns a resource
 * @param userId - The user ID from the resource
 * @param currentUser - The current authenticated user
 * @returns true if owner, throws 403 if not
 */
export function requireOwnership(
  userId: number,
  currentUser: AuthenticatedUser
): boolean {
  if (userId !== currentUser.id) {
    throw NextResponse.json(
      { error: "You do not have permission to access this resource" },
      { status: 403 }
    );
  }
  return true;
}
