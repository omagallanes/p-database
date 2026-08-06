import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Passwords come from environment variables (never commit real credentials).
// The seed only creates/updates the two base accounts when run explicitly.
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD
const USER_PASSWORD = process.env.SEED_USER_PASSWORD

async function main() {
  if (!ADMIN_PASSWORD || !USER_PASSWORD) {
    throw new Error(
      "SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD must be set to run the seed."
    )
  }

  // ==============================
  // USERS ONLY - No seed data
  // ==============================
  
  // Admin user
  const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
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
  const userPassword = await bcrypt.hash(USER_PASSWORD, 10)
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
