package com.project.ManagementSystem.student;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// This class will handle our business logic
// The "Service" annotation will be used to inject this class into the controller via depency injection
@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        // because we extend repository JPA, we get methods that will automatically query in SQL using the methods
        return studentRepository.findAll();
    }
}
