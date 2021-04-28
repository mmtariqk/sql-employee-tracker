INSERT INTO department (dept_name, utilized_budget)
VALUES ('Administration', 1000000),
       ('Therapy & HR', 75000),
       ('Debt Collection', 300000),
       ('Chiropractic & Firearms', 300000),
       ('Cafeteria & Catering', 50000),
       ('Credit & Lending', 400000);
       
INSERT INTO roles (title, salary, department_id)
VALUES ('Boss of Bosses', 1000000, 1),
       ('Therapist', 75000, 2),
       ('Collections Agent', 100000, 3),
       ('Negotiator', 150000, 4),
       ('Chef', 50000, 5),
       ('Loan Broker', 200000, 6);
	
INSERT INTO employee (first_name, nickname, last_name, emp_dept, salary, manager_id, roles_id)
VALUES ('Anthony', 'The Boss', 'Soprano', 'Administration', 1000000, null, 1),
       ('Jennifer', Null, 'Melfi', 'Therapy & HR', 75000, 1, 2),
       ('Christopher', 'The Nephew', 'Moltisanti', 'Debt Collection', 100000, null, 3),
       ('Peter', 'Paulie Walnuts', 'Gualtieri', 'Debt Collection', 100000, 3, 3),
       ('Patsy', Null, 'Parisi', 'Debt Collection', 100000, 3, 3),
       ('Furio', 'The Enforcer', 'Giunta', 'Chiropractic & Firearms', 100000, null, 4),
       ('Anthony', 'Lil Tony','Blundetto', 'Chiropractic & Firearms', 100000, 6, 4),
       ('Vito', Null, 'Spatafore', 'Chiropractic & Firearms', 100000, 6, 4),
       ('Ralph', 'Ralphie', 'Cifaretto', 'Credit & Lending', 200000, 1, 6),
       ('Arthur', 'Artie the Chef', 'Bucco', 'Cafeteria & Catering', 50000, 1, 5);

INSERT INTO manager (id, mgr_name)
VALUES (1, 'Anthony Soprano'),
       (3, 'Christopher Moltisanti'),
       (6, 'Furio Giunta');

SELECT * FROM employee;
SELECT * FROM roles;
SELECT * FROM department;
SELECT * FROM manager;       