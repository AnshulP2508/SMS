import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ButtonLink from "./ButtonLink";
import { getStudentById, getStudentPhotoUrl } from "../services/StudentService";
import { getDepartmentById } from "../services/DepartmentService";

const StudentProfileComponent = () => {
  const [student, setStudent] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  // Updated useEffect function to properly handle photo URLs
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const studentResponse = await getStudentById(id);
        const studentData = studentResponse.data;
        
        // Ensure photoUrl is set correctly
        if (!studentData.photoUrl) {
          studentData.photoUrl = getStudentPhotoUrl(id);
        }
        
        setStudent(studentData);
  
        // Fetch department details
        if (studentData.departmentId) {
          try {
            const departmentResponse = await getDepartmentById(studentData.departmentId);
            setDepartment(departmentResponse.data);
          } catch (deptError) {
            console.error("Error fetching department:", deptError);
            // Don't fail the whole component if just the department fetch fails
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError("Failed to load student profile. Please try again later.");
        setLoading(false);
      }
    };
  
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite error loop
    e.target.style.display = 'none';
    // Show initials instead
    const initialsElement = e.target.nextElementSibling;
    if (initialsElement) {
      initialsElement.style.display = 'flex';
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <ButtonLink text="Back to Students" toAction="/students" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Student not found
        </div>
        <ButtonLink text="Back to Students" toAction="/students" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col">
          <ButtonLink text="Back to Students" toAction="/students" />
        </div>
      </div>
      
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Student Profile</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div className="bg-light p-4 rounded">
                {student.photoUrl ? (
                  <>
                    <img 
                      src={student.photoUrl} 
                      alt={`${student.firstName} ${student.lastName}`} 
                      className="img-fluid rounded-circle mb-3"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      onError={handleImageError}
                    />
                    <div 
                      className="bg-secondary text-white rounded-circle d-none align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: "150px", height: "150px", fontSize: "3rem" }}
                    >
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                  </>
                ) : (
                  <div 
                    className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "150px", height: "150px", fontSize: "3rem" }}
                  >
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                  </div>
                )}
                <h3>{student.firstName} {student.lastName}</h3>
                <p className="text-muted">{department ? department.departmentName : "No Department"}</p>
              </div>
            </div>
            <div className="col-md-8">
              <h4 className="border-bottom pb-2 mb-3">Personal Information</h4>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">First Name:</div>
                <div className="col-md-9">{student.firstName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Last Name:</div>
                <div className="col-md-9">{student.lastName}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Email:</div>
                <div className="col-md-9">{student.email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 fw-bold">Department:</div>
                <div className="col-md-9">
                  {department ? (
                    <>
                      <span className="fw-bold">{department.departmentName}</span>
                      <p className="text-muted small mt-1">{department.departmentDescription}</p>
                    </>
                  ) : (
                    "Not assigned"
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col">
              <div className="d-flex justify-content-end gap-2">
                <ButtonLink 
                  text="Edit Profile" 
                  toAction={`/edit-student/${student.id}`} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileComponent;