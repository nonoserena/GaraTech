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

  const { kilometrageEntree } = await req.json();

  const repairOrder = await prisma.repairOrder.create({
    data: {
      vehicleId: params.id,
      kilometrageEntree: kilometrageEntree ? parseInt(kilometrageEntree) : null,
      status: "RECEPTION",
    },
  });

  return NextResponse.json(repairOrder);
}