import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@garatech.local";
  const password = "ChangeMoi123!";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      status: "ACTIF",
      nom: "Admin GaraTech",
    },
  });

  console.log("Compte Admin créé :", admin.email);
  console.log("Mot de passe :", password);
  console.log("⚠️ Change ce mot de passe dès ta première connexion.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());