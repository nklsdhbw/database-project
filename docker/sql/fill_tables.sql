INSERT INTO
    "Authors" (
        "authorFirstName",
        "authorLastName",
        "authorEmail",
        "authorPhone"
    )
VALUES
    ('John', 'Doe', 'johndoe@example.com', '555-1234'),
    ('Jane', 'Doe', 'janedoe@example.com', '555-5678'),
    (
        'Bob',
        'Smith',
        'bobsmith@example.com',
        '555-4321'
    ),
    (
        'Alice',
        'Johnson',
        'alicejohnson@example.com',
        '555-8765'
    ),
    (
        'Sarah',
        'Williams',
        'sarahwilliams@example.com',
        '555-2345'
    ),
    (
        'David',
        'Brown',
        'davidbrown@example.com',
        '555-6789'
    ),
    (
        'Emily',
        'Davis',
        'emilydavis@example.com',
        '555-3456'
    ),
    (
        'Michael',
        'Lee',
        'michaellee@example.com',
        '555-7890'
    ),
    (
        'Amy',
        'Taylor',
        'amytaylor@example.com',
        '555-4567'
    ),
    (
        'Steven',
        'Jones',
        'stevenjones@example.com',
        '555-9012'
    );

INSERT INTO
    "Readers" (
        "readerFirstName",
        "readerLastName",
        "readerEmail",
        "readerPassword"
    )
VALUES
    (
        'John',
        'Doe',
        'johndoe@gmail.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Jane',
        'Smith',
        'janesmith@yahoo.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Mark',
        'Johnson',
        'markjohnson@hotmail.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Mary',
        'Williams',
        'marywilliams@gmail.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'David',
        'Brown',
        'davidbrown@yahoo.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Sarah',
        'Jones',
        'sarahjones@hotmail.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Alex',
        'Lee',
        'alexlee@gmail.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Linda',
        'Davis',
        'lindadavis@yahoo.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Brian',
        'Wilson',
        'brianwilson@hotmail.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Emily',
        'Taylor',
        'emilytaylor@gmail.com',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    );

INSERT INTO
    "ZIPs" ("zipCode", "zipCity")
VALUES
    (1000, 'Brussels'),
    (2000, 'Antwerp'),
    (3000, 'Leuven'),
    (4000, 'Liege'),
    (5000, 'Namur'),
    (6000, 'Charleroi'),
    (7000, 'Mons'),
    (8000, 'Bruges'),
    (9000, 'Ghent'),
    (10000, 'Paris');

INSERT INTO
    "Categories" ("categoryName", "categoryDescription")
VALUES
    (
        'Fiction',
        'Works of the imagination, especially novels and short stories'
    ),
    (
        'Non-fiction',
        'Works based on fact rather than imagination'
    ),
    (
        'Biography',
        'An account of someone''s life written by someone else'
    ),
    (
        'History',
        'The study of past events, particularly in human affairs'
    ),
    (
        'Memoir',
        'An autobiography or a written account of one''s memory of certain events or people'
    ),
    (
        'Science Fiction',
        'Fiction based on imagined future scientific or technological advances and major social or environmental changes'
    ),
    (
        'Self-help',
        'A genre of literature that is focused on personal improvement, self-healing, and self-actualization'
    ),
    (
        'Travel',
        'Books that involve travel to different parts of the world'
    ),
    (
        'Cooking',
        'Books that contain recipes, cooking techniques, and tips for cooking'
    ),
    (
        'Poetry',
        'Literary work that expresses the writer''s feelings or ideas in a unique style'
    );

INSERT INTO
    "Currencies" ("currencyName", "currencyCode")
VALUES
    ('US Dollar', 'USD'),
    ('Euro', 'EUR'),
    ('Japanese yen', 'JPY'),
    ('British pound', 'GBP'),
    ('Swiss franc', 'CHF'),
    ('Canadian dollar', 'CAD'),
    ('Australian dollar', 'AUD'),
    ('New Zealand dollar', 'NZD'),
    ('Swedish krona', 'SEK'),
    ('Norwegian krone', 'NOK');

INSERT INTO
    "Librarians" (
        "librarianFirstName",
        "librarianLastName",
        "librarianEmail",
        "librarianPhone",
        "librarianBirthDate",
        "librarianPassword"
    )
VALUES
    (
        'John',
        'Doe',
        'johndoe@example.com',
        '1234567890',
        '1990-01-01',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Jane',
        'Doe',
        'janedoe@example.com',
        '1234567891',
        '1991-02-02',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Bob',
        'Smith',
        'bobsmith@example.com',
        '1234567892',
        '1992-03-03',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Alice',
        'Smith',
        'alicesmith@example.com',
        '1234567893',
        '1993-04-04',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Mark',
        'Johnson',
        'markjohnson@example.com',
        '1234567894',
        '1994-05-05',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Mary',
        'Johnson',
        'maryjohnson@example.com',
        '1234567895',
        '1995-06-06',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Tom',
        'Wilson',
        'tomwilson@example.com',
        '1234567896',
        '1996-07-07',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Emily',
        'Wilson',
        'emilywilson@example.com',
        '1234567897',
        '1997-08-08',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'David',
        'Brown',
        'davidbrown@example.com',
        '1234567898',
        '1998-09-09',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    ),
    (
        'Sarah',
        'Brown',
        'sarahbrown@example.com',
        '1234567899',
        '1999-10-10',
        '$2a$10$OUiLkXa96FDoTlAqazvgIe4oXO8TAgX0shZ/LcqfgmxV7LrM6J8mS'
    );

INSERT INTO
    "Publishers" (
        "publisherName",
        "publisherZipID",
        "publisherStreetName",
        "publisherHouseNumber",
        "publisherCountry",
        "publisherEmail",
        "publisherPhone"
    )
VALUES
    (
        'Penguin Books',
        1,
        'Euston Road',
        '80',
        'United Kingdom',
        'contact@penguin.co.uk',
        '+44 (0) 20 7255 1000'
    ),
    (
        'HarperCollins Publishers',
        2,
        'The News Building',
        '1 London Bridge Street',
        'United Kingdom',
        'contact@harpercollins.co.uk',
        '+44 (0) 207 010 7000'
    ),
    (
        'Random House',
        3,
        '20 Vauxhall Bridge Road',
        'London',
        'United Kingdom',
        'contact@randomhouse.co.uk',
        '+44 (0) 20 7840 8400'
    ),
    (
        'Macmillan Publishers',
        4,
        '20 New Wharf Road',
        'London',
        'United Kingdom',
        'contact@macmillan.co.uk',
        '+44 (0) 20 7014 6000'
    ),
    (
        'Oxford University Press',
        5,
        'Great Clarendon Street',
        'Oxford',
        'United Kingdom',
        'contact@oup.com',
        '+44 (0)1865 353 000'
    ),
    (
        'Cambridge University Press',
        6,
        'University Printing House',
        'Shaftesbury Road',
        'United Kingdom',
        'information@cambridge.org',
        '+44 (0)1223 358331'
    ),
    (
        'Bloomsbury Publishing',
        7,
        '50 Bedford Square',
        '',
        'United Kingdom',
        'enquiries@bloomsbury.com',
        '+44 (0)20 7631 5600'
    ),
    (
        'Hachette UK',
        8,
        'Carmelite House',
        '50 Victoria Embankment',
        'United Kingdom',
        'contact@hachette.co.uk',
        '+44 (0) 20 3122 6000'
    ),
    (
        'Scholastic Corporation',
        9,
        '557 Broadway',
        '',
        'United States',
        'corporateaffairs@scholastic.com',
        '+1-212-343-6100'
    ),
    (
        'Pearson plc',
        10,
        '80 Strand',
        '',
        'United Kingdom',
        'enquiries@pearson.com',
        '+44 (0)20 7010 2000'
    );

INSERT INTO
    "Books" (
        "bookAmount",
        "bookTitle",
        "bookAuthorID",
        "bookISBN",
        "bookPublisherID",
        "bookPublicationDate",
        "bookAvailability",
        "bookAvailableAmount",
        "bookCategoryID"
    )
VALUES
    (
        10,
        'The Great Gatsby',
        1,
        '9780007368655',
        1,
        '1925-04-10',
        true,
        9,
        1
    ),
    (
        5,
        'To Kill a Mockingbird',
        2,
        '9780061120084',
        2,
        '1960-07-11',
        true,
        4,
        2
    ),
    (
        15,
        '1984',
        3,
        '9780451524935',
        3,
        '1949-06-08',
        true,
        14,
        3
    ),
    (
        8,
        'Pride and Prejudice',
        4,
        '9780141439518',
        4,
        '1813-01-28',
        true,
        7,
        4
    ),
    (
        12,
        'Brave New World',
        5,
        '9780060850524',
        5,
        '1932-01-01',
        true,
        11,
        3
    ),
    (
        20,
        'Harry Potter and the Philosophers Stone',
        6,
        '9780747532743',
        6,
        '1997-06-26',
        true,
        19,
        5
    ),
    (
        6,
        'The Catcher in the Rye',
        7,
        '9780316769174',
        7,
        '1951-07-16',
        true,
        5,
        2
    ),
    (
        9,
        'Lord of the Flies',
        8,
        '9780399501487',
        8,
        '1954-09-17',
        true,
        8,
        3
    ),
    (
        11,
        'Ich bin dann mal Kult',
        9,
        '9780399541187',
        9,
        '1937-09-21',
        true,
        10,
        5
    ),
    (
        11,
        'The Hobbit',
        9,
        '9780547928227',
        9,
        '1937-09-21',
        true,
        10,
        5
    ),
    (
        14,
        'The Hunger Games',
        10,
        '9780439023481',
        10,
        '2008-09-14',
        true,
        13,
        6
    ),
    (
        14,
        'Per Anhalter durch die Galaxis',
        10,
        '9783453146976',
        10,
        '2008-09-14',
        true,
        13,
        1
    ),
    (
        14,
        'The Escape Artist',
        10,
        '9783453146912',
        10,
        '2008-09-15',
        true,
        13,
        2
    ),
    (
        14,
        'Cristiano Ronaldo - Autobiography',
        10,
        '9783453146913',
        10,
        '2008-09-18',
        true,
        13,
        3
    ),
    (
        14,
        'Der 30-jährige Krieg',
        10,
        '9783453146914',
        10,
        '1999-09-14',
        true,
        13,
        4
    ),
    (
        14,
        'Albert Speer - 1939',
        10,
        '9783453146915',
        10,
        '2008-09-14',
        true,
        13,
        5
    ),
    (
        14,
        'Der Astronaut',
        10,
        '9783453146916',
        10,
        '2008-09-14',
        true,
        13,
        6
    ),
    (
        14,
        'Improve your time management',
        10,
        '9783453146917',
        10,
        '2008-09-14',
        true,
        13,
        7
    ),
    (
        14,
        'The most beautiful places in the world',
        10,
        '9783453146918',
        10,
        '2008-09-14',
        true,
        13,
        8
    ),
    (
        14,
        'The best german dishes',
        10,
        '9783453146919',
        10,
        '2008-09-14',
        true,
        13,
        9
    ),
    (
        14,
        'Der ewige Brunnen',
        10,
        '9783453146100',
        10,
        '2004-09-14',
        true,
        13,
        10
    );

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Teams" DEFAULT
VALUES;

INSERT INTO
    "Loans" (
        "loanBookID",
        "loanReaderID",
        "loanLoanDate",
        "loanDueDate",
        "loanReturnDate",
        "loanRenewals",
        "loanOverdue",
        "loanFine",
        "loanCurrencyID"
    )
VALUES
    (
        1,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        1,
        2,
        '2023-05-01',
        '2023-06-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        2,
        1,
        '2023-05-02',
        '2023-07-16',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        3,
        2,
        '2023-05-03',
        '2023-08-17',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        4,
        2,
        '2023-05-04',
        '2023-09-18',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        5,
        3,
        '2023-05-05',
        '2023-05-19',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        6,
        3,
        '2023-05-06',
        '2023-05-20',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        7,
        4,
        '2023-05-07',
        '2023-05-21',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        8,
        4,
        '2023-05-08',
        '2023-05-22',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        9,
        5,
        '2023-05-09',
        '2023-05-23',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        10,
        5,
        '2023-05-10',
        '2023-05-24',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        1,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        2,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        3,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        4,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        5,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        6,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        7,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        8,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        9,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    ),
    (
        21,
        1,
        '2023-05-01',
        '2023-05-15',
        NULL,
        0,
        false,
        0.0,
        1
    );

INSERT INTO
    "Managers" ("managerLibrarianID", "managerTeamID")
VALUES
    (1, 1);

INSERT INTO
    "Managers" ("managerLibrarianID", "managerTeamID")
VALUES
    (2, 1);

INSERT INTO
    "Managers" ("managerLibrarianID", "managerTeamID")
VALUES
    (3, 1);

INSERT INTO
    "Managers" ("managerLibrarianID", "managerTeamID")
VALUES
    (4, 1);

INSERT INTO
    "Managers" ("managerLibrarianID", "managerTeamID")
VALUES
    (5, 2);

INSERT INTO
    "Managers" ("managerLibrarianID", "managerTeamID")
VALUES
    (6, 2);

--INSERT INTO "Managers" ("managerLibrarianID", "managerTeamID") VALUES (7, 3);
--INSERT INTO "Managers" ("managerLibrarianID", "managerTeamID") VALUES (8, 4);
--INSERT INTO "Managers" ("managerLibrarianID", "managerTeamID") VALUES (9, 5);
--INSERT INTO "Managers" ("managerLibrarianID", "managerTeamID") VALUES (10, 6);
INSERT INTO
    "LibraryOrders" (
        "libraryOrderCost",
        "libraryOrderDeliveryDate",
        "libraryOrderAmount",
        "libraryOrderDateOrdered",
        "libraryOrderPublisherID",
        "libraryOrderBookTitle",
        "libraryOrderISBN",
        "libraryOrderAuthorID",
        "libraryOrderStatusOrder",
        "libraryOrderManagerLibrarianID",
        "libraryOrderCurrencyID"
    )
VALUES
    (
        24.99,
        '2023-05-05',
        10,
        '2023-04-30',
        1,
        'The Great Gatsby',
        '978-1-718-26007-0',
        1,
        'order',
        1,
        1
    );

INSERT INTO
    "LibraryOrders" (
        "libraryOrderCost",
        "libraryOrderDeliveryDate",
        "libraryOrderAmount",
        "libraryOrderDateOrdered",
        "libraryOrderPublisherID",
        "libraryOrderBookTitle",
        "libraryOrderISBN",
        "libraryOrderAuthorID",
        "libraryOrderStatusOrder",
        "libraryOrderManagerLibrarianID",
        "libraryOrderCurrencyID"
    )
VALUES
    (
        12.50,
        '2023-05-10',
        5,
        '2023-04-30',
        2,
        'To Kill a Mockingbird',
        '978-0-446-31078-9',
        2,
        'order',
        2,
        2
    );

INSERT INTO
    "LibraryOrders" (
        "libraryOrderCost",
        "libraryOrderDeliveryDate",
        "libraryOrderAmount",
        "libraryOrderDateOrdered",
        "libraryOrderPublisherID",
        "libraryOrderBookTitle",
        "libraryOrderISBN",
        "libraryOrderAuthorID",
        "libraryOrderStatusOrder",
        "libraryOrderManagerLibrarianID",
        "libraryOrderCurrencyID"
    )
VALUES
    (
        19.99,
        '2023-05-12',
        8,
        '2023-04-30',
        3,
        'Pride and Prejudice',
        '978-1-60309-087-7',
        3,
        'order',
        3,
        1
    );

INSERT INTO
    "LibraryOrders" (
        "libraryOrderCost",
        "libraryOrderDeliveryDate",
        "libraryOrderAmount",
        "libraryOrderDateOrdered",
        "libraryOrderPublisherID",
        "libraryOrderBookTitle",
        "libraryOrderISBN",
        "libraryOrderAuthorID",
        "libraryOrderStatusOrder",
        "libraryOrderManagerLibrarianID",
        "libraryOrderCurrencyID"
    )
VALUES
    (
        35.00,
        '2023-05-15',
        6,
        '2023-04-30',
        4,
        'The Catcher in the Rye',
        '978-0-316-76953-6',
        4,
        'order',
        4,
        2
    );

INSERT INTO
    "LibraryOrders" (
        "libraryOrderCost",
        "libraryOrderDeliveryDate",
        "libraryOrderAmount",
        "libraryOrderDateOrdered",
        "libraryOrderPublisherID",
        "libraryOrderBookTitle",
        "libraryOrderISBN",
        "libraryOrderAuthorID",
        "libraryOrderStatusOrder",
        "libraryOrderManagerLibrarianID",
        "libraryOrderCurrencyID"
    )
VALUES
    (
        29.99,
        '2023-05-20',
        3,
        '2023-04-30',
        5,
        '1984',
        '978-0-14-118776-1',
        5,
        'order',
        5,
        1
    );

INSERT INTO
    "Employees" ("employeeLibrarianID", "employeeTeamID")
VALUES
    (7, 1);

INSERT INTO
    "Employees" ("employeeLibrarianID", "employeeTeamID")
VALUES
    (8, 1);

INSERT INTO
    "Employees" ("employeeLibrarianID", "employeeTeamID")
VALUES
    (9, 2);

INSERT INTO
    "Employees" ("employeeLibrarianID", "employeeTeamID")
VALUES
    (10, 2);