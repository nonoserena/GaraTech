import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/../auth";

const prisma = new PrismaClient();
const OFFICE_STAFF = ["ADMIN", "RECEPTIONNISTE", "MECANICIEN"];

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !OFFICE_STAFF.includes(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { marque, modele, immatriculation, vin, kilometrage } = await req.json();

  if (!marque || !modele || !immatriculation) {
    return NextResponse.json(
      { error: "Marque, modèle et immatriculation requis" },
      { status: 400 }
    );
  }

  const existing = await prisma.vehicle.findUnique({ where: { immatriculation } });
  if (existing) {
    return NextResponse.json(
      { error: "Cette immatriculation existe déjà" },
      { status: 409 }
    );
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      clientId: params.id,
      marque,
      modele,
      immatriculation,
      vin: vin || null,
      kilometrage: kilometrage ? parseInt(kilometrage) : null,
    },
  });

  return NextResponse.json(vehicle);
}