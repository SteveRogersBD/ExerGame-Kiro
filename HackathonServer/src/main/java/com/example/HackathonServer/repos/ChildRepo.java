package com.example.HackathonServer.repos;

import com.example.HackathonServer.models.Child;
import io.micrometer.observation.ObservationFilter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChildRepo extends JpaRepository<Child, Long> {
    List<Child> findByParentId(Long parentId);

    Optional<Child> findByIdAndParentId(Long id, Long parentId);
}
