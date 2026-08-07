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
    return { saved: false, message: "Off the list. No hard feelings" };
  }

  const edit = await defaultEdit(user.id, lookName);
  await prisma.savedItem.create({ data: { editId: edit.id, productId } });

  const count = await prisma.savedItem.count({ where: { editId: edit.id } });
  revalidatePath("/", "layout");

  return {
    saved: true,
    message: `Yours now ♥ ${edit.name} is ${count} deep`,
  };
}

/** Follow or unfollow a label. Following is what fills the shelf. */
export async function toggleFollow(brandId: string): Promise<SaveResult> {
  const user = await getCurrentUser();

  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  if (!brand) throw new Error("No such label.");

  const existing = await prisma.follow.findUnique({
    where: { userId_brandId: { userId: user.id, brandId } },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { userId_brandId: { userId: user.id, brandId } },
    });
    revalidatePath("/", "layout");
    return { saved: false, message: `Unfollowed ${brand.name}. No hard feelings` };
  }

  await prisma.follow.create({ data: { userId: user.id, brandId } });
  revalidatePath("/", "layout");
  return {
    saved: true,
    message: "Following. You’ll know before they announce it",
  };
}

/**
 * Star a look, or unstar it. Starred looks climb the home strip, so this is
 * how the deck teaches home what you keep coming back to.
 */
export async function toggleStar(aestheticId: string): Promise<SaveResult> {
  const user = await getCurrentUser();

  const look = await prisma.aesthetic.findUnique({ where: { id: aestheticId } });
  if (!look) throw new Error("No such look.");

  const existing = await prisma.favouriteLook.findUnique({
    where: { userId_aestheticId: { userId: user.id, aestheticId } },
  });

  if (existing) {
    await prisma.favouriteLook.delete({
      where: { userId_aestheticId: { userId: user.id, aestheticId } },
    });
    revalidatePath("/", "layout");
    return {
      saved: false,
      message: `Fair enough. Easing off ${look.name.toLowerCase()}`,
    };
  }

  await prisma.favouriteLook.create({ data: { userId: user.id, aestheticId } });
  revalidatePath("/", "layout");
  return { saved: true, message: "Noted! More of that on the way" };
}

/** "Put this on my home" — the look the feed opens on from now on. */
export async function adoptLook(aestheticId: string): Promise<SaveResult> {
  const user = await getCurrentUser();

  const look = await prisma.aesthetic.findUnique({ where: { id: aestheticId } });
  if (!look) throw new Error("No such look.");

  await prisma.user.update({
    where: { id: user.id },
    data: { activeAestheticId: aestheticId },
  });

  revalidatePath("/", "layout");
  return { saved: true, message: `${look.name} it is. Home just changed ♥` };
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
    message: `Into ${edit.name} it goes ♥`,
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
    message: `New board! Name it when inspiration strikes`,
  };
}
