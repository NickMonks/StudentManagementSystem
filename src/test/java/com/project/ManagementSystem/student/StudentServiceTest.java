package com.project.ManagementSystem.student;

import com.project.ManagementSystem.student.exceptions.BadRequestException;
import com.project.ManagementSystem.student.exceptions.StudentNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    //private AutoCloseable autoCloseable;
    private StudentService underTest;

    @BeforeEach
    void setUp() {
        // Initialize all @Mock from this class in this method
        //autoCloseable = MockitoAnnotations.openMocks(this);
        // we avoid this using the "ExtendWith" annotation in the class
        underTest = new StudentService(studentRepository);
    }

    @Test
    void canGetAllStudents() {
        // we already tested the StudentRepository class; if so, why we need to test
        // its dependencies? (common issue in unit testing) -> we mock the student repo!
        // the advantage of this that it makes testing faster and less dependent

        // when
        underTest.getAllStudents();
        // then

        // verify that the method "findAll" was invoked in the Mock object
        // i.e. it reaches the method "getAllStudents" and then just verifies it calls that method
        // which is already tested!
        verify(studentRepository).findAll();
    }

    @Test
    void canAddStudent() {
        // given
        Student student = new Student(
                "Jamila",
                "Jamila@gmail.com",
                Gender.FEMALE
        );

        //when
        underTest.addStudent(student);

        // then
        ArgumentCaptor<Student> studentArgumentCaptor
                = ArgumentCaptor.forClass(Student.class);

        // we verify that the method save was called, but also capture the object
        // that was passed as argument. This is performed with the argument captor class
        // studentRepository.save(student)
        verify(studentRepository).save(studentArgumentCaptor.capture());

        // once is captured, we extract it and assert that is equal to student
        Student capturedStudent = studentArgumentCaptor.getValue();
        assertThat(capturedStudent).isEqualTo(student);
    }

    @Test
    void willThrowWhenEmailTaken() {
        // given
        Student student = new Student(
                "Jamila",
                "Jamila@gmail.com",
                Gender.FEMALE
        );

        // in order to throw an exception, we need to mock that the email is already taken.
        // Therefore we configure our Mock. we can also pass the anyString() method
        given(studentRepository.selectExistsEmail(student.getEmail()))
                .willReturn(true);

        // when
        // then
        assertThatThrownBy(() -> underTest.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email " + student.getEmail() + " is already taken");

        // also, check that the user is indeed never added again to the db:
        verify(studentRepository, never()).save(any());

    }

    @Test
    void canDeleteStudent() {
        //given
        long id = 10;
        given(studentRepository.existsById(id))
                .willReturn(true);

        // when
        underTest.deleteStudent(id);

        // then
        verify(studentRepository).deleteById(id);
    }

    @Test
    void willThrowWhenDeleteStudentNotFound() {
        //given
        long id = 10;
        given(studentRepository.existsById(id))
                .willReturn(false);

        // when
        // then
        assertThatThrownBy(()-> underTest.deleteStudent(id))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("Student with id " + id + " does not exist");

        verify(studentRepository, never()).deleteById(any());
    }
}