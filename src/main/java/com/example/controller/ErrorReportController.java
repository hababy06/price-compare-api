package com.example.controller;

import com.example.model.dto.ErrorReportDto;
import com.example.model.entity.ErrorReport;
import com.example.repository.ErrorReportRepository;
import com.example.service.ErrorReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/report-error")
public class ErrorReportController {
    @Autowired
    private ErrorReportRepository errorReportRepository;

    @Autowired
    private ErrorReportService errorReportService;

    @PostMapping
    public ResponseEntity<?> reportError(@RequestBody ErrorReportDto dto, Authentication authentication) {
        String username = authentication.getName();
        errorReportService.reportError(dto, username);
        return ResponseEntity.ok().body("回報成功");
    }

    @GetMapping
    public ResponseEntity<List<ErrorReport>> getAllReports() {
        List<ErrorReport> list = errorReportService.getAllReports();
        return ResponseEntity.ok(list);
    }
} 