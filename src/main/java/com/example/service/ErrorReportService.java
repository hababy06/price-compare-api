package com.example.service;

import com.example.model.dto.ErrorReportDto;
import com.example.model.entity.ErrorReport;
import java.util.List;

public interface ErrorReportService {
    void reportError(ErrorReportDto dto, String username);
    List<ErrorReport> getAllReports();
} 