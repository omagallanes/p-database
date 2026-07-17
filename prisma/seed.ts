import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // ==============================
  // USERS ONLY - No seed data
  // ==============================
  
  // Admin user
  const adminPassword = await bcrypt.hash("G4VK2F56FTS96YDG", 10)
  const admin = await prisma.user.upsert({
    where: { email: "server@paginaviva.net" },
    update: {
      password: adminPassword,
      role: "admin",
    },
    create: {
      email: "server@paginaviva.net",
      name: "Administrador",
      password: adminPassword,
      role: "admin",
      emailVerified: new Date(),
      promptListViewPreference: "cards",
    },
  })

  // Additional user
  const userPassword = await bcrypt.hash("281116pDB", 10)
  const user = await prisma.user.upsert({
    where: { email: "chamed@paginaviva.net" },
    update: {
      password: userPassword,
      role: "user",
    },
    create: {
      email: "chamed@paginaviva.net",
      name: "Usuario",
      password: userPassword,
      role: "user",
      emailVerified: new Date(),
      promptListViewPreference: "cards",
    },
  })

  console.log("✅ Users created/updated:", { admin: admin.id, user: user.id })
  console.log("✅ Seed data completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
