import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const cards = await tx.card.findMany({ include: { list: true } });
    for (const card of cards) {
      await tx.card.update({
        where: { id: card.id },
        data: {
          boardId: card.list.boardId,
        },
      });
    }
  });
  console.log("Migration worked, it seems!");
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
