import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/students";
const STUDENT_PROFILE_API_URL = "http://localhost:8080/api/student-profiles";

export const listStudents = () => {
  return axios.get(REST_API_URL);
};

export const createStudent = (student) => {
  return axios.post(REST_API_URL, student);
};

export const deleteStudent = (id) => {
  return axios.delete(`${REST_API_URL}/${id}`);
};

export const getStudentById = (id) => {
  return axios.get(`${REST_API_URL}/${id}`);
};

export const updateStudent = (id, student) => {
  return axios.put(`${REST_API_URL}/${id}`, student);
};

export const uploadStudentPhoto = (studentId, formData) => {
  return axios.post(`${STUDENT_PROFILE_API_URL}/${studentId}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Function to get the photo URL with cache-busting
export const getStudentPhotoUrl = (id) => {
  if (!id) return null;
  return `${STUDENT_PROFILE_API_URL}/${id}/profile-image?timestamp=${new Date().getTime()}`;
};