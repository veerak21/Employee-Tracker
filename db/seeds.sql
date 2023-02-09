-- Insert multiple department names --
INSERT INTO department (dept_name)
VALUES ('Sales'),
       ('HR'),
       ('Programming'),
       ('IT'),
       ('Executive');

-- adding the multiple values to the table role
INSERT INTO role (title,salary,depart_id)
VALUES ('Account Executive', 100000, 1),
       ('Sr. Account Executive', 150000, 1),
       ('Sales Director', 200000, 1),
       ('HR Coordinator', 75000, 2),
       ('HR Generalist', 85000, 2),
       ('HR Director', 100000, 2),
       ('Jr. Developer', 85000, 3),
       ('Sr. Developer', 125000, 3),
       ('Programming Director', 225000, 3),
       ('IT Project Manager', 850000, 4),
       ('IT Project Director', 100000, 4),
       ('Chief Executive Officer', 300000, 5),
       ('Chief Operating Officer', 275000, 5),
       ('Chief Financial Officer', 275000, 5);

-- adding the multiple values to the table employee
INSERT INTO employee (first_name, last_name, rolee_id, manager_id)
VALUES ('Dottie', 'Brown', 12, NULL),
       ('Carol', 'Houlihan', 13, 1),
       ('Thomas', 'Romper', 14, 1),
       ('Dale', 'Robson', 3, 2),
       ('William', 'Louie', 9, 2),
       ('Carl', 'Cliffbeard', 11, 2),
       ('Veera', 'Pagadala', 6, 2),
       ('Bob', 'Johnson', 1, 4),
       ('Frank', 'Dodson', 1, 4),
       ('Jim', 'Bobson', 2, 4),
       ('Frankie', 'Codson', 4, 7),
       ('Bill', 'Brewer', 5, 7),
       ('Dom', 'Chewer', 5, 7),
       ('Mary', 'Bronson', 7, 5),
       ('Sarah', 'Robbie', 8, 5),
       ('Jeb', 'Johnnygriff', 10, 6),
       ('Barton', 'Heathcliffscruff', 10, 6);