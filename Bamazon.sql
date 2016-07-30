CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products (
	id INT NOT NULL AUTO_INCREMENT,
    ProductName VARCHAR(100) NULL,
    DepartmentName VARCHAR(100) NULL,
    Price DECIMAL(10,4) NULL,
    StockQuantity INT NULL,
    PRIMARY KEY (id)
);

SELECT * FROM Products;