import { useState, useEffect } from "react";

function EmployeeForm({
  addEmployee,
  editEmployee,
  updateEmployee,
  onCancel
}) {
  const [employee, setEmployee] = useState({
    name: "",
    department: "",
    email: ""
  });

  useEffect(() => {
    if (editEmployee) {
      setEmployee(editEmployee);
    } else {
      setEmployee({
        name: "",
        department: "",
        email: ""
      });
    }
  }, [editEmployee]);

  // Handles the typing
  const handleChange = (event) => {
    setEmployee({
      ...employee, // existing will remain same
      [event.target.name]: event.target.value // change only the updated field
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!employee.name.trim() || !employee.department.trim() || !employee.email.trim()) {
      alert("All fields are required.");
      return;
    }
    
    if (editEmployee) {
      updateEmployee(employee);
    } else {
      addEmployee(employee);
    }
    
    setEmployee({
      name: "",
      department: "",
      email: ""
    });
  };

  const handleReset = () => {
    setEmployee({
      name: "",
      department: "",
      email: ""
    });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">{editEmployee ? "Update Employee" : "Add New Employee"}</h2>

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter employee name"
            value={employee.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <input
            type="text"
            name="department"
            placeholder="Enter department"
            value={employee.department}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={employee.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editEmployee ? "Update" : "Add"}
          </button>
          {(editEmployee || employee.name || employee.department || employee.email) && (
            <button type="button" onClick={handleReset} className="btn-cancel">
              {editEmployee ? "Cancel" : "Clear"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;