import { PrismaClient } from "@prisma/client";

/* Next reloads modules on every edit in dev, which would otherwise open a new
   connection pool each time until Postgres refuses them. Hang one client off
   globalThis so reloads reuse it. In production the module is loaded once. */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
