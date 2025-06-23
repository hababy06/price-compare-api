package com.example.repository;

import com.example.model.entity.ErrorReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ErrorReportRepository extends JpaRepository<ErrorReport, Long> {
} 