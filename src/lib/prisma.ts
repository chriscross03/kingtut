import { PrismaClient } from "../generated/prisma";

// Use a property on globalThis to avoid multiple instances of PrismaClient
// when in a development environment with hot reload.
const g = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma: PrismaClient = g.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") g.__prisma = prisma;
