package net.fernandosalas.ems.service;

import net.fernandosalas.ems.dto.StudentDto;
import net.fernandosalas.ems.dto.StudentProfileDto;
import java.util.List;

public interface StudentService {
    StudentDto createStudent(StudentDto studentDto);
    StudentDto getStudentById(Long studentId);
    List<StudentDto> getAllStudents();
    StudentDto updateStudent(Long studentId, StudentDto studentDto);
    void deleteStudent(Long studentId);

    // Profile methods
    StudentProfileDto getStudentProfile(Long studentId);
    StudentDto updateStudentProfile(Long studentId, StudentDto studentDto);
    StudentDto updateProfileImage(Long studentId, String imageUrl);
}