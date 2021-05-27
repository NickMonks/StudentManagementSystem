package com.project.ManagementSystem.student;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

// Include JPA to communicate to database
@ToString
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // perform validation using Spring. We need to activate them
    // inside the entry-point (Controller class)
    @NotNull
    @Column(nullable = false) // JPA Database validation
    private String name;

    @Email
    @Column(nullable = false, unique = true) // JPA Database validation
    private String email;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false) // JPA Database validation
    private Gender gender;

    public Student(String name, String email, Gender gender) {
        this.name = name;
        this.email = email;
        this.gender = gender;
    }
}

