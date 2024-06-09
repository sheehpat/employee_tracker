const msql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_db"
  });

  connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

});

module.exports = connection;