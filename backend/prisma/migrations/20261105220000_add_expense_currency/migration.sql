-- Existing expense amounts were entered as dollars, so preserve their meaning.
ALTER TABLE "Expense" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';

-- New expenses default to yen, while existing rows remain USD.
ALTER TABLE "Expense" ALTER COLUMN "currency" SET DEFAULT 'JPY';
