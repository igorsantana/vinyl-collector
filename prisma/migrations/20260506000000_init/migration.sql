-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" TEXT,
    "genre" TEXT,
    "label" TEXT,
    "catalogNumber" TEXT,
    "condition" TEXT NOT NULL DEFAULT 'Not Graded',
    "coverCondition" TEXT NOT NULL DEFAULT 'Not Graded',
    "format" TEXT NOT NULL DEFAULT 'LP',
    "color" TEXT,
    "notes" TEXT,
    "imageUrl" TEXT,
    "confidence" DOUBLE PRECISION,
    "aiRawResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsage" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ApiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiUsage_date_key" ON "ApiUsage"("date");
