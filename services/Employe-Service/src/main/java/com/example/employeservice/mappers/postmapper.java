package com.example.employeservice.mappers;

import com.example.employeservice.Dto.postdto;
import com.example.employeservice.Entites.Post;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class postmapper {

    public postdto postdtofrompostt (Post p) {
        postdto pdto = new postdto();
        BeanUtils.copyProperties(p, pdto);
        return pdto;
    }
}
