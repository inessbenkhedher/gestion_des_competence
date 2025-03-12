package com.example.employeservice.mappers;


import com.example.employeservice.Dto.employeedto;
import com.example.employeservice.Entites.Employee;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class Employeemapper {

    public employeedto employedtofromemployee (Employee e) {
        employeedto edto = new employeedto();
        BeanUtils.copyProperties(e, edto);
        return edto;
    }

}
