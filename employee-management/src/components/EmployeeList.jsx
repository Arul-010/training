function EmployeeList({ employees, onDelete, onEdit }) {
  return (
    <div className="list-card">
      <h2 className="list-title">Employee Directory</h2>
      
      {employees.length === 0 ? (
        <div className="empty-state">
          <p>No employees matching the search or directory is empty.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="table-row">
                  <td className="col-id">#{employee.id}</td>
                  <td className="col-name">{employee.name}</td>
                  <td>
                    <span className="dept-badge">{employee.department}</span>
                  </td>
                  <td className="col-email">{employee.email}</td>
                  <td className="col-actions text-center">
                    <button
                      onClick={() => onEdit(employee)}
                      className="btn-edit"
                      title="Edit Employee"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="btn-delete"
                      title="Delete Employee"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;