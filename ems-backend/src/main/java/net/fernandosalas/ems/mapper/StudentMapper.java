package net.fernandosalas.ems.mapper;

import net.fernandosalas.ems.dto.StudentDto;
import net.fernandosalas.ems.entity.Student;

public class StudentMapper {
    public static StudentDto mapToStudentDto(Student student) {
        return new StudentDto(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getDepartment().getId(),
                student.getPhoneNumber(),
                student.getAddress(),
                student.getDateOfBirth(),
                student.getEnrollmentYear(),
                student.getProfileImageUrl()
        );
    }

    public static Student mapToStudent(StudentDto studentDto) {
        Student student = new Student();
        student.setId(studentDto.getId());
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhoneNumber(studentDto.getPhoneNumber());
        student.setAddress(studentDto.getAddress());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        student.setEnrollmentYear(studentDto.getEnrollmentYear());
        student.setProfileImageUrl(studentDto.getProfileImageUrl());
        return student;
    }
}
