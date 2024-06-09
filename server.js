const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = require('./Config/connection');


const questions = [
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'task',
      choices: ['View All Departments',
        'View All Roles',
        'View All Employees', 
        'Add a Department', 'Add a Role',
         'Add an Employee', 'Update Employee Role'],   
    },
  ]

  async function start(connection) {
    try {
        // Presented options to the user
        const { choice } = await inquirer.prompt([
          {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
              'View all departments',
              'Add Department',
              'View all roles',
              'Add Role',
              'View all employees',
              'Add Employee',
              'Update Employee',
              'Exit'
            ]
          }
        ]);
    
        // Performed actions based on user choice
        switch (choice) {
          case 'View all departments':
            await viewDeps(connection);
            break;
          case 'Add Department':
            await addDep(connection);
            break;
          case 'View all roles':
            await viewRoles(connection);
            break;
          case 'Add Role':
            await addRole(connection);
            break;
          case 'View all employees':
            await viewEmps(connection);
            break;
          case 'Add Employee':
            await addEmp(connection);
            break;
          case 'Update Employee':
            await updateEmp(connection);
            break;
          case 'Exit':
            console.log('Exiting...');
            connection.end();
            process.exit(0);
        }
    
        // After viewing tables, return to the initial menu
        await start(connection);
      } catch (error) {
        console.error('Error:', error);
      }
    }



async function viewDeps(){
    try{
    await connection.query('SELECT * FROM department', function (err, results) {
        console.log(results);
       return commandList();
      });
    } catch (err) {
        console.log(err);
    }
};

async function viewEmps() {
    connection.query('SELECT * FROM employee', function (err, results) {
        console.log(results);
       return commandList();
      });
};

async function viewRoles() {
    try {
       await connection.query('SELECT * FROM role;', function (err, results) {
            console.log(results);
           return commandList();
          });
    } catch (err) {
        console.log(err);
    };
   
};

async function updateEmp() {
    try{
    const [employees] = await connection.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee you want to update:',
        choices: employeeChoices
      }
    ]);

    const { firstName, lastName, roleId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the new first name for the employee:'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the new last name for the employee:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the new role ID for the employee:'
      }
    ]);

    const [roleExists] = await connection.query('SELECT id FROM role WHERE id = ?', roleId);
    if (roleExists.length === 0) {
      console.log('Error: The provided role ID does not exist.');
      await start(connection);
      return;
    }

    const [result] = await connection.query('UPDATE employee SET first_name = ?, last_name = ?, role_id = ? WHERE id = ?', [firstName, lastName, roleId, employeeId]);

    console.log(`Updated employee with ID ${employeeId} in the database.`);
    await start(connection);
  } catch (error) {
    console.error('Error updating employee:', error);
  }
};

async function addDep() {
    inquirer.prompt({
        type: 'input',
        message: 'What is the name of the department?',
        name: 'newDep',
        validate: (newDep) => {
            if (newDep.length >= 3){
                return true;
            }
            else {
                return 'Please enter at least 3 characters';
            }
        }
    }).then((answers) =>  
    connection.query(`INSERT INTO department (name) VALUES ${answers.newDep};`, function (err, results) {
        console.log(results);
       return commandList();
    }));
} ;

async function addEmp() {

};

async function addRole() {

};
