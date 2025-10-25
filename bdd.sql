-- Créer la base
DROP DATABASE IF EXISTS job_board;
CREATE DATABASE job_board;
USE job_board;

-- Table users
CREATE TABLE user (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    phone BIGINT NOT NULL
) ENGINE=InnoDB;

-- Table companies
CREATE TABLE companies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industrie VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Table advertisements
CREATE TABLE advertisements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    compagnie_id BIGINT UNSIGNED NOT NULL,
    recruter_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary_range VARCHAR(255) NOT NULL,
    published_date DATE NOT NULL,
    CONSTRAINT fk_ad_compagnie FOREIGN KEY (compagnie_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ad_recruter FOREIGN KEY (recruter_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Table candidatures
CREATE TABLE candidatures (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ad_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    applied_date DATE NOT NULL,
    statut VARCHAR(255) NOT NULL,
    last_email_sent VARCHAR(255) NOT NULL,
    notes VARCHAR(255) NOT NULL,
    CONSTRAINT fk_cand_ad FOREIGN KEY (ad_id) REFERENCES advertisements(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_cand_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
