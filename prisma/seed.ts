import { PrismaClient, Prisma } from "../app/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Admin",
    email: "admin@admin.com",
    password: "$2y$10$FAyQBUavDFf2/e8g3lyyH.e0S9iQOqEY9r3cPEPRGs6Fuuyb4.Bla",
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}
main();
