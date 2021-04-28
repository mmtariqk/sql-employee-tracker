//Here are the required modules
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

let connection = require("./db/connection.js");

 const runSearch =  () => {
  inquirer
  .prompt({
    name: "whatDo",
    type: "list",
    message: "What would you like to do?",
    choices: ["View all departments.", "View all employees.", "View all employees by department.", "View all employees by manager.", "Add employee.", "Remove employee.", "Update employee role.", "Update employee manager.", "End session."]
  })
  .then(answer => {
      switch (answer.whatDo) {
        case "View all departments.":
          viewDepartments();
          break;

        case "View all employees.":
          viewEmployees();
          break;

        case "View all employees by department.":
          viewEmpsByDept();
          break;

        case "View all employees by manager.":
          viewEmpsByMgr();
          break;

        case "Add employee.":
          addEmployee();
          break;

        case "Remove employee.":
          removeEmployee();
          break;

        case "Update employee role.":
          updateEmpRole();
          break;  
        
        case "Update employee manager.":
          updateEmpMgr();
          break;

        case "End session.":
          endSession();
          break;
      }     
    });
  }

  const viewDepartments = () => {
    connection.query("Select id, dept_name, utilized_budget FROM department",  (err, res) => {
      if (err) throw err;
      console.table('Departments', res);
      runSearch()
      })
    }

  const viewEmployees = () => {
    let query = "SELECT employee.id, employee.first_name, employee.nickname, employee.last_name, department.dept_name, employee.salary, roles.title, mgr_name ";
    query += "FROM employee "; 
    query += "INNER JOIN department ON employee.emp_dept = department.dept_name "; 
    query += "INNER JOIN roles ON department.id = roles.department_id ";
    query += "LEFT JOIN manager ON employee.manager_id = manager.id ";
    
    connection.query(query, (err, res) => {
        console.table('All Employees', res);
        runSearch()
      })
    }
  
  const viewEmpsByDept = () => {
    let query = "SELECT department.dept_name, employee.id, employee.first_name, employee.nickname, employee.last_name ";
    query += "FROM department ";
    query += "INNER JOIN employee ON employee.emp_dept = department.dept_name ";
    query += "ORDER BY department.dept_name";
    
    connection.query(query, (err, res) => {
      console.table('Employees By Manager', res);
      runSearch()
      })
  } 

  const viewEmpsByMgr = () => {
    console.log("view emps by Mgr.");
    let query = "SELECT manager.id, manager.mgr_name, employee.first_name, employee.nickname, employee.last_name ";
    query += "FROM manager ";
    query += "INNER JOIN employee ON manager.id = employee.manager_id ";
    query += "ORDER BY manager.mgr_name";
    connection.query(query, (err, res) => {
      console.table('Employees By Manager', res);
      runSearch()
      })
  }
  
  const addEmployee = () => {
    inquirer
    .prompt([      
      {
        name: "newEmpFirstName",
        type: "input",
        message: "What is the new employee's first name? (Required.)"
      },
      {
        name: "newEmpNickname",
        type: "input",
        message: "What is the new employee's nickname, if any? (Leave blank if none)"
      },
      {
        name: "newEmpLastName",
        type: "input",
        message: "What is the new employee's last name? (Required.)"
      },
      {
        name: "newEmpDept",
        type: "list",
        message: "What is the new employee's department? (Required)",
        choices: ['Therapy & HR', 'Debt Collection', 'Chiropractic & Firearms', 'Cafeteria and Catering', 'Credit and Lending']
      },
      {
        name: "newEmpSalary",
        type: "input",
        message: "What is the new employee's salary? (Required)"
      },
      {
        name: "newEmpManager",
        type: "list",
        message: "Who will manage this new employee?",
        choices: ["Anthony Soprano", "Christopher Moltisanti", "Furio Giunta", "Nobody/Fuggedaboutit"],
      },
      {
        name: "newEmpRole",
        type: "list",
        message: "What will the new employee's role be? (Required)",
        choices: ['Therapist', 'Collections Agent', 'Negotiator', 'Chef', 'Loan Broker']
      }
    ])

    .then((answer) => {
      var newEmpsMgr = " "

      if (answer.newEmpManager === "Anthony Soprano") {
        newEmpsMgr = 1;
      }
   
      if (answer.newEmpManager === "Christopher Moltisanti") {
        newEmpsMgr = 3;
      }
      
      if (answer.newEmpManager === "Furio Giunta") {
        newEmpsMgr = 6;
      }
      
      if (answer.newEmpManager === "Nobody/Fuggedaboutit") {
        newEmpsMgr = null;
      }
      
      var newEmpsRole = " ";
      
      if (answer.newEmpRole === 'Therapist') {
        newEmpsRole = 2
      }
      if (answer.newEmpRole === 'Collections Agent') {
        newEmpsRole = 3
      }
      if (answer.newEmpRole === 'Negotiator') {
        newEmpsRole = 4
      }
      if (answer.newEmpRole === 'Chef') {
        newEmpsRole = 5
      }
      if (answer.newEmpRole === 'Loan Broker') {
        newEmpsRole = 6
      }

      var query = connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.newEmpFirstName,
          nickname: answer.newEmpNickname,
          last_name: answer.newEmpLastName,
          emp_dept: answer.newEmpDept,
          salary: answer.newEmpSalary,
          roles_id: newEmpsRole,
          manager_id: newEmpsMgr
         },
    
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " employee added!\n");
          runSearch()
        }
      )
    })
  }
  
  const updateEmpRole = () => {
    let query = "SELECT employee.id, employee.first_name, employee.nickname, employee.last_name, department.dept_name, employee.roles_id, roles.title ";
    query += "FROM employee ";
    query += "INNER JOIN department ON employee.emp_dept = department.dept_name ";
    query += "INNER JOIN roles ON department.id = roles.department_id ";

    connection.query(query, (err, results) => {
    if (err) throw err;
    
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Which employee's role would you like to update?",
          choices: () => {
            let choiceArray = [];
              for (let i=1; i < results.length; i++) {
              let emp = ""; 
              emp = `${results[i].id} ${results[i].first_name} ${results[i].nickname} ${results[i].last_name} ${results[i].dept_name} ${results[i].roles_id} ${results[i].title}`
              choiceArray.push(emp)
            }
          return choiceArray;
          }
        },
        {
          name: "roleUpdate",
          type: "list",
          message: "What role would you like to update this employee's role to?",
          choices: ['Therapist', 'Collections Agent', 'Negotiator', 'Chef', 'Loan Broker']
        }
      ])
      .then((answer) => {
      updateToChosenRole(answer);
      return answer;
      })
    })  
  }

  const updateToChosenRole = (answer) => {
    newRoleId = "";
    newDept = "";
    newMgr = "";

    if (answer.roleUpdate === 'Therapist') {
      newRoleId = 2;
      newDept = 'Therapy & HR';
      newMgr = 1;
    }
    if (answer.roleUpdate === 'Collections Agent') {
     newRoleId = 3;
     newDept = 'Debt Collection';
     newMgr = 3;
    }
    if (answer.roleUpdate === 'Negotiator') {
     newRoleId = 4;
     newDept = 'Chiropractic & Firearms';
     newMgr = 6;
    }
    if (answer.roleUpdate === 'Chef') {
     newRoleId = 5;
     newDept = 'Cafeteria & Catering';
     newMgr = 1;
    }
    if (answer.roleUpdate === 'Loan Broker') {
     newRoleId = 6;
     newDept = 'Credit & Lending';
     newMgr = 1;
    }

    let choiceStr = answer.choice.split(" ")
    console.log(answer);
    console.log(choiceStr[0]);
    
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
          roles_id: newRoleId,
          emp_dept: newDept, //Use this to update Dept Name in Employee table
          manager_id: newMgr
        },
        {
          id: parseInt(choiceStr[0])
        }
      ],
      (error, res) => {
        if (error) throw error;
        console.log(res.affectedRows + " You just UPDATED the Employee's Role!");
      runSearch();
      }
    )
  }

  const removeEmployee = () => {
    let query = "SELECT employee.id, employee.first_name, employee.nickname, employee.last_name ";
    query += "FROM employee ";
    connection.query(query, (err, results) => {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Which employee would you like to delete?",
          choices:() => {
            let choiceArray = [];
              for (let i=1; i < results.length; i++) {
              let emp = " "; 
              emp = `${results[i].id} ${results[i].first_name} ${results[i].nickname} ${results[i].last_name}`
              choiceArray.push(emp)
            }
          return choiceArray;
          }
        }
      ])
      .then((answer) => {
        deleteRemovedEmp(answer);
        return answer;
      })
    })
  }
       
  const deleteRemovedEmp = (answer) => {
    let choiceStr = answer.choice.split(" ");
    connection.query(
      "DELETE FROM employee WHERE ?",
      [
        {
          id: parseInt(choiceStr[0])
        }
      ],
        (error, res) => {
          if (error) throw error;
          console.log(res.affectedRows + " You DELETED the Employee!");
        runSearch();
        }
      )
    }

  const updateEmpMgr = () => {
    let query = "SELECT employee.id, employee.first_name, employee.nickname, employee.last_name ";
    query += "FROM employee ";
    connection.query(query, (err, results) => {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          message: "Which employee's manager would you like to update?",
          choices: () => {
            let choiceArray = [];
              for (let i=1; i < results.length; i++) {
              let emp = " "; 
              emp = `${results[i].id} ${results[i].first_name} ${results[i].nickname} ${results[i].last_name}`
              choiceArray.push(emp)
            }
          return choiceArray;
          }
        },
        {
          name: "mgrUpdate",
          type: "list",
          message: "Which manager would you like to assign to this employee?",
          choices: ['Anthony Soprano', 'Christopher Moltisanti', 'Furio Giunta']
        }
      ])
      .then((answer) => {
        updateEmployeeMgr(answer);
        return answer;
      })
    })
  }

  const updateEmployeeMgr = (answer) => {
    newMgr = "";

    if (answer.mgrUpdate === 'Anthony Soprano') {
      newMgr = 1;
    }

    if (answer.mgrUpdate === 'Christopher Moltisanti') {
      newMgr = 3;
    }

    if (answer.mgrUpdate === 'Furio Giunta') {
      newMgr = 6;
    }

    let choiceStr = answer.choice.split(" ");
    
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {
          manager_id: newMgr
        },
        {
          id: parseInt(choiceStr[0])
        }
      ],
      (error, res) => {
        if (error) throw error;
        console.log(res.affectedRows + " You UPDATED the Employee's Manager!");
      runSearch();
      }
    )
  }

  const endSession = () => {
    console.log("Your session ended. Thanks for using Employee Tracker CMS.");
    connection.end();
  }
  runSearch();
