DROP TABLE IF EXISTS Categories;

CREATE TABLE IF NOT EXISTS Categories (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    TotalBancs INTEGER NOT NULL,
    Url TEXT NOT NULL
);

DROP TABLE IF EXISTS Bancs;

CREATE TABLE IF NOT EXISTS Bancs (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Text TEXT NOT NULL,
  CategoryId INTEGER NOT NULL,
  FOREIGN KEY(CategoryId) REFERENCES Categories(Id)
);
