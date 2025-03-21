import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ButtonLink from "./ButtonLink";
import { listDepartments } from "../services/DepartmentService";
import {
  updateStudent,
  createStudent,
  getStudentById,
  uploadStudentPhoto,
  getStudentPhotoUrl
} from "../services/StudentService";

const StudentComponent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDepartment = async () => {
    const response = await listDepartments();
    setDepartments(response.data);
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (studentId) => {
    if (!photoFile) return;

    try {
      const formData = new FormData();
      // Change 'file' to 'photo' to match what the backend expects
      formData.append('photo', photoFile);
      await uploadStudentPhoto(studentId, formData);
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo");
    }
  };

  const saveOrUpdateStudent = async (e) => {
    e.preventDefault();

    const student = { firstName, lastName, email, departmentId };

    if (firstName && lastName && email) {
      try {
        let studentId;

        if (id) {
          await updateStudent(id, student);
          studentId = id;
          toast.info("Student updated successfully!");
        } else {
          const response = await createStudent(student);
          studentId = response.data.id;
          toast.success("Student added successfully!");
        }

        // Upload photo if selected
        if (photoFile) {
          await uploadPhoto(studentId);
        }

        navigate("/students");
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error("Error saving/updating student:", error);
      }
    } else {
      toast.error("Please fill in all the fields!");
    }
  };

  const getStudentData = async (studentId) => {
    try {
      const response = await getStudentById(studentId);
      const student = response.data;
      setFirstName(student.firstName);
      setLastName(student.lastName);
      setEmail(student.email);
      setDepartmentId(student.departmentId || "");
      
      // Set photo preview from the server if it exists
      if (student.photoUrl) {
        setPhotoPreview(student.photoUrl);
      } else {
        // Try to fetch photo using the standard URL
        const photoUrl = getStudentPhotoUrl(studentId);
        // We'll set this URL and let the browser handle if the image exists
        setPhotoPreview(photoUrl);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
    }
  };

  useEffect(() => {
    if (id) {
      setTitle("Update Student");
      getStudentData(id);
    } else {
      setTitle("Add Student");
    }
  }, [id]);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container mt-5">
      <ButtonLink text="Go Back" toAction="/students" />
      <div className="row">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          <h2 className="text-center">{title}</h2>
          <div className="card-body">
            <form>
              <div className="form-group mb-3 text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex justify-content-center align-items-center"
                  style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#f8f9fa",
                    backgroundImage: photoPreview ? `url(${photoPreview})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    border: '1px dashed #ccc'
                  }}
                  onClick={triggerFileInput}
                >
                  {!photoPreview && (
                    <div className="text-center text-muted">
                      <i className="bi bi-camera" style={{ fontSize: "2rem" }}></i>
                      <div>Click to add photo</div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary mb-3"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                      fileInputRef.current.value = "";
                    }}
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              <div className="form-group mb-2">
                <label className="form-label">First Name: </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Last Name: </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Email: </label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Select Department: </label>
                <select
                  className="form-select"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.departmentName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button
                className="btn btn-outline-success"
                onClick={saveOrUpdateStudent}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentComponent;