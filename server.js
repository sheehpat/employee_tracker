const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employees_db'
  };
  
  // Function to connect to the database
  async function connectToDB() {
    try {
      const connection = await mysql.createConnection(dbConfig);
      return connection;
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

async function start(connection) {
    try {
        // Show questions to user
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
    
        // Executes approrpriate function based on selection
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
    
        
        await start(connection);
      } catch (error) {
        console.error('Error:', error);
      }
    }



async function viewDeps(connection){
    try{
    const deps =await connection.query('SELECT * FROM department');
    if (!deps){
        console.log('No departments in database');
    }
    console.log(deps);
    await start(connection);
    } catch (err) {
        console.log(err);
    }
};

async function viewEmps(connection) {
   try {
    const emps = await connection.query('SELECT * FROM employee');
    if (!emps){
         console.log ('No roles in database');
        } 
    console.log(emps)
    await start(connection);
   } catch (error) {
    console.log(error);
   } 
};

async function viewRoles(connection) {
    try {
       const results = await connection.query('SELECT * FROM role;');
       if (!results){
        console.log ('No roles in database');
       } 
       console.log(results)
       await start(connection);
    } catch (err) {
        console.log(err);
    };
};

async function updateEmp(connection) {
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

async function addDep(connection) {
    try {
        const { depName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'depName',
            message: 'What is the name of the department?'
          }
        ]);
        
        await connection.query('INSERT INTO department (name) VALUES (?)', depName);
        console.log(`Added department "${depName}" to the database.`);
        await start(connection);
      } catch (error) {
        console.error('Error adding department:', error);
      }
} ;

async function addEmp(connection) {
    try {
        // Provide current roles for selection
        const [roles] = await connection.query('SELECT id, title FROM role');
        const roleChoices = roles.map(role => ({
          name: `${role.title} (ID: ${role.id})`,
          value: role.id
        }));
    
        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:"
          },
          {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:"
          },
          {
            type: 'list',
            name: 'roleId',
            message: "Select the employee's role:",
            choices: roleChoices
          },
          {
            type: 'input',
            name: 'managerId',
            message: "Enter the employee's manager ID:"
          }
        ]);
    
        // Add new employee to the database
        await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
        console.log(`Added employee "${firstName} ${lastName}" to the database.`);
        await start(connection);
      } catch (error) {
        console.error('Error adding employee:', error);
      }
};

async function addRole(connection) {
    try {
        //Get details for new Role
        const { title, salary, depId } = await inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role:'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the new role:'
          },
          {
            type: 'input',
            name: 'depId',
            message: 'Enter the department ID for the new role:'
          }
        ]);
        
        //Add New Role to the database
        await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, depId]);
        console.log(`Added role "${title}" to the database.`);
        await start(connection);
      } catch (error) {
        console.error('Error adding role:', error);
      }
};

(async () => {
    const connection = await connectToDB();
    if (!connection) {
      console.error('Failed to connect to the database.');
      return;
    }
    await start(connection);
  })();
