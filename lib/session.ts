import { prisma } from "./prisma";

/**
 * Stand-in for authentication.
 *
 * There is no sign-in yet, so the app acts as the seeded shopper. Everything
 * that needs a user goes through here, so swapping in real auth later is one
 * function, not a sweep through every screen.
 */
const DEMO_EMAIL = "aria@theedit.test";

export async function getCurrentUser() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: { activeAesthetic: true },
  });

  if (!user) {
    throw new Error(
      `No user ${DEMO_EMAIL}. The database has not been seeded — run \`npx prisma db seed\`.`,
    );
  }

  return user;
}
