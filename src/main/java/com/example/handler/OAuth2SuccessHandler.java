package com.example.handler;

import com.example.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();
        
        // 從 Google 取得用戶資料
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        
        // 建立 UserDetails 物件
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
            email,  // username
            "",     // password (空字串，因為是 OAuth 登入)
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        
        // 產生 JWT token
        String token = jwtUtil.generateToken(userDetails);
        
        // 根據 Host 動態決定 redirectUrl
        String host = request.getHeader("Host");
        String redirectUrl;
        if (host != null && host.contains("ngrok-free.app")) {
            redirectUrl = "https://" + host + "?token=" + token;
        } else if (host != null && host.contains("192.168.100.38")) {
            redirectUrl = "http://192.168.100.38:5173?token=" + token;
        } else {
            redirectUrl = "http://localhost:5173?token=" + token;
        }
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
