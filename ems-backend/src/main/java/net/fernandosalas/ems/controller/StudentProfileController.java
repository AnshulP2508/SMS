package net.fernandosalas.ems.controller;

import net.fernandosalas.ems.dto.StudentDto;
import net.fernandosalas.ems.dto.StudentProfileDto;
import net.fernandosalas.ems.dto.UploadFileResponseDto;
import net.fernandosalas.ems.service.StudentService;
import net.fernandosalas.ems.service.implementation.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/student-profiles")
public class StudentProfileController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("{id}")
    public ResponseEntity<StudentProfileDto> getStudentProfile(@PathVariable("id") Long studentId) {
        StudentProfileDto profileDto = studentService.getStudentProfile(studentId);
        return new ResponseEntity<>(profileDto, HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<StudentDto> updateStudentProfile(@PathVariable("id") Long studentId,
                                                           @RequestBody StudentDto studentDto) {
        StudentDto updatedStudent = studentService.updateStudentProfile(studentId, studentDto);
        return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
    }

    @PostMapping("{id}/profile-image")
    public ResponseEntity<UploadFileResponseDto> uploadProfileImage(
            @PathVariable("id") Long studentId,
            @RequestParam("photo") MultipartFile file) {

        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/download/")
                .path(fileName)
                .toUriString();

        StudentDto updatedStudent = studentService.updateProfileImage(studentId, fileDownloadUri);

        UploadFileResponseDto response = new UploadFileResponseDto(
                fileName,
                fileDownloadUri,
                file.getContentType(),
                file.getSize()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("{id}/profile-image")
    public ResponseEntity<?> getProfileImage(@PathVariable("id") Long studentId) {
        StudentProfileDto profileDto = studentService.getStudentProfile(studentId);

        if (profileDto != null && profileDto.getProfileImageUrl() != null) {
            // Redirect to the file download endpoint
            return ResponseEntity
                    .status(HttpStatus.FOUND)
                    .header("Location", profileDto.getProfileImageUrl())
                    .build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}