-- Active: 1727339273739@@127.0.0.1@3306@TASK_MANAGEMENT
CREATE DATABASE TASK_MANAGEMENT;

USE TASK_MANAGEMENT;

--TABLE CREATION
CREATE TABLE User (
    userId int NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'User') DEFAULT 'User',
    UNIQUE (username),
    UNIQUE (email),
    PRIMARY KEY (userId)
);

CREATE TABLE Task (
    taskId int NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    dueDate DATE DEFAULT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    createdBy int NOT NULL,
    updatedBy int DEFAULT NULL,
    assignedTo int DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (taskId),
    FOREIGN KEY (createdBy) REFERENCES User (userId) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES User (userId) ON DELETE SET NULL,
    FOREIGN KEY (updatedBy) REFERENCES User (userId) ON DELETE SET NULL
);

Create TABLE Comment (
    commentId INT NOT NULL AUTO_INCREMENT,
    taskId INT NOT NULL,
    userId INT NOT NULL,
    commentBody TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (commentId),
    FOREIGN KEY (taskId) REFERENCES Task (taskId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES User (userId) ON DELETE CASCADE
);

SELECT * from `User`;

SELECT * from `Task` ORDER BY priority


