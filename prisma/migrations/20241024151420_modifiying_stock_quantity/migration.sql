-- AlterTable
ALTER TABLE "stock_movements" ADD COLUMN     "entity" TEXT,
ADD COLUMN     "type" VARCHAR(50) NOT NULL DEFAULT 'default_type';
