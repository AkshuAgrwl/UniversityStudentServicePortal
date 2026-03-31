-- CreateIndex
CREATE FULLTEXT INDEX `User_name_idx` ON `User`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE FULLTEXT INDEX `User_name_email_idx` ON `User`(`name`, `email`);
