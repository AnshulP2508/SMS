import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonLink from "./ButtonLink";
import useListStudentComponentHook from "../hooks/useListStudentComponentHook";

const ListStudentComponent = () => {
  const { students, getDepartmentName, updateStudent, deleteStudentById } =
    useListStudentComponentHook();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sortOption, setSortOption] = useState("all");

  // Initialize filtered students
  useEffect(() => {
    if (students.length > 0) {
      setFilteredStudents(students);
    }
  }, [students]);

  // Handle search and filter functionality
  useEffect(() => {
    let result = [...students];
    
    // Apply search term filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        student => 
          student.firstName.toLowerCase().includes(term) ||
          student.lastName.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) 
      );
    }
    
    // Apply email sorting
    if (sortOption === "email") {
      result.sort((a, b) => a.email.localeCompare(b.email));
    }
    
    setFilteredStudents(result);
  }, [searchTerm, sortOption, students]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <h2 className="text-center my-3">List of Students</h2>
      <div className="row mb-3">
        <div className="col-md-6">
          <ButtonLink text="Add Student" toAction="/add-student" />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-3">
          <select 
            className="form-select" 
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="all">All Students</option>
            <option value="email">Sort by Email</option>
          </select>
        </div>
      </div>
      
      {filteredStudents.length === 0 ? (
        <div className="alert alert-info">No students found matching your criteria</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Employee First Name</th>
              <th scope="col">Employee Last Name</th>
              <th scope="col">Employee Email</th>
              <th scope="col">Department</th>
              <th scope="col" colSpan="3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((item) => (
              <tr key={item.id}>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{getDepartmentName(item.departmentId)}</td>
                <td>
                  <Link
                    to={`/student/${item.id}`}
                    className="btn btn-outline-primary"
                  >
                    View
                  </Link>
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteStudentById(item.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => updateStudent(item.id)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {filteredStudents.length > 0 && (
        <div className="text-end text-muted">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      )}
    </div>
  );
};

export default ListStudentComponent;