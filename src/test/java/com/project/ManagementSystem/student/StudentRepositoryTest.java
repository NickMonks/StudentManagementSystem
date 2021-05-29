package com.project.ManagementSystem.student;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

// This class will test the repository methods
// we need to be careful since we don't want to test it in our ncurrent database
// instead, we will use an in-memory database called H2.

// Is an open-source sql database.

// Important: Use DataJpaTest - uses dynamic proxy to setup the database and perform all the calls
// necessary
@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository underTest;

    @AfterEach
    void tearDown() {
        // After each test, we want to have a clean state
        underTest.deleteAll();
    }

    @Test
    void itShouldCheckIfStudentSelectExistsEmail() {
        // given
        Student student = new Student(
                "Jamila",
                "Jamila@gmail.com",
                Gender.FEMALE
        );

        underTest.save(student);

        // when
        Boolean exists = underTest.selectExistsEmail("Jamila@gmail.com");

        // then
        assertThat(exists).isTrue();
    }

    @Test
    void itShouldCheckIfStudentSelectNotExistsEmail() {
        // given

        // when
        Boolean exists = underTest.selectExistsEmail("Jamila@gmail.com");

        // then
        assertThat(exists).isFalse();
    }
}