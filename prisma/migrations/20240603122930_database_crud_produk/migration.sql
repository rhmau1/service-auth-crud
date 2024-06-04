-- CreateTable
CREATE TABLE `produk` (
    `produk_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `price` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,

    PRIMARY KEY (`produk_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
