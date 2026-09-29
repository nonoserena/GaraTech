import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/../auth";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { action } = await req.json();
  const status = action === "approve" ? "ACTIF" : "SUSPENDU";

  await prisma.user.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ success: true });
}