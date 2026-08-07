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

/** Save a piece into a board you picked from the sheet. */
export async function saveToEdit(
  productId: string,
  editId: string,
): Promise<SaveResult> {
  const user = await getCurrentUser();

  const edit = await prisma.edit.findFirst({
    where: { id: editId, userId: user.id },
  });
  if (!edit) throw new Error("That board is not yours.");

  await prisma.savedItem.upsert({
    where: { editId_productId: { editId, productId } },
    update: {},
    create: { editId, productId },
  });

  revalidatePath("/", "layout");
  return {
    saved: true,
    message: `Saved to ${edit.name}. It’s coming together nicely`,
  };
}

/**
 * "Somewhere new" — start a board and drop the piece straight into it.
 * Named after the look it came from, numbered if that name is taken, so the
 * sheet never stops to ask you for a name mid-save.
 */
export async function saveToNewEdit(
  productId: string,
  lookName: string,
): Promise<SaveResult> {
  const user = await getCurrentUser();

  const taken = new Set(
    (
      await prisma.edit.findMany({
        where: { userId: user.id },
        select: { name: true },
      })
    ).map((e) => e.name),
  );

  let name = lookName;
  for (let n = 2; taken.has(name); n += 1) name = `${lookName} ${n}`;

  const edit = await prisma.edit.create({
    data: { userId: user.id, name, note: "Just started" },
  });
  await prisma.savedItem.create({ data: { editId: edit.id, productId } });

  revalidatePath("/", "layout");
  return {
    saved: true,
    message: `Saved to ${name}. Name it whenever you like`,
  };
}
