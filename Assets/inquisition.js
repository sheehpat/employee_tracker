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

function taskChoice(response){
  switch (response.task) {
      case 'View All Departments':
          logoShape = new Circle();
          break;
}
};
module.exports = { questions, taskChoice };