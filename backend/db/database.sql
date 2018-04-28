DROP DATABASE IF EXISTS database;
CREATE DATABASE database;

\c database

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  email VARCHAR,
  fullname VARCHAR,
  location VARCHAR,
  user_img VARCHAR);

CREATE TABLE concepts(
  concept_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  concept_name VARCHAR,
  description VARCHAR,
  platform VARCHAR,
  is_remote BOOLEAN,
  location VARCHAR,
  concept_timestamp timestamp not null default CURRENT_TIMESTAMP);

CREATE TABLE user_skills(
  user_skill_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  user_skill VARCHAR);

CREATE TABLE concept_skills(
    concept_skill_id SERIAL PRIMARY KEY,
    concept_id INTEGER REFERENCES concepts,
    concept_skill VARCHAR);

CREATE TABLE likes(
  like_id SERIAL PRIMARY KEY,
  concept_id INTEGER REFERENCES concepts,
  seen BOOLEAN,
  user_id INTEGER REFERENCES users);

CREATE TABLE teams(
  team_id SERIAL PRIMARY KEY,
  concept_id INTEGER REFERENCES concepts,
  user_id INTEGER REFERENCES users);

CREATE TABLE questionnary(
  question_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users,
  question_1 INTEGER,
  question_2 INTEGER,
  question_3 INTEGER,
  question_4 INTEGER,
  question_5 INTEGER,
  question_6 INTEGER,
  question_7 INTEGER,
  question_8 INTEGER,
  question_9 INTEGER,
  question_10 INTEGER,
  question_11 INTEGER,
  question_12 INTEGER,
  question_13 INTEGER,
  question_14 INTEGER,
  question_15 INTEGER,
  question_16 INTEGER,
  question_17 INTEGER);

CREATE TABLE comments(
  comment_id SERIAL PRIMARY KEY,
  concept_id INTEGER REFERENCES concepts,
  user_id INTEGER REFERENCES users,
  comment VARCHAR,
  seen BOOLEAN,
  comment_timestamp timestamp not null default CURRENT_TIMESTAMP);

INSERT INTO users (username, password, email, fullname, location)
  VALUES ('inomboy1', 'inomboy2', 'inomboy@ya.com', 'Inom Ibragimov', 'Jersey City, NJ'),
  ('azamat', 'azamat', 'azamat@ya.com', 'Azamat Ibragimov', 'Newport, NJ, 07310'),
  ('umed', 'umed', 'umed', 'Umed Ibrohimov', 'Navoi, TJ'),
  ('husanboy', 'husanboy', 'husanboy@ya.com', 'Khusanboy Ibrohimov', 'Sommerset NJ'),
  ('rashid', 'rashid', 'rashid@ya.com', 'Rashidbek Sadriddionov', 'Zafara, TJ');

INSERT INTO concepts (user_id, concept_name, description, platform, is_remote, location)
  VALUES (1, 'AddApp', 'lets build an app where it will show only adds ', 'mobile app', true, 'Jersey City, NJ'),
  (4, 'something', 'something', 'web app will do something i am sure but nobody knows what it will do and when', false, 'Sommerset, NJ'),
  (5, 'designer', 'lets create a library where make our implement it.', 'software', true, 'Zafara, TJ');

INSERT INTO likes (concept_id, seen, user_id)
VALUES (1, false, 2), (1, false, 3), (1, false, 4), (1, false, 5),
(2, false, 1), (2, false, 2), (3, false, 3);

INSERT INTO user_skills (user_id, user_skill)
VALUES (1, 'JS'), (1, 'HTML'), (1, 'CSS'), (2, 'PUMP'), (4, 'JS'), (4, 'JQUERY'), (4, 'HTML'), (4, 'MYSQL'),
(5, 'DESIGN'), (5, 'PHOTOSHOP'), (5, 'ADOBE'), (5, 'ILLUSTRATOR');

INSERT INTO concept_skills (concept_id, concept_skill)
VALUES (1, 'android'), (1, 'java'), (1, 'CSS'), (1, 'XML'), (2, 'JS'), (2, 'JQUERY'), (2, 'HTML'), (2, 'MYSQL'),
(3, 'DESIGN'), (3, 'PHOTOSHOP'), (3, 'ADOBE'), (3, 'ILLUSTRATOR'), (3, 'GraphQL'), (3, 'AWS APP Sync');
