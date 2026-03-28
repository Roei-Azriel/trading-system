-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Currency') THEN
        CREATE TYPE "Currency" AS ENUM ('USDT', 'BTC', 'ETH');
    END IF;
END $$;

-- AlterTable
ALTER TABLE "WalletBalance"
ALTER COLUMN "currency" TYPE "Currency"
USING ("currency"::text::"Currency");
