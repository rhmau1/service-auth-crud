/*
  Warnings:

  - The primary key for the `produk` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `produk` DROP PRIMARY KEY,
    ADD COLUMN `created_at` DATETIME NOT NULL DEFAULT NOW(),
    ADD COLUMN `deleted_at` DATETIME NULL,
    ADD COLUMN `updated_at` DATETIME NULL,
    MODIFY `produk_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`produk_id`);
