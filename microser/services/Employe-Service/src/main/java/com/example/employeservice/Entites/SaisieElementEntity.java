package com.example.employeservice.Entites;



import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name=IConstante.TABLE_GP_ELEMENT_SAISIE)
public class SaisieElementEntity implements Serializable {
	
	private static final long serialVersionUID = -4195611806305175159L;

	@Id
	@SequenceGenerator(name="ELEMENT_SAISIE_ID_GENERATOR", sequenceName=IConstante.SEQUENCE_GP_ELEMENT_SAISIE, allocationSize=1)
	@GeneratedValue(strategy=GenerationType.SEQUENCE, generator="ELEMENT_SAISIE_ID_GENERATOR")
    private Long id;
	
	@Column(name = "CODE_BARRE")
	private String codeBarre;
	
	

	
	
	@Column(name = "QUANTITE")
	private Long quantite;

	@Column(name = "num_of")
	private String ordreFabricationNumero;
	
	

	
	
	// Colonnes Optimisation 
	// Ghazi 27/06/2019
	
	

	@Column(name = "reference")
	private String reference;
	@Column(name = "designation")
	private String designation;
	

	@Column(name = "code_conception")
	private String codeConception;
	
    @Column(name="operation_code")
    private String operationCode ;
    
    @Column(name="designation_complement")
    private String designationComplement; 
    
    @Column(name="code_Par_section")
    private String codeParSection; 
    
    
    
    	
	@Column(name = "client_designation")
	private String clientDesignation ;
        @Column(name="temps")
	private Double temps;		
      @Column(name="idCompetence")
	private Long idCompetence
;
	





}