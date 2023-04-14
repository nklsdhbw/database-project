DROP TABLE IF EXISTS "LibraryOrders";

CREATE TABLE "LibraryOrders" (
"libraryOrderID" SERIAL PRIMARY KEY,
"libraryOrderCost" DECIMAL,
"libraryOrderDeliveryDate" DATE,
"libraryOrderAmount" INTEGER,
"libraryOrderDateOrdered" DATE,
"libraryOrderPublisherID" INTEGER,
"libraryOrderBookTitle" varchar(255),
"libraryOrderISBN" varchar(255),
"libraryOrderAuthorID" INTEGER,
"libraryOrderStatusOrder" varchar(255),
"libraryOrderManagerID" INTEGER, 

	CONSTRAINT fk_libraryOrderPublisherID
      FOREIGN KEY("libraryOrderPublisherID") 
	  REFERENCES "Publishers"("publisherID")
	  ON DELETE CASCADE,

    CONSTRAINT fk_libraryOrderAuthorID
      FOREIGN KEY("libraryOrderAuthorID") 
	  REFERENCES "Authors"("authorID")
	  ON DELETE CASCADE,
      
    CONSTRAINT fk_libraryOrderManagerID
      FOREIGN KEY("libraryOrderManagerID") 
	  REFERENCES "Managers"("managerID")
	  ON DELETE CASCADE

)
