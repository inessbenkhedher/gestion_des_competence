package com.example.employeservice.Entites;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Serviceempl {

    @Id
    @GeneratedValue
    private Long id;
    private String nom;

    @JsonIgnore
    @OneToMany(mappedBy = "service")
    private List<Post> postes;
}
