-- recreate the database for fresh testing and use
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

-- allows us to use the specific database
USE company_db;

-- creates the department table
CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

-- creates the role table
CREATE TABLE roles (
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30) NOT NULL,
  role_salary INT NOT NULL,

  -- foreign key used from department table
  department_id INT,
  FOREIGN KEY (department_id) 
  REFERENCES departments(department_id)
);

-- employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
CREATE TABLE employees (
  employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  
  -- these need to reference the appropriate roles
  employee_roles INT NOT NULL,
  FOREIGN KEY (employee_roles)
  REFERENCES roles(role_id),

  -- handle manager references
  manager_id INT,
  FOREIGN KEY (manager_id)
  REFERENCES employees(employee_id)
);
