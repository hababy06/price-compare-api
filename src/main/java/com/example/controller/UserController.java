package com.example.controller;

import com.example.model.dto.UserProfileDTO;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public UserProfileDTO getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return userService.getProfile(userDetails.getUsername());
    }

    @PutMapping("/profile")
    public UserProfileDTO updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody UserProfileDTO dto) {
        return userService.updateProfile(userDetails.getUsername(), dto);
    }
}