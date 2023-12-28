-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "board_id" TEXT NOT NULL DEFAULT 'cllbce8700001p2uz55qm59hj';

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
