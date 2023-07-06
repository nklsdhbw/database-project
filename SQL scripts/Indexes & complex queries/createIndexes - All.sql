-- Drop the existing index
DROP INDEX IF EXISTS "idx_Categories_categoryName";

-- Create the new index
CREATE INDEX "idx_Categories_categoryName" ON "Categories" ("categoryName");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Authors_authorFirstName";

-- Create the new index
CREATE INDEX "idx_Authors_authorFirstName" ON "Authors" ("authorFirstName");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Authors_authorLastName";

-- Create the new index
CREATE INDEX "idx_Authors_authorLastName" ON "Authors" ("authorLastName");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Publishers_publisherName";

-- Create the new index
CREATE INDEX "idx_Publishers_publisherName" ON "Publishers" ("publisherName");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Books_bookAvailability";

-- Create the new index
CREATE INDEX "idx_Books_bookAvailability" ON "Books" ("bookAvailability");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Books_bookISBN";

-- Create the new index
CREATE INDEX "idx_Books_bookISBN" ON "Books" ("bookISBN");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Loans_loanOverdue";

-- Create the new index
CREATE INDEX "idx_Loans_loanOverdue" ON "Loans" ("loanOverdue");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Loans_loanStatus";

-- Create the new index
CREATE INDEX "idx_Loans_loanStatus" ON "Loans" ("loanStatus");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Loans_loanFine";

-- Create the new index
CREATE INDEX "idx_Loans_loanFine" ON "Loans" ("loanFine");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Readers_readerEmail";

-- Create the new index
CREATE INDEX "idx_Readers_readerEmail" ON "Readers" ("readerEmail");

-- Drop the existing index
DROP INDEX IF EXISTS "idx_Librarians_librarianEmail";

-- Create the new index
CREATE INDEX "idx_Librarians_librarianEmail" ON "Librarians" ("librarianEmail");