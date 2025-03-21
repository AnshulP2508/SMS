package net.fernandosalas.ems.service.implementation;

import net.fernandosalas.ems.dto.StudentDto;
import net.fernandosalas.ems.dto.StudentProfileDto;
import net.fernandosalas.ems.entity.Department;
import net.fernandosalas.ems.entity.Student;
import net.fernandosalas.ems.exception.ResourceNotFoundException;
import net.fernandosalas.ems.mapper.StudentMapper;
import net.fernandosalas.ems.mapper.StudentProfileMapper;
import net.fernandosalas.ems.repository.DepartmentRepository;
import net.fernandosalas.ems.repository.StudentRepository;
import net.fernandosalas.ems.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImplementation implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    // Existing methods...
    @Override
    public StudentDto createStudent(StudentDto studentDto) {
        Student student = StudentMapper.mapToStudent(studentDto);

        Department department = departmentRepository.findById(studentDto.getDepartmentId())
                .orElseThrow(()-> new ResourceNotFoundException("Department was not found with id: "
                        + studentDto.getDepartmentId()));
        student.setDepartment(department);
        Student savedStudent =  studentRepository.save(student);
        return StudentMapper.mapToStudentDto(savedStudent);
    }

    @Override
    public StudentDto getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow(()->
                new ResourceNotFoundException("Student was not found with given id: " + studentId));
        return StudentMapper.mapToStudentDto(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        List<Student> studentList =  studentRepository.findAll();
        return studentList.stream()
                .map(StudentMapper::mapToStudentDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto updateStudent(Long studentId, StudentDto studentDto) {
        Student student = studentRepository.findById(studentId).orElseThrow(()->
                new ResourceNotFoundException("Student was not found with given id: " + studentId));

        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());

        Department department = departmentRepository.findById(studentDto.getDepartmentId())
                .orElseThrow(()-> new ResourceNotFoundException("Department was not found with id: "
                        + studentDto.getDepartmentId()));
        student.setDepartment(department);

        Student savedStudent = studentRepository.save(student);
        return StudentMapper.mapToStudentDto(savedStudent);
    }

    @Override
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow(()->
                new ResourceNotFoundException("Student was not found with given id: " + studentId));
        studentRepository.deleteById(studentId);
    }

    // Profile methods
    @Override
    public StudentProfileDto getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow(()->
                new ResourceNotFoundException("Student was not found with given id: " + studentId));
        return StudentProfileMapper.mapToStudentProfileDto(student);
    }

    @Override
    public StudentDto updateStudentProfile(Long studentId, StudentDto studentDto) {
        Student student = studentRepository.findById(studentId).orElseThrow(()->
                new ResourceNotFoundException("Student was not found with given id: " + studentId));

        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhoneNumber(studentDto.getPhoneNumber());
        student.setAddress(studentDto.getAddress());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        student.setEnrollmentYear(studentDto.getEnrollmentYear());

        if (studentDto.getProfileImageUrl() != null && !studentDto.getProfileImageUrl().isEmpty()) {
            student.setProfileImageUrl(studentDto.getProfileImageUrl());
        }

        Department department = departmentRepository.findById(studentDto.getDepartmentId())
                .orElseThrow(()-> new ResourceNotFoundException("Department was not found with id: "
                        + studentDto.getDepartmentId()));
        student.setDepartment(department);

        Student savedStudent = studentRepository.save(student);
        return StudentMapper.mapToStudentDto(savedStudent);
    }

    @Override
    public StudentDto updateProfileImage(Long studentId, String imageUrl) {
        Student student = studentRepository.findById(studentId).orElseThrow(()->
                new ResourceNotFoundException("Student was not found with given id: " + studentId));

        student.setProfileImageUrl(imageUrl);
        Student savedStudent = studentRepository.save(student);

        return StudentMapper.mapToStudentDto(savedStudent);
    }
}