/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "Balance" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Transfers" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "userid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "Transfers" ADD CONSTRAINT "Transfers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
