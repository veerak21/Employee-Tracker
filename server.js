// Import and require packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const ctable = require('console.table');
const { response } = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection({
     
    host: 'localhost',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
},
console.log(`Connected to the EmployeeTracker_db database.`)
);

db.connect((err) =>{
    if(err) throw err;
    console.log(`Connected as id ${db.threadId} \n`);
    startApp();
});
// Creating the function for inquirer prompts to manage a company's employee database
startApp = () => {
    inquirer.prompt([
        {
            name:'initialInquiry',
            type: 'rawlist',
            message: 'Welcome to the employee management program. What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'View all employees by manager', 'Add a department', 'Add a role', 'Add an employee', 'Update employee\'s role', 'Update employee\'s manager', 'Remove a department', 'Remove a role', 'Remove an employee', 'View total salary of department', 'Exit program']
        }
    ]).then((response) => {
        switch (response.initialInquiry){
            case 'View all departments':
                viewAllDepartments();
                break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'View all employees by manager':
                    viewAllEmployeesByManager();
                break;
                case 'Add a department':
                    addADepartment();
                break;
                case 'Add a role':
                    addARole();
                break;
                case 'Add an employee':
                    addAnEmployee();
                break;
                case 'Update employee\'s role':
                    updateEmployeeRole();
                break;
                case 'Update employee\'s manager':
                    updateEmployeesManager();
                break;
                case 'Remove a department':
                    removeADepartment();
                break;
                case 'Remove a role':
                    removeARole();
                break;
                case 'Remove an employee':
                    removeAnEmployee();
                break;
                case 'View total salary of department':
                    viewDepartmentSalary();
                break;
                case 'Exit program':
                    db.end();
                    console.log('\n You have exited the employee management program. Thanks for using! \n');
                    return;
                default:
                    break;
            
        }
    })
}
 viewAllDepartments = () => {
    // Query database
    db.query(`SELECT * FROM department ORDER BY dept_id ASC;`, (err,res) => {
        if(err) throw err;
        console.table('\n', res, '\n');
        startApp();

    })
 };
 viewAllRoles = () => {
   // Query database
    db.query(`SELECT role.role_id, role.title, role.salary, department.dept_name, department.dept_id FROM role JOIN department ON role.depart_id = department.dept_id ORDER BY role.role_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewAllEmployees = () => {
    // Query database
    db.query(`SELECT e.emp_id, e.first_name, e.last_name, role.title, department.dept_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.emp_id JOIN role ON e.rolee_id = role.role_id JOIN department ON department.dept_id = role.depart_id ORDER BY e.emp_id ASC;`, (err, res) => {
        if (err) throw err;
        console.table('\n', res, '\n');
        startApp();
    })
};

viewAllEmployeesByManager = () => {
    // Query database
    db.query(`SELECT emp_id, first_name, last_name FROM employee ORDER BY emp_id ASC;`, (err, res) => {
        if (err) throw err;
        let managers = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.emp_id }));
        //inquirer prompt for the manager
        inquirer.prompt([
            {
            name: 'manager',
            type: 'rawlist',
            message: 'Which manager would you like to see the employee\'s of?',
            choices: managers   
            },
        ]).then((response) => {
            //query for the employees of the manager 
            db.query(`SELECT e.emp_id, e.first_name, e.last_name, role.title, department.dept_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.emp_id JOIN role ON e.rolee_id = role.role_id JOIN department ON department.dept_id = role.depart_id WHERE e.manager_id = ${response.manager} ORDER BY e.emp_id ASC`, 
            (err, res) => {
                if (err) throw err;
                console.table('\n', res, '\n');
                startApp();
            })
        })
    })
}

addADepartment = () => {
    //inquirer prompt for new department
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the department you want to add?'   
        }
    ]).then((response) => {
        //query for adding the department value
        db.query(`INSERT INTO department SET ?`, 
        {
            dept_name: response.newDept,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`\n ${response.newDept} successfully added to database! \n`);
            startApp();
        })
    })
};

addARole = () => {
    // Query database
    db.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.dept_name, value: department.dept_id }));
        //inquirer prompt for new role details
        inquirer.prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the name of the role you want to add?'   
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role you want to add?'   
            },
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Which department do you want to add the new role to?',
            choices: departments
            },
        ]).then((response) => {
            //query for adding the role values
            db.query(`INSERT INTO role SET ?`, 
            {
                title: response.title,
                salary: response.salary,
                depart_id: response.deptName,
            },
            (err, res) => {
                if (err) throw err;
                console.log(`\n ${response.title} successfully added to database! \n`);
                startApp();
            })
        })
    })
};

addAnEmployee = () => {
    // Query database
    db.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        db.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.emp_id}));
            //inquirer prompt for new employee details
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the new employee\'s first name?'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the new employee\'s last name?'
                },
                {
                    name: 'rolee',
                    type: 'rawlist',
                    message: 'What is the new employee\'s role title?',
                    choices: roles
                },
                {
                    name: 'manager',
                    type: 'rawlist',
                    message: 'Who is the new employee\'s manager?',
                    choices: employees
                }
            ]).then((response) => {
                //query for adding the new employee values
                db.query(`INSERT INTO employee SET ?`, 
                {
                    first_name: response.firstName,
                    last_name: response.lastName,
                    rolee_id: response.rolee,
                    manager_id: response.manager,
                }, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n ${response.firstName} ${response.lastName} successfully added to database! \n`);
                    startApp();
                })
                
            })
        })
    })
};

updateEmployeeRole = () => {
    // Query database
    db.query(`SELECT * FROM role;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        db.query(`SELECT * FROM employee;`, (err, res) => {
            if (err) throw err;
            let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.emp_id }));
           //inquirer prompt for updating the current employee role
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'rawlist',
                    message: 'Which employee would you like to update the role for?',
                    choices: employees
                },
                {
                    name: 'newRole',
                    type: 'rawlist',
                    message: 'What should the employee\'s new role be?',
                    choices: roles
                },
            ]).then((response) => {
                // query for updating the current employee's role
                db.query(`UPDATE employee SET ? WHERE ?`, 
                [
                    {
                        rolee_id: response.newRole,
                    },
                    {
                        emp_id: response.employee,
                    },
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n Successfully updated employee's role in the database! \n`);
                    startApp();
                })
            })
        })
    })
}

updateEmployeesManager = () => {
    // Query database
    db.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.emp_id }));
        //inquirer prompt for employee manager
        inquirer.prompt([
            {
                name: 'employee',
                type: 'rawlist',
                message: 'Which employee would you like to update the manager for?',
                choices: employees
            },
            {
                name: 'newManager',
                type: 'rawlist',
                message: 'Who should the employee\'s new manager be?',
                choices: employees
            },
        ]).then((response) => {
            // query for updating the employee's new manager
            db.query(`UPDATE employee SET ? WHERE ?`, 
            [
                {
                    manager_id: response.newManager,
                },
                {
                    emp_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully updated employee's manager in the database! \n`);
                startApp();
            })
        })
    })
};

removeADepartment = () => {
    // Query database
    db.query(`SELECT * FROM department ORDER BY dept_id ASC;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.dept_name, value: department.dept_id }));
        //inquirer prompt to delete the which department
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Which department would you like to remove?',
            choices: departments
            },
        ]).then((response) => {
            // Hardcoded query: DELETE FROM department where dept_id = user response
            db.query(`DELETE FROM department WHERE ?`, 
            [
                {
                    dept_id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the department from the database! \n`);
                startApp();
            })
        })
    })
}

removeARole = () => {
    // Query database
    db.query(`SELECT * FROM role ORDER BY role_id ASC;`, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => ({name: role.title, value: role.role_id }));
        //inquirer prompt to remove role
        inquirer.prompt([
            {
            name: 'title',
            type: 'rawlist',
            message: 'Which role would you like to remove?',
            choices: roles
            },
        ]).then((response) => {
            // Hardcoded query: DELETE FROM  role WHERE role_id= user response
            db.query(`DELETE FROM role WHERE ?`, 
            [
                {
                    role_id: response.title,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the role from the database! \n`);
                startApp();
            })
        })
    })
}

removeAnEmployee = () => {
    // Query database
    db.query(`SELECT * FROM employee ORDER BY emp_id ASC;`, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.emp_id }));
        //inquirer prompt to remove an employee
        inquirer.prompt([
            {
                name: 'employee',
                type: 'rawlist',
                message: 'Which employee would you like to remove?',
                choices: employees
            },
        ]).then((response) => {
            // Hardcoded query: DELETE FROM employee WHERE emp_id= user response
            db.query(`DELETE FROM employee WHERE ?`, 
            [
                {
                    emp_id: response.employee,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n Successfully removed the employee from the database! \n`);
                startApp();
            })
        })
    })
}

viewDepartmentSalary = () => {
    // Query database
    db.query(`SELECT * FROM department ORDER BY dept_id ASC;`, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => ({name: department.dept_name, value: department.dept_id }));
        //inquirer prompt to select the department for calculating the sum of the salaries
        inquirer.prompt([
            {
            name: 'deptName',
            type: 'rawlist',
            message: 'Which department would you like to view the total salaries of?',
            choices: departments
            },
        ]).then((response) => {
          // Query for SUM of salary based on department id
            db.query(`SELECT depart_id, SUM(role.salary) AS total_salary FROM role WHERE ?`, 
            [
                {
                    depart_id: response.deptName,
                },
            ], 
            (err, res) => {
                if (err) throw err;
                console.log(`\n The total utilized salary budget of the ${response.deptName} department is $ \n`);
                console.table('\n', res, '\n');
                startApp();
            })
        })
    })
}

