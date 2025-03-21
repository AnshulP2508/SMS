package net.fernandosalas.ems.mapper;

import net.fernandosalas.ems.dto.StudentProfileDto;
import net.fernandosalas.ems.entity.Student;

public class StudentProfileMapper {
    public static StudentProfileDto mapToStudentProfileDto(Student student) {
        return new StudentProfileDto(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getDepartment().getDepartmentName(),
                student.getDepartment().getDepartmentDescription(),
                student.getPhoneNumber(),
                student.getAddress(),
                student.getDateOfBirth(),
                student.getEnrollmentYear(),
                student.getProfileImageUrl()
        );
    }
}