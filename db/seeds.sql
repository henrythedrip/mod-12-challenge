INSERT INTO departments (department_name)
VALUES ("executive"), 
       ("accounting"),       
       ("hr"), 
       ("engineering"), 
       ("marketing"), 
       ("facilities"), 
       ("creative"), 
       ("sales");

-- we should also use department_id, and because its sequential we can just shotgun through it and be careful to keep things in the correct order
INSERT INTO roles (role_title, role_salary, department_id)
VALUES ("Bossman", 500000, 1),
       ("Accountant", 100000, 2),
       ("HR", 20000, 3),
       ("Engineer", 30000, 4),
       ("Marketer", 40000, 5),
       ("Janitor", 60000, 6),
       ("Creative", 70000, 7),
       ("Sales", 80000, 8);


INSERT INTO employees (first_name, last_name, employee_roles, manager_id)
VALUES ("Mr", "Manager", 1, null),
       ("Joe", "Schmo", 2, 1),
       ("Smart", "Guy", 3, 2),
       ("Billy", "Bob", 4, 1),
       ("Bobby", "Bill", 5, 4),
       ("Sally", "Silly", 6, 2),
       ("Jay", "Tee", 7, 3),
       ("Drip", "Henry", 8, 1);

