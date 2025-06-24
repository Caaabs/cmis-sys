-- CreateTable
CREATE TABLE "CanteenReport" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    "month" SMALLINT NOT NULL,

    CONSTRAINT "CanteenReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanteenReportItem" (
    "id" UUID NOT NULL,
    "itemCategory" VARCHAR(30) NOT NULL,
    "itemCost" MONEY NOT NULL,
    "itemDescription" VARCHAR(50) NOT NULL,
    "canteenReportId" UUID NOT NULL,

    CONSTRAINT "CanteenReportItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CanteenReportItem" ADD CONSTRAINT "CanteenReportItem_canteenReportId_fkey" FOREIGN KEY ("canteenReportId") REFERENCES "CanteenReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
