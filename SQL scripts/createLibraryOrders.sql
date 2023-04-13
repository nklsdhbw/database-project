CREATE TABLE "LibraryOrders" (
    "libraryOrderID" SERIAL PRIMARY KEY,
    "libraryOrderBookTitle" VARCHAR(255),
    "libraryOrderAuthor" VARCHAR(255),
    "libraryOrderAuthorID" INTEGER,
    "libraryOrderISBN" VARCHAR(255),
    "libraryOrderPublisher" VARCHAR(255),
    "libraryOrderDateOrdered" DATE,
    "libraryOrderDeliveryDate" DATE,
    "libraryOrderCost" NUMERIC(10, 2),
    "libraryOrderAmount" INTEGER,
    "libraryOrderStatus" VARCHAR(255)
);
