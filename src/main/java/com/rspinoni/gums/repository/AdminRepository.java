package com.rspinoni.gums.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.rspinoni.gums.model.Admin;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
}
