package com.rspinoni.gums.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.rspinoni.gums.dao.Admin;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
}
