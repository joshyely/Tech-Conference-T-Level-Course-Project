-- SQLite


ALTER TABLE Users
ADD COLUMN isDisabled Boolean NOT NULL DEFAULT False;