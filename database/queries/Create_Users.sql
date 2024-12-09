-- database: ./main.db

CREATE TABLE Users(
    UserID INTEGER PRIMARY KEY,
    F_Name varchar(20) NOT NULL,
    L_Name varchar(20) NOT NULL,
    Email varchar(50) NOT NULL UNIQUE,
    Hashed_Password varchar(100) NOT NULL,
    Registration_Date datetime NOT NULL
);