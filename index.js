const inquirer = require('inquirer');
const mySql2 = require('mysql2');

const questions = [
    {
        type: "list",
        name: "main",
        message: "choose one of the following",
        choices: [
          {
            name: "view all departments",
            value: "view all departments",
            short: "all depts"
          },
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee's role",
          "exit"
        ]
    },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    switch (answers.main) {
      case "view all departments":
        viewAllDepartments();
        break;
      case "view all roles":
        viewAllRoles();
        break;
      case "view all employees":
        viewAllEmployees();
        break;
      case "add a department":
        addDepartment();
        break;
      case "add a role":
        addRole();
        break;
      case "add an employee":
        addEmployee();
        break;
      case "update an employee's role":
        updateEmployeeRole();
        break;
      
      // this will end the connection and stop talking to the database
      case "exit":
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