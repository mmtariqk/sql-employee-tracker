// Require mysql here
const mysql = require("mysql");

//Create connection

const connection = mysql.createConnection({
  
  host: "localhost",

  port: 3306,

  user: "root",

  password: "",
  
  database: "employees_db"
});

connection.connect(function(err) {
  if (err) throw err;
    console.log("connected as having an id " + connection.threadId + "\n");
  
});

module.exports = connection;