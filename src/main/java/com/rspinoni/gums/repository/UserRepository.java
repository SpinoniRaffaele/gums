package com.rspinoni.gums.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.rspinoni.gums.dao.User;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {
}
