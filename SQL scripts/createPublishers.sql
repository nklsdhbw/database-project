CREATE TABLE Publishers (
  publisherID SERIAL PRIMARY KEY,
  publisherName VARCHAR(255) NOT NULL,
  publisherAddress VARCHAR(255) NOT NULL,
  publisherEmail VARCHAR(255) NOT NULL,
  publisherPhone VARCHAR(20) NOT NULL
);
