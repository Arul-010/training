import { useEffect, useState } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "./services/employeeService";

function App() {
  const [employees, setEmployees] = useState([]); // Store the emp list
  const [editEmployee, setEditEmployee] = useState(null); // Store selected emp for editing
  const [searchQuery, setSearchQuery] = useState(""); // Search filter state

  // Load the details of employees--GET
  const storedEmployee = () => {
    getEmployees()
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };

  useEffect(() => {
    storedEmployee();
  }, []);

  const insertEmployee = (employee) => {
    addEmployee(employee)
      .then(() => {
        storedEmployee();
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
      });
  };

  const handleUpdateEmployee = (employee) => {
    updateEmployee(employee.id, employee)
      .then(() => {
        setEditEmployee(null); // Reset edit mode
        storedEmployee();
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
      });
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id)
        .then(() => {
          storedEmployee();
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
        });
    }
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      (employee.name && employee.name.toLowerCase().includes(query)) ||
      (employee.department && employee.department.toLowerCase().includes(query)) ||
      (employee.email && employee.email.toLowerCase().includes(query))
    );
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Employee Management</h1>
        <p className="app-subtitle">Track, filter, and manage your team directory in real time.</p>
      </header>

      <div className="app-content">
        <div className="form-section">
          <EmployeeForm
            addEmployee={insertEmployee}
            editEmployee={editEmployee}
            updateEmployee={handleUpdateEmployee}
            onCancel={() => setEditEmployee(null)}
          />
        </div>

        <div className="list-section">
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search by name, department, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <EmployeeList
            employees={filteredEmployees}
            onDelete={handleDeleteEmployee}
            onEdit={setEditEmployee}
          />
        </div>
      </div>
    </div>
  );
}

export default App;