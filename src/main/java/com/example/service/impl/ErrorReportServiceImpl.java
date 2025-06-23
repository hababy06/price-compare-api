package com.example.service.impl;

import com.example.model.dto.ErrorReportDto;
import com.example.model.entity.ErrorReport;
import com.example.repository.ErrorReportRepository;
import com.example.service.ErrorReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ErrorReportServiceImpl implements ErrorReportService {
    @Autowired
    private ErrorReportRepository errorReportRepository;

    @Override
    public void reportError(ErrorReportDto dto, String username) {
        ErrorReport report = ErrorReport.builder()
                .targetId(dto.getTargetId())
                .targetType(dto.getTargetType())
                .errorType(dto.getErrorType())
                .description(dto.getDescription())
                .reporterEmail(dto.getReporterEmail())
                .createdAt(LocalDateTime.now())
                .username(username)
                .build();
        errorReportRepository.save(report);
    }

    @Override
    public List<ErrorReport> getAllReports() {
        return errorReportRepository.findAll();
    }
} 