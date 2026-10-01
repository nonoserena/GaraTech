import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/../auth";

const prisma = new PrismaClient();
const OFFICE_STAFF = ["ADMIN", "RECEPTIONNISTE", "MECANICIEN"];

// Transitions autorisées : de quel statut vers quels statuts suivants
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  RECEPTION: ["DIAGNOSTIC"],
  DIAGNOSTIC: ["DEVIS_EN_ATTENTE"],
  DEVIS_EN_ATTENTE: ["EN_REPARATION", "DEVIS_REFUSE"],
  DEVIS_REFUSE: ["CLOTURE_SANS_REPARATION"],
  EN_REPARATION: ["EN_PAUSE_AVENANT", "CONTROLE_QUALITE"],
  EN_PAUSE_AVENANT: ["EN_REPARATION"],
  CONTROLE_QUALITE: ["PRET", "EN_REPARATION"],
  PRET: ["FACTURE"],
  FACTURE: ["SORTI"],
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const order = await prisma.repairOrder.findUnique({
    where: { id: params.id },
    include: { vehicle: { include: { client: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !OFFICE_STAFF.includes(session.user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { status: newStatus } = await req.json();

  const order = await prisma.repairOrder.findUnique({ where: { id: params.id } });
  if (!order) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const allowed = ALLOWED_TRANSITIONS[order.status] || [];
  if (!allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Transition de ${order.status} vers ${newStatus} non autorisée` },
      { status: 400 }
    );
  }

  const isClosing = newStatus === "SORTI" || newStatus === "CLOTURE_SANS_REPARATION";

  const updated = await prisma.repairOrder.update({
    where: { id: params.id },
    data: {
      status: newStatus,
      ...(isClosing ? { closedAt: new Date() } : {}),
    },
  });

  return NextResponse.json(updated);
}