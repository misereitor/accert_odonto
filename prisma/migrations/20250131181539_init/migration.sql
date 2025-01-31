-- DropIndex
DROP INDEX "posts_name_unique_key";

-- DropIndex
DROP INDEX "posts_path_key";

-- CreateTable
CREATE TABLE "logos" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "name_unique" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "logos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logos" ADD CONSTRAINT "logos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
