package com.project.ManagementSystem.student;

import com.project.ManagementSystem.student.exceptions.BadRequestException;
import com.project.ManagementSystem.student.exceptions.StudentNotFoundException;
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

    public void addStudent(Student student) throws BadRequestException {
        // check if email is taken:
        Boolean existsEmail = studentRepository
                .selectExistsEmail(student.getEmail());
        if (existsEmail){
            throw new BadRequestException("Email " + student.getEmail() + " is already taken");
        }
        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) throws StudentNotFoundException {
        if (!studentRepository.existsById(studentId)){
            throw new StudentNotFoundException("Student with id " + studentId + " does not exist");
        }
        studentRepository.deleteById(studentId);
    }
}
