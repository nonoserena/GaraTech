import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ALLOWED_ROLES = ["RECEPTIONNISTE", "MECANICIEN", "DEPANNEUR"];

export async function POST(req: NextRequest) {
  const { nom, email, password, role } = await req.json();

  if (!nom || !email || !password || !role) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rôle non autorisé" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      nom,
      email,
      passwordHash,
      role,
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true });
}