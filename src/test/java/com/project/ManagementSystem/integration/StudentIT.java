package com.project.ManagementSystem.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;
import com.project.ManagementSystem.student.Gender;
import com.project.ManagementSystem.student.Student;
import com.project.ManagementSystem.student.StudentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Maven failsafe plugin will look for any class that ends with "IT", which stands
// for integration testing. We use the @SpringBootTest annotation.

// Another thing to take into account is the fact that we need to run in the correct database.
// to do so, we create a new application.properties and we will use this source in this class

// Formally speaking, the integration testing will consist on firing some HTTP request to the controller
// and see how the system works as a whole, to test the PostMapping and GettMapping.

// We use MockMVC for this
@SpringBootTest
@TestPropertySource(
        locations = "classpath:application-it.properties"
)
@AutoConfigureMockMvc
public class StudentIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper; // use this object to marshall the student to json payload

    @Autowired
    private StudentRepository studentRepository;

    private final Faker faker = new Faker();

    @Test
    void canRegisterNewStudent() throws Exception {
        //given
        Student student = new Student(
                String.format("%s %s",
                        faker.name().firstName(),
                        faker.name().lastName()),
                String.format("%s@gmail.com", faker.name().firstName().trim().toLowerCase()),
                Gender.FEMALE
        );
        // when
        // then
        // IMPORTANT: DONT FORGET "/"
        ResultActions resultActions = mockMvc.perform(post("/api/v1/students")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(student)))
        .andExpect(status().isOk());

        List<Student> students = studentRepository.findAll();
        assertThat(students).usingElementComparatorIgnoringFields("id")
                            .contains(student);
    }
}
