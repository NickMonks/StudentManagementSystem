package com.project.ManagementSystem.student;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

// N Tier architecture implemented using Spring framework

@RestController
@RequestMapping(path = "api/v1/students")
@AllArgsConstructor
public class StudentController {

    // Dependency injection managed by spring framework container
    private final StudentService studentService;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
    public void addStudent(@Valid @RequestBody Student student){
        studentService.addStudent(student);
    }

    // Delete Mapping of our RESTful application. REMEMBER TO ADD PATH TO ENDPOINT
    @DeleteMapping(path="{studentId}")
    public void deleteStudent(
            @PathVariable("studentId") Long studentId) {
        System.out.println(studentId);

        studentService.deleteStudent(studentId);
    }

}

