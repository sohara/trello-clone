/*
  Warnings:

  - Made the column `board_id` on table `cards` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "board_id" SET NOT NULL;
