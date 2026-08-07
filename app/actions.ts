"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

/**
 * Where an untargeted save lands: the edit named after the look you are
 * browsing, created on first use. Saving from the feed should never make you
 * choose a board first — the sheet is for when you want to.
 */
async function defaultEdit(userId: string, lookName: string) {
  const existing = await prisma.edit.findUnique({
    where: { userId_name: { userId, name: lookName } },
  });
  if (existing) return existing;

  return prisma.edit.create({
    data: { userId, name: lookName, note: "Started from the feed" },
  });
}

export type SaveResult = { saved: boolean; message: string };

/**
 * Toggle a piece in or out of the user's edits. Returns the line the toast
 * shows — the voice is a stylist telling you what just happened.
 */
export async function toggleSave(
  productId: string,
  lookName: string,
): Promise<SaveResult> {
  const user = await getCurrentUser();

  const existing = await prisma.savedItem.findFirst({
    where: { productId, edit: { userId: user.id } },
    include: { edit: true },
  });

  if (existing) {
    await prisma.savedItem.delete({ where: { id: existing.id } });
    revalidatePath("/", "layout");
    return { saved: false, message: "No problem. It’s off your list" };
  }

  const edit = await defaultEdit(user.id, lookName);
  await prisma.savedItem.create({ data: { editId: edit.id, productId } });

  const count = await prisma.savedItem.count({ where: { editId: edit.id } });
  revalidatePath("/", "layout");

  return {
    saved: true,
    message: `Saved to ${edit.name}. That makes ${count} ${
      count === 1 ? "piece" : "pieces"
    } ♥`,
  };
}
