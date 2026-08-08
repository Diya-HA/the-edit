"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { upsertOutfit } from "@/prisma/outfits";
import type { OutfitInput } from "@/prisma/outfits";

export type SaveResult = { saved: boolean; message: string };

/* Saving used to announce itself every single time, which got noisy fast.
   It is quiet now, and every twentieth keep gets the milestone instead. */
const MILESTONE_EVERY = 20;

async function savedTotal(userId: string) {
  return prisma.savedItem.count({ where: { edit: { userId } } });
}

async function confirmSave(userId: string): Promise<SaveResult> {
  const total = await savedTotal(userId);
  const milestone = total > 0 && total % MILESTONE_EVERY === 0;
  return {
    saved: true,
    message: milestone ? "Yours now ♥" : "Saved ✓",
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
  return confirmSave(user.id);
}

/** Take a piece back off a board. */
export async function removeFromEdit(
  productId: string,
  editId: string,
): Promise<SaveResult> {
  const user = await getCurrentUser();

  const edit = await prisma.edit.findFirst({
    where: { id: editId, userId: user.id },
  });
  if (!edit) throw new Error("That board is not yours.");

  await prisma.savedItem.deleteMany({ where: { editId, productId } });
  revalidatePath("/", "layout");
  return { saved: false, message: `Removed from ${edit.name}` };
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
  return confirmSave(user.id);
}

/* ---- Outfits ---- */

/** A free board name, numbered if the one asked for is taken. */
async function freeBoardName(userId: string, wanted: string) {
  const taken = new Set(
    (
      await prisma.edit.findMany({
        where: { userId },
        select: { name: true },
      })
    ).map((e) => e.name),
  );
  let name = wanted;
  for (let n = 2; taken.has(name); n += 1) name = `${wanted} ${n}`;
  return name;
}

async function outfitPieces(outfitId: string) {
  const outfit = await prisma.outfit.findUnique({
    where: { id: outfitId },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!outfit) throw new Error("No such outfit.");
  return outfit;
}

/**
 * Save a whole outfit onto a board you picked. The pieces arrive together,
 * which is the point of an outfit, so this is one action rather than the
 * shopper hearting each piece in turn.
 */
export async function saveOutfitToEdit(
  outfitId: string,
  editId: string,
): Promise<SaveResult> {
  const user = await getCurrentUser();

  const edit = await prisma.edit.findFirst({
    where: { id: editId, userId: user.id },
  });
  if (!edit) throw new Error("That board is not yours.");

  const outfit = await outfitPieces(outfitId);
  await prisma.savedItem.createMany({
    data: outfit.items.map((i) => ({ editId, productId: i.productId })),
    skipDuplicates: true,
  });

  revalidatePath("/", "layout");
  return { saved: true, message: `Saved to ${edit.name} ✓` };
}

/** Save an outfit onto a board of its own, named after it. */
export async function saveOutfitToNewEdit(
  outfitId: string,
): Promise<SaveResult> {
  const user = await getCurrentUser();
  const outfit = await outfitPieces(outfitId);

  const name = await freeBoardName(user.id, outfit.name);
  const edit = await prisma.edit.create({
    data: { userId: user.id, name, note: "Saved as a set" },
  });

  await prisma.savedItem.createMany({
    data: outfit.items.map((i) => ({ editId: edit.id, productId: i.productId })),
    skipDuplicates: true,
  });

  revalidatePath("/", "layout");
  return { saved: true, message: `Saved to ${name} ✓` };
}

/**
 * Write an outfit from outside the UI.
 *
 * This is the entry point for the agent run that scores garments with
 * .claude/skills/aesthetic-fit and assembles them: it needs no session and no
 * browser, and it is idempotent on slug so the job is safe to repeat. The
 * validation lives in prisma/outfits.ts so the seed goes through the same door.
 */
export async function createOutfit(input: OutfitInput) {
  const result = await upsertOutfit(prisma, { source: "AGENT", ...input });
  revalidatePath("/", "layout");
  return result;
}
