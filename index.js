const inquirer = require('inquirer');
const mySql2 = require('mysql2');

// Create a connection to the database
const connection = mySql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'JGT88guitar!poetry',
  database: 'company_db',
});

// Connect to the database
connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

const questions = [
    {
        type: "list",
        name: "main",
        message: "choose one of the following",
        choices: [
          {
            name: "view all departments",
            value: "VIEW_ALL_DEPARTMENTS",
            short: "all depts"
          },
          {
            name: "view all roles",
            value: "VIEW_ALL_ROLES",
            short: "all roles"
          },
          {
            name: "view all employees",
            value: "VIEW_ALL_EMPLOYEES",
            short: "all employees"
          },
          {
            name: "add a department",
            value: "ADD_A_DEPARTMENT",
            short: "add department",
          },
          {
            name: "add a role",
            value: "ADD_A_ROLE",
            short: "add role",
          },
          {
            name: "add an employee",
            value: "ADD_AN_EMPLOYEE",
            short: "add employee",
          },
          {
            name: "update an employee's role",
            value: "UPDATE_AN_EMPLOYEE_ROLE",
            short: "update employee's role",
          },
          {
            name: "exit",
            value: "EXIT",
            short: "exit",
          },
        ]
    },
];
function mainMenu() {
  inquirer
  .prompt(questions)
  .then((answers) => {
    switch (answers.main) {
      // viewing data
      case "VIEW_ALL_DEPARTMENTS":
        viewAllDepartments();
        break;
      case "VIEW_ALL_ROLES":
        viewAllRoles();
        break;
      case "VIEW_ALL_EMPLOYEES":
        viewAllEmployees();
        break;

      // modifying data
      case "ADD_A_DEPARTMENT":
        addDepartment();
        break;
      case "ADD_A_ROLE":
        addRole();
        break;
      case "ADD_AN_EMPLOYEE":
        addEmployee();
        break;
      case "UPDATE_AN_EMPLOYEE_ROLE":
        updateEmployeeRole();
        break;
      
      // this will end the connection and stop talking to the database
      case "EXIT":
        connection.end();
        break;
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
};

// Because we are using main menu as a function, we need to call it. This is the first invocation of that.
mainMenu();


function viewAllDepartments() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) {
      console.error("Error viewing departments: " + err);
    } else {
      console.table(res);
    }
    // Call mainMenu regardless of whether there was an error or not
    mainMenu();
  });
}

function viewAllRoles() {
  connection.query("SELECT roles.role_id, roles.role_title, roles.role_salary, departments.department_name FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id ", function (err, res) {
    if (err) {
      console.error("Error viewing roles: " + err);
    } else {
      console.table(res);
    }
    // Call mainMenu regardless of whether there was an error or not
    mainMenu();
  });
}

function viewAllEmployees() {
  connection.query("SELECT employees.employee_id, employees.first_name, employees.last_name, roles.role_title, roles.role_salary, departments.department_name, employees.manager_id, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employees LEFT JOIN roles ON employees.employee_roles = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees e2 ON employees.manager_id = e2.employee_id", function (err, res) {
    if (err) {
      console.error("Error viewing employees: " + err);
    } else {
      console.table(res);
    }
    // Call mainMenu regardless of whether there was an error or not
    mainMenu();
  });
}


function addDepartment() {
  inquirer
 .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the department you would like to add?"
      }
    ])
 .then((answers) => {
      connection.query(
        "INSERT INTO departments SET?",
        {
          department_name: answers.department_name
        },
        function (err, res) {
          if (err) {
            console.error("Error adding department: " + err);
          } else {
            console.log("Added department: " + answers.department_name + " with ID of: " + res.insertId);
          }
          mainMenu();
        }
      );
    });
}

function addRole() {
  inquirer
 .prompt([
      {
        type: "input",
        name: "role_title",
        message: "What is the name of the role you would like to add?"
      },
      {
        type: "input",
        name: "role_salary",
        message: "What is the salary of the role you would like to add?"
      },
      // {
      //   type: "input",
      //   name: "department_id",
      //   message: "What is the department ID of the role you would like to add?"
      // }
    ])
 .then((answers) => {  
    connection.query("SELECT * FROM departments", (err, results) => {
        if (err) {
          console.error("Error adding role: " + err);
          return;
        }
        const departmentChoices = results.map(({ department_name, department_id }) => ({
          name: department_name,
          short: department_name,
          value: department_id
        }));
        inquirer.prompt([
          {
          type: "list",
          name: "department_id",
          message: "What is the department ID of the role you would like to add?",
          choices: departmentChoices,
          }
        ])
        .then((answers2) => {
          connection.query(
            "INSERT INTO roles SET?",
            {
              role_title: answers.role_title,
              role_salary: answers.role_salary,
              department_id: answers2.department_id
            },
            function (err, res) {
              if (err) {
                console.error("Error adding role: " + err);
              } else {
                console.log(
                  "Added role: " + answers.role_title +
                  " with ID of: " + res.insertId +
                  ", a salary of: $" + answers.role_salary +
                  " with a department ID of: " + answers2.department_id
                );
              }
              mainMenu();
            }
          );
        })
      })
    });
}

// async function addRole() {
//   let departmentChoices = await connection.query("SELECT * FROM departments", function (err, results) {
//     if (err) {
//         console.error("Error adding role: " + err);
//         return;
//       }
//       console.log(results);
//       departmentChoices = results.map(({ department_name, department_id }) => ({
//         department_name: department_name,
//         department_id: department_id
//       }));
//       return results;
//   });
//   console.log(departmentChoices);
// }

function addEmployee() {
  inquirer
 .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the first name of the employee you would like to add?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the last name of the employee you would like to add?"
      },
      {
        type: "input",
        name: "employee_roles",
        message: "What is the role ID of the person you would like to add?"
      },
      // {
      //   type: "input",
      //   name: "salaries",
      //   message: "What is the salary of the employee you would like to add?"
      // },
      {
        type: "input",
        name: "manager_id",
        message: "What is the manager ID of the employee you would like to add?"
      },
      // {
      //   type: "input",
      //   name: "department_id",
      //   message: "What is the department ID of the employee you would like to add?"
      // }
    ])
 .then((answers) => {
      // fetch salary for role
      const sql = `SELECT * FROM roles WHERE role_id = "${answers.employee_roles}"`;
      connection.query(sql, (err, rows, fields) => {
        if (err instanceof Error) {
          console.log(err);
          return;
        }
       // this querys the database and updates

       connection.query(
          "INSERT INTO employees SET?",
          {
            first_name: answers.first_name,
            last_name: answers.last_name,
            employee_roles: answers.employee_roles,
            // salaries: rows[0].role_salary,
            manager_id: answers.manager_id,
            // department_id: answers.department_id
          },
          function (err, res) {
            if (err) {
              console.error("Error adding department: " + err);
            } else {
              console.log("Added employee with the name: " + answers.first_name + " " + answers.last_name + " with ID of: " + res.insertId + ", a salary of: $" + rows[0].role_salary + " and a manager ID of: " + answers.manager_id);
            }
            mainMenu();
          }
        );
      });
    });
}

function updateEmployeeRole() {

  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) {
      console.error("Error viewing all employees: " + err);
    } else {
      // here, we transform the results of the query into a question list
      const employeeList = res.map(employee => {
        let emp = {};
        emp.name = employee.first_name + " " + employee.last_name;
        emp.short = employee.first_name;
        emp.value = employee.employee_id;
        return emp;
      });
      
      // also get list of all roles

      connection.query("SELECT * FROM roles", function (err, results) {
        if (err) {
          console.error("Error viewing all roles: " + err);
        } else {
          const roleList = results.map(role => {
            let _role =  {};
            _role.name = role.role_title
            _role.short = role.role_title
            _role.value = role.role_id
            return _role;
          });
          
          // now, we use the employeeList to ask which employee to edit

          inquirer
          .prompt([
            {
              type: "list",
              name: "main",
              message: "choose one of the following to update their role",
              choices: employeeList
            },
            {
              type: "list",
              name: "new_role",
              message: "what is the new role for this employee?",
              choices: roleList
            }
          ])
          // once we have an answer, we can act upon it
          .then((answers) => {
            connection.query(
              `UPDATE employees SET employee_roles = ${answers.new_role} WHERE employee_id = ${answers.main}`, function (err, res) {
                if (err) {
                  console.error("Error viewing all employees: " + err);
                } else {
                  const the_role = roleList.filter(role => {
                    return role.value === answers.new_role;
                  })
                  console.log("Updated employee's role to: " + the_role[0].name);
                  mainMenu();
                }
              }
            )
          });
        }
      });
    }
  });
}