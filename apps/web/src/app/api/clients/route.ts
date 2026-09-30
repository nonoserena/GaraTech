import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/../auth";

const prisma = new PrismaClient();
const OFFICE_STAFF = ["ADMIN", "RECEPTIONNISTE", "MECANICIEN"];

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicles: true },
  });

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !OFFICE_STAFF.includes(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { nom, telephone, email, type } = await req.json();

  if (!nom || !telephone) {
    return NextResponse.json({ error: "Nom et téléphone requis" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: { nom, telephone, email: email || null, type: type || "PARTICULIER" },
  });

  return NextResponse.json(client);
}