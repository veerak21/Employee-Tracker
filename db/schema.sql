-- drops existing EmployeeTracker_db database--
DROP DATABASE IF EXISTS EmployeeTracker_db;

-- creates the EmployeeTracker_db database--
CREATE DATABASE EmployeeTracker_db;

-- Makes it so all of the following code will affect EmployeeTracker_db --
USE EmployeeTracker_db;

-- Creates the table "department" with in EmployeeTracker_db --
CREATE TABLE department (
    dept_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key
    dept_name VARCHAR(30) NOT NULL

);

-- Creates the table "role" with in EmployeeTracker_db --
CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    depart_id INT, -- foreign key it comes from department table
    CONSTRAINT fk_department FOREIGN KEY (depart_id) REFERENCES department(dept_id) ON DELETE CASCADE
    
);

-- Creates the table "employee" with in EmployeeTracker_db --
CREATE TABLE employee (
    emp_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    rolee_id INT NOT NULL, -- foreign key, it comes from role table
    manager_id INT NULL, -- foreign key, it comes from the same table employee emp_id 
    CONSTRAINT fk_role FOREIGN KEY (rolee_id) REFERENCES role(role_id) ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(emp_id) ON DELETE SET NULL

);